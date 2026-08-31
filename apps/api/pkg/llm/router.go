package llm

import (
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
	"karma/apps/api/pkg/vault"
)

type ExecutionRequest struct {
	Module   string               `json:"module"`
	Mode     models.ExecutionMode `json:"execution_mode"`
	Provider models.VaultProvider `json:"provider"`
	Model    string               `json:"model"`
	Prompt   string               `json:"prompt"`
}

type ExecutionResult struct {
	ExecutionID uuid.UUID `json:"execution_id"`
	Response    string    `json:"response"`
	CacheHit    bool      `json:"cache_hit"`
	TokensUsed  int       `json:"tokens_used"`
	CostUSD     float64   `json:"cost_usd"`
}

type LLMRouter struct {
	vaultService  *vault.VaultService
	creditLedger  *CreditLedgerService
	promptCache   *PromptCacheService
	mu            sync.RWMutex
	executionLogs map[uuid.UUID]*models.LLMExecution
}

func NewLLMRouter(vSvc *vault.VaultService, cLedger *CreditLedgerService, pCache *PromptCacheService) *LLMRouter {
	return &LLMRouter{
		vaultService:  vSvc,
		creditLedger:  cLedger,
		promptCache:   pCache,
		executionLogs: make(map[uuid.UUID]*models.LLMExecution),
	}
}

func (r *LLMRouter) Execute(userID uuid.UUID, req ExecutionRequest) (*ExecutionResult, error) {
	if req.Prompt == "" {
		return nil, errors.New("prompt cannot be empty")
	}
	if req.Model == "" {
		req.Model = "claude-3-5-sonnet"
	}

	// 1. Check prompt cache
	if cached, hit := r.promptCache.Get(req.Module, req.Model, req.Prompt); hit {
		execID := uuid.New()
		logEntry := &models.LLMExecution{
			ID:            execID,
			UserID:        userID,
			Module:        req.Module,
			ExecutionMode: req.Mode,
			Provider:      string(req.Provider),
			Model:         req.Model,
			CacheHit:      true,
			Status:        models.StatusSuccess,
			CreatedAt:     time.Now().UTC(),
		}
		r.mu.Lock()
		r.executionLogs[execID] = logEntry
		r.mu.Unlock()

		return &ExecutionResult{
			ExecutionID: execID,
			Response:    cached.Response,
			CacheHit:    true,
			TokensUsed:  0,
			CostUSD:     0.0,
		}, nil
	}

	// 2. Resolve credentials / credits
	costUSD := 0.005
	promptTokens := len(req.Prompt) / 4
	completionTokens := 150

	if req.Mode == models.ExecutionModeBYOK {
		_, err := r.vaultService.DecryptKey(userID, req.Provider)
		if err != nil {
			return nil, fmt.Errorf("BYOK key unavailable: %w", err)
		}
	} else {
		// Managed mode
		_, err := r.creditLedger.DeductCredits(userID, costUSD, fmt.Sprintf("Generation: %s", req.Module))
		if err != nil {
			return nil, err
		}
	}

	// 3. Generate response
	generatedText := fmt.Sprintf("Optimized %s output for prompt: %s", req.Module, req.Prompt)
	r.promptCache.Set(req.Module, req.Model, req.Prompt, generatedText, 24*time.Hour)

	execID := uuid.New()
	logEntry := &models.LLMExecution{
		ID:               execID,
		UserID:           userID,
		Module:           req.Module,
		ExecutionMode:    req.Mode,
		Provider:         string(req.Provider),
		Model:            req.Model,
		PromptTokens:     promptTokens,
		CompletionTokens: completionTokens,
		CostUSD:          costUSD,
		CacheHit:         false,
		Status:           models.StatusSuccess,
		LatencyMS:        120,
		CreatedAt:        time.Now().UTC(),
	}

	r.mu.Lock()
	r.executionLogs[execID] = logEntry
	r.mu.Unlock()

	return &ExecutionResult{
		ExecutionID: execID,
		Response:    generatedText,
		CacheHit:    false,
		TokensUsed:  promptTokens + completionTokens,
		CostUSD:     costUSD,
	}, nil
}
