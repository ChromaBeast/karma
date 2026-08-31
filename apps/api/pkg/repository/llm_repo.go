package repository

import (
	"context"
	"database/sql"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type LLMRepository struct {
	db *sql.DB
}

func NewLLMRepository(db *sql.DB) *LLMRepository {
	return &LLMRepository{db: db}
}

func (r *LLMRepository) LogExecution(ctx context.Context, e *models.LLMExecution) error {
	if r.db == nil {
		return nil
	}
	query := `
		INSERT INTO llm_executions (
			id, user_id, module, execution_mode, provider, model,
			prompt_tokens, completion_tokens, cost_usd, cache_hit, status, latency_ms, created_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		ON CONFLICT (id) DO NOTHING;
	`
	_, err := r.db.ExecContext(ctx, query,
		e.ID, e.UserID, e.Module, string(e.ExecutionMode), e.Provider, e.Model,
		e.PromptTokens, e.CompletionTokens, e.CostUSD, e.CacheHit, string(e.Status), e.LatencyMS, e.CreatedAt,
	)
	return err
}

func (r *LLMRepository) RecordLedgerEntry(ctx context.Context, entry *models.ManagedCreditLedger) error {
	if r.db == nil {
		return nil
	}
	query := `
		INSERT INTO managed_credit_ledger (id, user_id, delta_usd, balance_after_usd, reason, stripe_payment_intent_id, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (id) DO NOTHING;
	`
	_, err := r.db.ExecContext(ctx, query,
		entry.ID, entry.UserID, entry.DeltaUSD, entry.BalanceAfterUSD, entry.Reason, entry.StripePaymentIntentID, entry.CreatedAt,
	)
	return err
}

func (r *LLMRepository) GetLatestBalance(ctx context.Context, userID uuid.UUID) (float64, error) {
	if r.db == nil {
		return 0, nil
	}
	query := `SELECT balance_after_usd FROM managed_credit_ledger WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1;`
	var balance float64
	err := r.db.QueryRowContext(ctx, query, userID).Scan(&balance)
	if err == sql.ErrNoRows {
		return 0, nil
	}
	return balance, err
}
