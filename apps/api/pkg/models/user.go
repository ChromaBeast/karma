package models

import (
	"time"

	"github.com/google/uuid"
)

type PlanTier string

const (
	PlanTierFree              PlanTier = "free"
	PlanTierAccess            PlanTier = "access"
	PlanTierAccessPlusCredits PlanTier = "access_plus_credits"
)

type User struct {
	ID           uuid.UUID `json:"id"`
	LinkedInSub  string    `json:"linkedin_sub"`
	Email        string    `json:"email"`
	Name         string    `json:"name"`
	PasswordHash string    `json:"-"`
	AvatarURL    *string   `json:"avatar_url,omitempty"`
	Headline     *string   `json:"headline,omitempty"`
	PlanTier     PlanTier  `json:"plan_tier"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type RefreshToken struct {
	ID          uuid.UUID  `json:"id"`
	UserID      uuid.UUID  `json:"user_id"`
	FamilyID    uuid.UUID  `json:"family_id"`
	TokenHash   string     `json:"-"`
	RotatedFrom *uuid.UUID `json:"rotated_from,omitempty"`
	RevokedAt   *time.Time `json:"revoked_at,omitempty"`
	ExpiresAt   time.Time  `json:"expires_at"`
	CreatedAt   time.Time  `json:"created_at"`
}

type AuthResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	TokenType    string `json:"token_type"`
	ExpiresIn    int64  `json:"expires_in"`
	User         User   `json:"user"`
}
