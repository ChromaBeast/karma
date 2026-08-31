package vault

import (
	"bytes"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

var (
	ErrKeyNotFound        = errors.New("API key not found for user and provider")
	ErrUnsupportedProvider = errors.New("unsupported BYOK provider")
	ErrEmptyKey           = errors.New("API key cannot be empty")
)

type VaultKeyRecord struct {
	ID              uuid.UUID
	UserID          uuid.UUID
	Provider        models.VaultProvider
	EncryptedKey    []byte
	KeyIV           []byte
	DataKeyWrapped  []byte
	DataKeyIV       []byte
	KeyLast4        string
	IsActive        bool
	ValidatedAt     *time.Time
	CreatedAt       time.Time
}

type VaultService struct {
	kmsKey *KMSMasterKey
	mu     sync.RWMutex
	store  map[string]*VaultKeyRecord // key: "userID:provider"
}

func NewVaultService(kmsKey *KMSMasterKey) *VaultService {
	return &VaultService{
		kmsKey: kmsKey,
		store:  make(map[string]*VaultKeyRecord),
	}
}

func extractLast4(key string) string {
	if len(key) <= 4 {
		return key
	}
	return key[len(key)-4:]
}

func (v *VaultService) StoreKey(userID uuid.UUID, provider models.VaultProvider, rawKey string) (*models.VaultKeyResponse, error) {
	if rawKey == "" {
		return nil, ErrEmptyKey
	}
	switch provider {
	case models.ProviderAnthropic, models.ProviderOpenAI, models.ProviderGemini:
	default:
		return nil, ErrUnsupportedProvider
	}

	dataKey, err := GenerateAES256Key()
	if err != nil {
		return nil, fmt.Errorf("failed to generate data key: %w", err)
	}

	encryptedKey, keyIV, err := EncryptAESGCM([]byte(rawKey), dataKey)
	if err != nil {
		return nil, fmt.Errorf("failed to encrypt api key: %w", err)
	}

	wrappedDataKey, dataKeyIV, err := v.kmsKey.WrapDataKey(dataKey)
	if err != nil {
		return nil, fmt.Errorf("failed to wrap data key with KMS master key: %w", err)
	}

	last4 := extractLast4(rawKey)
	now := time.Now().UTC()

	record := &VaultKeyRecord{
		ID:             uuid.New(),
		UserID:         userID,
		Provider:       provider,
		EncryptedKey:   encryptedKey,
		KeyIV:          keyIV,
		DataKeyWrapped: wrappedDataKey,
		DataKeyIV:      dataKeyIV,
		KeyLast4:       last4,
		IsActive:       true,
		ValidatedAt:    &now,
		CreatedAt:      now,
	}

	storeKey := fmt.Sprintf("%s:%s", userID, provider)
	v.mu.Lock()
	v.store[storeKey] = record
	v.mu.Unlock()

	return &models.VaultKeyResponse{
		ID:          record.ID,
		Provider:    record.Provider,
		KeyLast4:    record.KeyLast4,
		IsActive:    record.IsActive,
		ValidatedAt: record.ValidatedAt,
		CreatedAt:   record.CreatedAt,
	}, nil
}

func (v *VaultService) DecryptKey(userID uuid.UUID, provider models.VaultProvider) (string, error) {
	storeKey := fmt.Sprintf("%s:%s", userID, provider)
	v.mu.RLock()
	record, exists := v.store[storeKey]
	v.mu.RUnlock()

	if !exists || !record.IsActive {
		return "", ErrKeyNotFound
	}

	dataKey, err := v.kmsKey.UnwrapDataKey(record.DataKeyWrapped, record.DataKeyIV)
	if err != nil {
		return "", fmt.Errorf("failed to unwrap data key: %w", err)
	}

	plaintextBytes, err := DecryptAESGCM(record.EncryptedKey, record.KeyIV, dataKey)
	if err != nil {
		return "", fmt.Errorf("failed to decrypt api key: %w", err)
	}

	return string(bytes.TrimSpace(plaintextBytes)), nil
}

func (v *VaultService) ListKeys(userID uuid.UUID) []models.VaultKeyResponse {
	v.mu.RLock()
	defer v.mu.RUnlock()

	var results []models.VaultKeyResponse
	for _, rec := range v.store {
		if rec.UserID == userID && rec.IsActive {
			results = append(results, models.VaultKeyResponse{
				ID:          rec.ID,
				Provider:    rec.Provider,
				KeyLast4:    rec.KeyLast4,
				IsActive:    rec.IsActive,
				ValidatedAt: rec.ValidatedAt,
				CreatedAt:   rec.CreatedAt,
			})
		}
	}
	return results
}

func (v *VaultService) DeleteKey(userID uuid.UUID, provider models.VaultProvider) error {
	storeKey := fmt.Sprintf("%s:%s", userID, provider)
	v.mu.Lock()
	defer v.mu.Unlock()

	record, exists := v.store[storeKey]
	if !exists {
		return ErrKeyNotFound
	}
	record.IsActive = false
	delete(v.store, storeKey)
	return nil
}
