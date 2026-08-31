package vault

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
	"karma/apps/api/pkg/repository"
)

var (
	ErrKeyNotFound        = errors.New("API key not found for user and provider")
	ErrUnsupportedProvider = errors.New("unsupported BYOK provider")
	ErrEmptyKey           = errors.New("API key cannot be empty")
)

type VaultKeyRecord struct {
	ID             uuid.UUID
	UserID         uuid.UUID
	Provider       models.VaultProvider
	EncryptedKey   []byte
	KeyIV          []byte
	DataKeyWrapped []byte
	DataKeyIV      []byte
	KeyLast4       string
	IsActive       bool
	ValidatedAt    *time.Time
	CreatedAt      time.Time
}

type VaultService struct {
	kmsKey *KMSMasterKey
	repo   *repository.VaultRepository
	mu     sync.RWMutex
	store  map[string]*VaultKeyRecord
}

func NewVaultService(kmsKey *KMSMasterKey, repo ...*repository.VaultRepository) *VaultService {
	svc := &VaultService{
		kmsKey: kmsKey,
		store:  make(map[string]*VaultKeyRecord),
	}
	if len(repo) > 0 && repo[0] != nil {
		svc.repo = repo[0]
	}
	return svc
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
	if provider != models.ProviderAnthropic && provider != models.ProviderOpenAI && provider != models.ProviderGemini {
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
		return nil, fmt.Errorf("failed to wrap data key: %w", err)
	}

	last4 := extractLast4(rawKey)
	now := time.Now().UTC()
	record := &VaultKeyRecord{
		ID:             uuid.New(),
		UserID:         userID,
		Provider:       provider,
		EncryptedKey:   encryptedKey,
		KeyIV:          append(keyIV, dataKeyIV...),
		DataKeyWrapped: wrappedDataKey,
		KeyLast4:       last4,
		IsActive:       true,
		ValidatedAt:    &now,
		CreatedAt:      now,
	}

	storeKey := fmt.Sprintf("%s:%s", userID, provider)
	v.mu.Lock()
	v.store[storeKey] = record
	v.mu.Unlock()

	if v.repo != nil {
		_ = v.repo.UpsertKey(context.Background(), &models.APIKeyVault{
			ID:             record.ID,
			UserID:         userID,
			Provider:       provider,
			EncryptedKey:   encryptedKey,
			KeyIV:          record.KeyIV,
			DataKeyWrapped: wrappedDataKey,
			KeyLast4:       last4,
			IsActive:       true,
			ValidatedAt:    &now,
			CreatedAt:      now,
		})
	}

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
		if v.repo != nil {
			dbKey, err := v.repo.GetKey(context.Background(), userID, provider)
			if err == nil && dbKey != nil && dbKey.IsActive {
				record = &VaultKeyRecord{
					ID:             dbKey.ID,
					UserID:         dbKey.UserID,
					Provider:       dbKey.Provider,
					EncryptedKey:   dbKey.EncryptedKey,
					KeyIV:          dbKey.KeyIV,
					DataKeyWrapped: dbKey.DataKeyWrapped,
					KeyLast4:       dbKey.KeyLast4,
					IsActive:       dbKey.IsActive,
					ValidatedAt:    dbKey.ValidatedAt,
					CreatedAt:      dbKey.CreatedAt,
				}
				exists = true
			}
		}
	}

	if !exists || !record.IsActive {
		return "", ErrKeyNotFound
	}

	keyIV := record.KeyIV
	var dataKeyIV []byte
	if len(keyIV) >= 24 {
		dataKeyIV = keyIV[12:24]
		keyIV = keyIV[:12]
	}

	dataKey, err := v.kmsKey.UnwrapDataKey(record.DataKeyWrapped, dataKeyIV)
	if err != nil {
		return "", fmt.Errorf("failed to unwrap data key: %w", err)
	}

	plaintextBytes, err := DecryptAESGCM(record.EncryptedKey, keyIV, dataKey)
	if err != nil {
		return "", fmt.Errorf("failed to decrypt api key: %w", err)
	}
	return string(bytes.TrimSpace(plaintextBytes)), nil
}

func (v *VaultService) ListKeys(userID uuid.UUID) []models.VaultKeyResponse {
	if v.repo != nil {
		if keys, err := v.repo.ListKeys(context.Background(), userID); err == nil && len(keys) > 0 {
			var resp []models.VaultKeyResponse
			for _, k := range keys {
				resp = append(resp, models.VaultKeyResponse{
					ID:          k.ID,
					Provider:    k.Provider,
					KeyLast4:    k.KeyLast4,
					IsActive:    k.IsActive,
					ValidatedAt: k.ValidatedAt,
					CreatedAt:   k.CreatedAt,
				})
			}
			return resp
		}
	}
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
	if v.repo != nil {
		_ = v.repo.DeleteKey(context.Background(), userID, provider)
	}
	storeKey := fmt.Sprintf("%s:%s", userID, provider)
	v.mu.Lock()
	defer v.mu.Unlock()
	delete(v.store, storeKey)
	return nil
}
