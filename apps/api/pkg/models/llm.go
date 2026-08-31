package models

import (
	"time"

	"github.com/google/uuid"
)

type ExecutionMode string

const (
	ExecutionModeBYOK    ExecutionMode = "byok"
	ExecutionModeManaged ExecutionMode = "managed"
)

type ExecutionStatus string

const (
	StatusSuccess     ExecutionStatus = "success"
	StatusError       ExecutionStatus = "error"
	StatusRateLimited ExecutionStatus = "rate_limited"
)

type LLMExecution struct {
	ID               uuid.UUID       `json:"id"`
	UserID           uuid.UUID       `json:"user_id"`
	Module           string          `json:"module"`
	ExecutionMode    ExecutionMode   `json:"execution_mode"`
	Provider         string          `json:"provider"`
	Model            string          `json:"model"`
	PromptTokens     int             `json:"prompt_tokens"`
	CompletionTokens int             `json:"completion_tokens"`
	CostUSD          float64         `json:"cost_usd"`
	CacheHit         bool            `json:"cache_hit"`
	Status           ExecutionStatus `json:"status"`
	LatencyMS        int             `json:"latency_ms"`
	CreatedAt        time.Time       `json:"created_at"`
}

type ManagedCreditLedger struct {
	ID                    uuid.UUID `json:"id"`
	UserID                uuid.UUID `json:"user_id"`
	DeltaUSD              float64   `json:"delta_usd"`
	BalanceAfterUSD       float64   `json:"balance_after_usd"`
	Reason                string    `json:"reason"`
	StripePaymentIntentID *string   `json:"stripe_payment_intent_id,omitempty"`
	CreatedAt             time.Time `json:"created_at"`
}

type BillingAccount struct {
	UserID            uuid.UUID  `json:"user_id"`
	AccessFeePaidAt   *time.Time `json:"access_fee_paid_at,omitempty"`
	StripeCustomerID  *string    `json:"stripe_customer_id,omitempty"`
	StorageQuotaBytes int64      `json:"storage_quota_bytes"`
}

type PromptCacheEntry struct {
	ID             uuid.UUID `json:"id"`
	Module         string    `json:"module"`
	InputHash      string    `json:"input_hash"`
	InputEmbedding []float32 `json:"input_embedding,omitempty"`
	Response       string    `json:"response"`
	HitCount       int       `json:"hit_count"`
	ExpiresAt      time.Time `json:"expires_at"`
	CreatedAt      time.Time `json:"created_at"`
}
