package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type MockupRepository struct {
	db *sql.DB
}

func NewMockupRepository(db *sql.DB) *MockupRepository {
	return &MockupRepository{db: db}
}

func (r *MockupRepository) SaveMockup(ctx context.Context, m *models.Mockup) error {
	if r.db == nil {
		return nil
	}
	paramsJSON, _ := json.Marshal(m.Params)
	query := `
		INSERT INTO mockups (id, user_id, career_node_id, asset_type, source_image_url, rendered_url, params, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		ON CONFLICT (id) DO NOTHING;
	`
	_, err := r.db.ExecContext(ctx, query, m.ID, m.UserID, m.CareerNodeID, string(m.AssetType), m.SourceImageURL, m.RenderedURL, paramsJSON, m.CreatedAt)
	return err
}

func (r *MockupRepository) ListMockups(ctx context.Context, userID uuid.UUID) ([]*models.Mockup, error) {
	if r.db == nil {
		return nil, errors.New("db not connected")
	}
	query := `
		SELECT id, user_id, career_node_id, asset_type, source_image_url, rendered_url, params, created_at
		FROM mockups WHERE user_id = $1 ORDER BY created_at DESC;
	`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []*models.Mockup
	for rows.Next() {
		var m models.Mockup
		var paramsJSON []byte
		var assetType string
		if err := rows.Scan(&m.ID, &m.UserID, &m.CareerNodeID, &assetType, &m.SourceImageURL, &m.RenderedURL, &paramsJSON, &m.CreatedAt); err == nil {
			m.AssetType = models.MockupAssetType(assetType)
			if len(paramsJSON) > 0 {
				_ = json.Unmarshal(paramsJSON, &m.Params)
			}
			list = append(list, &m)
		}
	}
	return list, nil
}
