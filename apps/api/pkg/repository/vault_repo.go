package repository

import (
	"context"
	"database/sql"
	"fmt"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type VaultRepository struct {
	db *sql.DB
}

func NewVaultRepository(db *sql.DB) *VaultRepository {
	return &VaultRepository{db: db}
}

func (r *VaultRepository) UpsertKey(ctx context.Context, k *models.APIKeyVault) error {
	query := `
		INSERT INTO api_key_vault (
			id, user_id, provider, encrypted_key, key_iv, data_key_wrapped,
			key_last4, is_active, validated_at, created_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10
		)
		ON CONFLICT (user_id, provider) DO UPDATE SET
			encrypted_key = EXCLUDED.encrypted_key,
			key_iv = EXCLUDED.key_iv,
			data_key_wrapped = EXCLUDED.data_key_wrapped,
			key_last4 = EXCLUDED.key_last4,
			is_active = EXCLUDED.is_active,
			validated_at = EXCLUDED.validated_at`

	if k.ID == uuid.Nil {
		k.ID = uuid.New()
	}
	if k.CreatedAt.IsZero() {
		k.CreatedAt = time.Now().UTC()
	}

	_, err := r.db.ExecContext(
		ctx, query,
		k.ID, k.UserID, string(k.Provider), k.EncryptedKey, k.KeyIV, k.DataKeyWrapped,
		k.KeyLast4, k.IsActive, k.ValidatedAt, k.CreatedAt,
	)
	return err
}

func (r *VaultRepository) GetKey(ctx context.Context, userID uuid.UUID, provider models.VaultProvider) (*models.APIKeyVault, error) {
	query := `
		SELECT id, user_id, provider, encrypted_key, key_iv, data_key_wrapped,
		       key_last4, is_active, validated_at, created_at
		FROM api_key_vault
		WHERE user_id = $1 AND provider = $2`

	row := r.db.QueryRowContext(ctx, query, userID, string(provider))
	var k models.APIKeyVault
	var prov string

	err := row.Scan(
		&k.ID, &k.UserID, &prov, &k.EncryptedKey, &k.KeyIV, &k.DataKeyWrapped,
		&k.KeyLast4, &k.IsActive, &k.ValidatedAt, &k.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	k.Provider = models.VaultProvider(prov)
	return &k, nil
}

func (r *VaultRepository) ListKeys(ctx context.Context, userID uuid.UUID) ([]*models.APIKeyVault, error) {
	query := `
		SELECT id, user_id, provider, encrypted_key, key_iv, data_key_wrapped,
		       key_last4, is_active, validated_at, created_at
		FROM api_key_vault
		WHERE user_id = $1 ORDER BY created_at ASC`

	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to list vault keys: %w", err)
	}
	defer rows.Close()

	var keys []*models.APIKeyVault
	for rows.Next() {
		var k models.APIKeyVault
		var prov string
		err := rows.Scan(
			&k.ID, &k.UserID, &prov, &k.EncryptedKey, &k.KeyIV, &k.DataKeyWrapped,
			&k.KeyLast4, &k.IsActive, &k.ValidatedAt, &k.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		k.Provider = models.VaultProvider(prov)
		keys = append(keys, &k)
	}
	return keys, nil
}

func (r *VaultRepository) DeleteKey(ctx context.Context, userID uuid.UUID, provider models.VaultProvider) error {
	query := `DELETE FROM api_key_vault WHERE user_id = $1 AND provider = $2`
	_, err := r.db.ExecContext(ctx, query, userID, string(provider))
	return err
}
