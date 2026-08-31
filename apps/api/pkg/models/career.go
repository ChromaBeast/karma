package models

import (
	"time"

	"github.com/google/uuid"
)

type CaptureChannel string

const (
	ChannelQuickAdd     CaptureChannel = "quick_add"
	ChannelChat         CaptureChannel = "chat"
	ChannelSlackBot     CaptureChannel = "slack_bot"
	ChannelVoice        CaptureChannel = "voice"
	ChannelCheckIn      CaptureChannel = "check_in"
	ChannelResumeImport CaptureChannel = "resume_import"
)

type NodeType string

const (
	NodeTypeRole        NodeType = "role"
	NodeTypeProject     NodeType = "project"
	NodeTypeAchievement NodeType = "achievement"
	NodeTypeSkill       NodeType = "skill"
	NodeTypeEducation   NodeType = "education"
)

type CareerNodeMetrics struct {
	PercentageDelta *float64 `json:"percentage_delta,omitempty"`
	DollarValueUSD  *float64 `json:"dollar_value_usd,omitempty"`
	TimeSavedHours  *float64 `json:"time_saved_hours,omitempty"`
	ScaleUsers      *int64   `json:"scale_users,omitempty"`
	RawMetrics      []string `json:"raw_metrics,omitempty"`
}

type CareerNodeEvent struct {
	ID             uuid.UUID      `json:"id"`
	UserID         uuid.UUID      `json:"user_id"`
	RawText        string         `json:"raw_text"`
	CaptureChannel CaptureChannel `json:"capture_channel"`
	ProcessedAt    *time.Time     `json:"processed_at,omitempty"`
	CareerNodeID   *uuid.UUID     `json:"career_node_id,omitempty"`
	CreatedAt      time.Time      `json:"created_at"`
}

type CareerNode struct {
	ID            uuid.UUID         `json:"id"`
	UserID        uuid.UUID         `json:"user_id"`
	ParentID      *uuid.UUID        `json:"parent_id,omitempty"`
	NodeType      NodeType          `json:"node_type"`
	Title         string            `json:"title"`
	Org           *string           `json:"org,omitempty"`
	StartDate     *string           `json:"start_date,omitempty"`
	EndDate       *string           `json:"end_date,omitempty"`
	SituationTask *string           `json:"situation_task,omitempty"`
	Action        *string           `json:"action,omitempty"`
	Result        *string           `json:"result,omitempty"`
	Metrics       CareerNodeMetrics `json:"metrics"`
	Tags          []string          `json:"tags"`
	Embedding     []float32         `json:"embedding,omitempty"`
	Source        string            `json:"source"`
	CreatedAt     time.Time         `json:"created_at"`
	UpdatedAt     time.Time         `json:"updated_at"`
}
