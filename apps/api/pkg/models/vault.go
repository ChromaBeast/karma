package models

import (
	"time"

	"github.com/google/uuid"
)

type VaultProvider string

const (
	ProviderAnthropic VaultProvider = "anthropic"
	ProviderOpenAI    VaultProvider = "openai"
	ProviderGemini    VaultProvider = "gemini"
)

type APIKeyVault struct {
	ID             uuid.UUID     `json:"id"`
	UserID         uuid.UUID     `json:"user_id"`
	Provider       VaultProvider `json:"provider"`
	EncryptedKey   []byte        `json:"-"`
	KeyIV          []byte        `json:"-"`
	DataKeyWrapped []byte        `json:"-"`
	KeyLast4       string        `json:"key_last4"`
	IsActive       bool          `json:"is_active"`
	ValidatedAt    *time.Time    `json:"validated_at,omitempty"`
	CreatedAt      time.Time     `json:"created_at"`
}

type StoreKeyRequest struct {
	Provider VaultProvider `json:"provider"`
	APIKey   string        `json:"api_key"`
}

type VaultKeyResponse struct {
	ID          uuid.UUID     `json:"id"`
	Provider    VaultProvider `json:"provider"`
	KeyLast4    string        `json:"key_last4"`
	IsActive    bool          `json:"is_active"`
	ValidatedAt *time.Time    `json:"validated_at,omitempty"`
	CreatedAt   time.Time     `json:"created_at"`
}
