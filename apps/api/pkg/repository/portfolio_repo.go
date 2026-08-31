package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type PortfolioRepository struct {
	db *sql.DB
}

func NewPortfolioRepository(db *sql.DB) *PortfolioRepository {
	return &PortfolioRepository{db: db}
}

func (r *PortfolioRepository) UpsertPortfolio(ctx context.Context, p *models.Portfolio) error {
	if r.db == nil {
		return nil
	}
	configJSON, _ := json.Marshal(p.Config)
	query := `
		INSERT INTO portfolios (id, user_id, theme_id, subdomain, custom_domain, config, published_at, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		ON CONFLICT (user_id) DO UPDATE SET
			theme_id = EXCLUDED.theme_id,
			subdomain = EXCLUDED.subdomain,
			custom_domain = EXCLUDED.custom_domain,
			config = EXCLUDED.config,
			published_at = EXCLUDED.published_at;
	`
	_, err := r.db.ExecContext(ctx, query, p.ID, p.UserID, p.ThemeID, p.Subdomain, p.CustomDomain, configJSON, p.PublishedAt, p.CreatedAt)
	return err
}

func (r *PortfolioRepository) GetByUserID(ctx context.Context, userID uuid.UUID) (*models.Portfolio, error) {
	if r.db == nil {
		return nil, errors.New("db not connected")
	}
	query := `
		SELECT id, user_id, theme_id, subdomain, custom_domain, domain_verified_at, config, published_at, created_at
		FROM portfolios WHERE user_id = $1 LIMIT 1;
	`
	var p models.Portfolio
	var configJSON []byte
	err := r.db.QueryRowContext(ctx, query, userID).Scan(
		&p.ID, &p.UserID, &p.ThemeID, &p.Subdomain, &p.CustomDomain, &p.DomainVerifiedAt, &configJSON, &p.PublishedAt, &p.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	if len(configJSON) > 0 {
		_ = json.Unmarshal(configJSON, &p.Config)
	}
	return &p, nil
}

func (r *PortfolioRepository) GetBySubdomain(ctx context.Context, subdomain string) (*models.Portfolio, error) {
	if r.db == nil {
		return nil, errors.New("db not connected")
	}
	query := `
		SELECT id, user_id, theme_id, subdomain, custom_domain, domain_verified_at, config, published_at, created_at
		FROM portfolios WHERE LOWER(subdomain) = LOWER($1) LIMIT 1;
	`
	var p models.Portfolio
	var configJSON []byte
	err := r.db.QueryRowContext(ctx, query, subdomain).Scan(
		&p.ID, &p.UserID, &p.ThemeID, &p.Subdomain, &p.CustomDomain, &p.DomainVerifiedAt, &configJSON, &p.PublishedAt, &p.CreatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	if len(configJSON) > 0 {
		_ = json.Unmarshal(configJSON, &p.Config)
	}
	return &p, nil
}

func (r *PortfolioRepository) Publish(ctx context.Context, userID uuid.UUID) (*models.Portfolio, error) {
	if r.db == nil {
		return nil, errors.New("db not connected")
	}
	now := time.Now().UTC()
	query := `UPDATE portfolios SET published_at = $1 WHERE user_id = $2 RETURNING id, theme_id, subdomain, custom_domain, config, created_at;`
	var p models.Portfolio
	var configJSON []byte
	p.UserID = userID
	p.PublishedAt = &now
	err := r.db.QueryRowContext(ctx, query, now, userID).Scan(&p.ID, &p.ThemeID, &p.Subdomain, &p.CustomDomain, &configJSON, &p.CreatedAt)
	if err != nil {
		return nil, err
	}
	if len(configJSON) > 0 {
		_ = json.Unmarshal(configJSON, &p.Config)
	}
	return &p, nil
}

func (r *PortfolioRepository) SetProjects(ctx context.Context, portfolioID uuid.UUID, nodeIDs []uuid.UUID) ([]*models.PortfolioProject, error) {
	if r.db == nil {
		return nil, errors.New("db not connected")
	}
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	_, _ = tx.ExecContext(ctx, `DELETE FROM portfolio_projects WHERE portfolio_id = $1;`, portfolioID)

	var result []*models.PortfolioProject
	for i, nid := range nodeIDs {
		proj := &models.PortfolioProject{
			ID:           uuid.New(),
			PortfolioID:  portfolioID,
			CareerNodeID: nid,
			DisplayOrder: i,
		}
		_, err := tx.ExecContext(ctx, `INSERT INTO portfolio_projects (id, portfolio_id, career_node_id, display_order) VALUES ($1, $2, $3, $4);`,
			proj.ID, proj.PortfolioID, proj.CareerNodeID, proj.DisplayOrder)
		if err == nil {
			result = append(result, proj)
		}
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}
	return result, nil
}
