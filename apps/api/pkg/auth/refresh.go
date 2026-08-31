package auth

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

var (
	ErrRefreshTokenNotFound = errors.New("refresh token not found")
	ErrRefreshTokenExpired  = errors.New("refresh token expired")
	ErrRefreshTokenRevoked  = errors.New("refresh token already revoked")
	ErrRefreshTokenReused   = errors.New("refresh token reuse detected; token family revoked")
)

type RefreshTokenManager struct {
	mu     sync.RWMutex
	tokens map[string]*models.RefreshToken // key: token_hash
	ttl    time.Duration
}

func NewRefreshTokenManager(ttl time.Duration) *RefreshTokenManager {
	if ttl <= 0 {
		ttl = 30 * 24 * time.Hour
	}
	return &RefreshTokenManager{
		tokens: make(map[string]*models.RefreshToken),
		ttl:    ttl,
	}
}

func HashToken(rawToken string) string {
	sum := sha256.Sum256([]byte(rawToken))
	return hex.EncodeToString(sum[:])
}

func generateSecureString(bytesLen int) (string, error) {
	b := make([]byte, bytesLen)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

func (m *RefreshTokenManager) CreateInitialToken(userID uuid.UUID) (string, *models.RefreshToken, error) {
	rawToken, err := generateSecureString(32)
	if err != nil {
		return "", nil, err
	}

	tokenHash := HashToken(rawToken)
	now := time.Now().UTC()
	familyID := uuid.New()

	token := &models.RefreshToken{
		ID:        uuid.New(),
		UserID:    userID,
		FamilyID:  familyID,
		TokenHash: tokenHash,
		ExpiresAt: now.Add(m.ttl),
		CreatedAt: now,
	}

	m.mu.Lock()
	m.tokens[tokenHash] = token
	m.mu.Unlock()

	return rawToken, token, nil
}

func (m *RefreshTokenManager) RotateToken(rawToken string) (string, *models.RefreshToken, error) {
	tokenHash := HashToken(rawToken)
	now := time.Now().UTC()

	m.mu.Lock()
	defer m.mu.Unlock()

	oldToken, exists := m.tokens[tokenHash]
	if !exists {
		return "", nil, ErrRefreshTokenNotFound
	}

	if oldToken.RevokedAt != nil {
		// REUSE DETECTED: Revoke entire family!
		for _, t := range m.tokens {
			if t.FamilyID == oldToken.FamilyID && t.RevokedAt == nil {
				revTime := now
				t.RevokedAt = &revTime
			}
		}
		return "", nil, ErrRefreshTokenReused
	}

	if now.After(oldToken.ExpiresAt) {
		revTime := now
		oldToken.RevokedAt = &revTime
		return "", nil, ErrRefreshTokenExpired
	}

	// Revoke current token
	revTime := now
	oldToken.RevokedAt = &revTime

	// Issue new token in same family
	newRawToken, err := generateSecureString(32)
	if err != nil {
		return "", nil, err
	}

	newTokenHash := HashToken(newRawToken)
	oldID := oldToken.ID
	newToken := &models.RefreshToken{
		ID:          uuid.New(),
		UserID:      oldToken.UserID,
		FamilyID:    oldToken.FamilyID,
		TokenHash:   newTokenHash,
		RotatedFrom: &oldID,
		ExpiresAt:   now.Add(m.ttl),
		CreatedAt:   now,
	}

	m.tokens[newTokenHash] = newToken
	return newRawToken, newToken, nil
}

func (m *RefreshTokenManager) RevokeFamily(familyID uuid.UUID) {
	m.mu.Lock()
	defer m.mu.Unlock()

	now := time.Now().UTC()
	for _, t := range m.tokens {
		if t.FamilyID == familyID && t.RevokedAt == nil {
			revTime := now
			t.RevokedAt = &revTime
		}
	}
}
