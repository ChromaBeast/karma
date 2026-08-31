package auth

import (
	"context"
	"crypto/rand"
	"crypto/sha256"
	"database/sql"
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
	db     *sql.DB
	tokens map[string]*models.RefreshToken
	ttl    time.Duration
}

func NewRefreshTokenManager(ttl time.Duration, db ...*sql.DB) *RefreshTokenManager {
	if ttl <= 0 {
		ttl = 90 * 24 * time.Hour
	}
	mgr := &RefreshTokenManager{
		tokens: make(map[string]*models.RefreshToken),
		ttl:    ttl,
	}
	if len(db) > 0 && db[0] != nil {
		mgr.db = db[0]
	}
	return mgr
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

	if m.db != nil {
		q := `INSERT INTO refresh_tokens (id, user_id, family_id, token_hash, expires_at, created_at) VALUES ($1, $2, $3, $4, $5, $6);`
		_, _ = m.db.ExecContext(context.Background(), q, token.ID, token.UserID, token.FamilyID, token.TokenHash, token.ExpiresAt, token.CreatedAt)
	}

	m.mu.Lock()
	m.tokens[tokenHash] = token
	m.mu.Unlock()

	return rawToken, token, nil
}

func (m *RefreshTokenManager) RotateToken(rawToken string) (string, *models.RefreshToken, error) {
	tokenHash := HashToken(rawToken)
	now := time.Now().UTC()

	var oldToken *models.RefreshToken
	if m.db != nil {
		q := `SELECT id, user_id, family_id, token_hash, rotated_from, revoked_at, expires_at, created_at FROM refresh_tokens WHERE token_hash = $1 LIMIT 1;`
		var t models.RefreshToken
		err := m.db.QueryRowContext(context.Background(), q, tokenHash).Scan(
			&t.ID, &t.UserID, &t.FamilyID, &t.TokenHash, &t.RotatedFrom, &t.RevokedAt, &t.ExpiresAt, &t.CreatedAt,
		)
		if err == nil {
			oldToken = &t
		}
	}

	m.mu.Lock()
	defer m.mu.Unlock()

	if oldToken == nil {
		var exists bool
		oldToken, exists = m.tokens[tokenHash]
		if !exists {
			return "", nil, ErrRefreshTokenNotFound
		}
	}

	if oldToken.RevokedAt != nil {
		m.revokeFamilyInternal(oldToken.FamilyID, now)
		return "", nil, ErrRefreshTokenReused
	}

	if now.After(oldToken.ExpiresAt) {
		revTime := now
		oldToken.RevokedAt = &revTime
		if m.db != nil {
			_, _ = m.db.ExecContext(context.Background(), `UPDATE refresh_tokens SET revoked_at = $1 WHERE id = $2;`, revTime, oldToken.ID)
		}
		return "", nil, ErrRefreshTokenExpired
	}

	// Revoke old token
	revTime := now
	oldToken.RevokedAt = &revTime
	if m.db != nil {
		_, _ = m.db.ExecContext(context.Background(), `UPDATE refresh_tokens SET revoked_at = $1 WHERE id = $2;`, revTime, oldToken.ID)
	}

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

	if m.db != nil {
		q := `INSERT INTO refresh_tokens (id, user_id, family_id, token_hash, rotated_from, expires_at, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7);`
		_, _ = m.db.ExecContext(context.Background(), q, newToken.ID, newToken.UserID, newToken.FamilyID, newToken.TokenHash, newToken.RotatedFrom, newToken.ExpiresAt, newToken.CreatedAt)
	}

	m.tokens[newTokenHash] = newToken
	return newRawToken, newToken, nil
}

func (m *RefreshTokenManager) revokeFamilyInternal(familyID uuid.UUID, now time.Time) {
	if m.db != nil {
		_, _ = m.db.ExecContext(context.Background(), `UPDATE refresh_tokens SET revoked_at = $1 WHERE family_id = $2 AND revoked_at IS NULL;`, now, familyID)
	}
	for _, t := range m.tokens {
		if t.FamilyID == familyID && t.RevokedAt == nil {
			t.RevokedAt = &now
		}
	}
}

func (m *RefreshTokenManager) RevokeToken(rawToken string) {
	tokenHash := HashToken(rawToken)
	now := time.Now().UTC()
	if m.db != nil {
		_, _ = m.db.ExecContext(context.Background(), `UPDATE refresh_tokens SET revoked_at = $1 WHERE token_hash = $2;`, now, tokenHash)
	}
	m.mu.Lock()
	defer m.mu.Unlock()
	if t, exists := m.tokens[tokenHash]; exists {
		t.RevokedAt = &now
	}
}
