package models

import (
	"time"

	"github.com/google/uuid"
)

type MockupAssetType string

const (
	MockupDeviceFrame MockupAssetType = "device_frame"
	MockupSocialCard  MockupAssetType = "social_card"
)

type Portfolio struct {
	ID               uuid.UUID              `json:"id"`
	UserID           uuid.UUID              `json:"user_id"`
	ThemeID          string                 `json:"theme_id"`
	Subdomain        string                 `json:"subdomain"`
	CustomDomain     *string                `json:"custom_domain,omitempty"`
	DomainVerifiedAt *time.Time             `json:"domain_verified_at,omitempty"`
	Config           map[string]interface{} `json:"config"`
	PublishedAt      *time.Time             `json:"published_at,omitempty"`
	CreatedAt        time.Time              `json:"created_at"`
}

type PortfolioProject struct {
	ID           uuid.UUID `json:"id"`
	PortfolioID  uuid.UUID `json:"portfolio_id"`
	CareerNodeID uuid.UUID `json:"career_node_id"`
	DisplayOrder int       `json:"display_order"`
}

type Mockup struct {
	ID             uuid.UUID              `json:"id"`
	UserID         uuid.UUID              `json:"user_id"`
	CareerNodeID   *uuid.UUID             `json:"career_node_id,omitempty"`
	AssetType      MockupAssetType        `json:"asset_type"`
	SourceImageURL string                 `json:"source_image_url"`
	RenderedURL    *string                `json:"rendered_url,omitempty"`
	Params         map[string]interface{} `json:"params"`
	CreatedAt      time.Time              `json:"created_at"`
}
