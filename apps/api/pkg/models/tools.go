package models

import (
	"time"

	"github.com/google/uuid"
)

type LinkedInAssetType string

const (
	LinkedInHeadline LinkedInAssetType = "headline"
	LinkedInAbout    LinkedInAssetType = "about"
	LinkedInPost     LinkedInAssetType = "post"
)

type LinkedInAssetStatus string

const (
	StatusDraft     LinkedInAssetStatus = "draft"
	StatusCopied    LinkedInAssetStatus = "copied"
	StatusPublished LinkedInAssetStatus = "published"
)

type LinkedInAsset struct {
	ID            uuid.UUID              `json:"id"`
	UserID        uuid.UUID              `json:"user_id"`
	AssetType     LinkedInAssetType      `json:"asset_type"`
	InputContext  map[string]interface{} `json:"input_context"`
	GeneratedText string                 `json:"generated_text"`
	Status        LinkedInAssetStatus    `json:"status"`
	CreatedAt     time.Time              `json:"created_at"`
}

type InterviewMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type InterviewSession struct {
	ID         uuid.UUID                `json:"id"`
	UserID     uuid.UUID                `json:"user_id"`
	Domain     string                   `json:"domain"`
	RoleTitle  *string                  `json:"role_title,omitempty"`
	Transcript []InterviewMessage       `json:"transcript"`
	Feedback   map[string]interface{}   `json:"feedback,omitempty"`
	CreatedAt  time.Time                `json:"created_at"`
}

type CoverLetter struct {
	ID               uuid.UUID  `json:"id"`
	UserID           uuid.UUID  `json:"user_id"`
	JobDescriptionID *uuid.UUID `json:"job_description_id,omitempty"`
	GeneratedText    string     `json:"generated_text"`
	PDFURL           *string    `json:"pdf_url,omitempty"`
	CreatedAt        time.Time  `json:"created_at"`
}

type OutreachChannel string

const (
	ChannelLinkedInDM OutreachChannel = "linkedin_dm"
	ChannelEmail      OutreachChannel = "email"
	ChannelOther      OutreachChannel = "other"
)

type OutreachScript struct {
	ID            uuid.UUID              `json:"id"`
	UserID        uuid.UUID              `json:"user_id"`
	Channel       OutreachChannel        `json:"channel"`
	TargetContext map[string]interface{} `json:"target_context"`
	GeneratedText string                 `json:"generated_text"`
	CreatedAt     time.Time              `json:"created_at"`
}

type SkillGapAnalysis struct {
	ID               uuid.UUID              `json:"id"`
	UserID           uuid.UUID              `json:"user_id"`
	JobDescriptionID *uuid.UUID             `json:"job_description_id,omitempty"`
	GapReport        map[string]interface{} `json:"gap_report"`
	CreatedAt        time.Time              `json:"created_at"`
}
