package llm

import (
	"crypto/rand"
	"io"
	"testing"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
	"karma/apps/api/pkg/vault"
)

func TestLLMDualExecutionAndLedger(t *testing.T) {
	masterKey := make([]byte, 32)
	io.ReadFull(rand.Reader, masterKey)
	kms, _ := vault.NewKMSMasterKey(masterKey)
	vaultSvc := vault.NewVaultService(kms)
	ledger := NewCreditLedgerService()
	cache := NewPromptCacheService()
	router := NewLLMRouter(vaultSvc, ledger, cache)

	userID := uuid.New()

	// 1. Managed mode with no credits -> should fail
	_, err := router.Execute(userID, ExecutionRequest{
		Module:   "resume_bullet",
		Mode:     models.ExecutionModeManaged,
		Provider: models.ProviderAnthropic,
		Prompt:   "Synthesize career node into high-impact bullet",
	})
	if err != ErrInsufficientCredits {
		t.Fatalf("expected ErrInsufficientCredits, got %v", err)
	}

	// 2. Add credits to ledger
	_, err = ledger.AddCredits(userID, 10.0, "purchase", nil)
	if err != nil {
		t.Fatalf("failed to add credits: %v", err)
	}
	if ledger.GetBalance(userID) != 10.0 {
		t.Errorf("expected 10.0 balance, got %f", ledger.GetBalance(userID))
	}

	// 3. Managed mode with credits -> succeeds
	res, err := router.Execute(userID, ExecutionRequest{
		Module:   "resume_bullet",
		Mode:     models.ExecutionModeManaged,
		Provider: models.ProviderAnthropic,
		Prompt:   "Synthesize career node into high-impact bullet",
	})
	if err != nil {
		t.Fatalf("failed managed execution: %v", err)
	}
	if res.CacheHit {
		t.Errorf("first execution should not be cache hit")
	}

	// 4. Second identical request -> should hit cache
	res2, err := router.Execute(userID, ExecutionRequest{
		Module:   "resume_bullet",
		Mode:     models.ExecutionModeManaged,
		Provider: models.ProviderAnthropic,
		Prompt:   "Synthesize career node into high-impact bullet",
	})
	if err != nil {
		t.Fatalf("failed cached execution: %v", err)
	}
	if !res2.CacheHit {
		t.Errorf("expected cache hit on repeated prompt")
	}

	// 5. BYOK execution
	vaultSvc.StoreKey(userID, models.ProviderOpenAI, "sk-proj-testkey123456")
	resBYOK, err := router.Execute(userID, ExecutionRequest{
		Module:   "cover_letter",
		Mode:     models.ExecutionModeBYOK,
		Provider: models.ProviderOpenAI,
		Prompt:   "Draft cover letter for Staff Engineer",
	})
	if err != nil {
		t.Fatalf("failed BYOK execution: %v", err)
	}
	if resBYOK.ExecutionID == uuid.Nil {
		t.Errorf("expected valid execution ID")
	}
}
