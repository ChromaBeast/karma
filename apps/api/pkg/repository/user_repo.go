package repository

import (
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type UserRepository struct {
	db *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) CreateUser(ctx context.Context, u *models.User) error {
	if r.db == nil {
		return nil
	}
	const q = `
		INSERT INTO users (id, linkedin_sub, email, name, password_hash, avatar_url, headline, plan_tier, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		ON CONFLICT (email) DO UPDATE
		SET name = EXCLUDED.name,
		    password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash),
		    updated_at = NOW();
	`
	_, err := r.db.ExecContext(ctx, q,
		u.ID, u.LinkedInSub, u.Email, u.Name, u.PasswordHash,
		u.AvatarURL, u.Headline, string(u.PlanTier), u.CreatedAt, u.UpdatedAt,
	)
	return err
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (*models.User, error) {
	if r.db == nil {
		return nil, errors.New("database not connected")
	}
	const q = `
		SELECT id, linkedin_sub, email, name, COALESCE(password_hash, ''), avatar_url, headline, plan_tier, created_at, updated_at
		FROM users
		WHERE LOWER(email) = LOWER($1)
		LIMIT 1;
	`
	var u models.User
	var planTier string
	err := r.db.QueryRowContext(ctx, q, email).Scan(
		&u.ID, &u.LinkedInSub, &u.Email, &u.Name, &u.PasswordHash,
		&u.AvatarURL, &u.Headline, &planTier, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	u.PlanTier = models.PlanTier(planTier)
	return &u, nil
}

func (r *UserRepository) GetByID(ctx context.Context, id uuid.UUID) (*models.User, error) {
	if r.db == nil {
		return nil, errors.New("database not connected")
	}
	const q = `
		SELECT id, linkedin_sub, email, name, COALESCE(password_hash, ''), avatar_url, headline, plan_tier, created_at, updated_at
		FROM users
		WHERE id = $1
		LIMIT 1;
	`
	var u models.User
	var planTier string
	err := r.db.QueryRowContext(ctx, q, id).Scan(
		&u.ID, &u.LinkedInSub, &u.Email, &u.Name, &u.PasswordHash,
		&u.AvatarURL, &u.Headline, &planTier, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	u.PlanTier = models.PlanTier(planTier)
	return &u, nil
}
