package llm

import (
	"encoding/json"
	"net/http"

	"karma/apps/api/pkg/auth"
)

type LLMHandler struct {
	router *LLMRouter
	ledger *CreditLedgerService
}

func NewLLMHandler(router *LLMRouter, ledger *CreditLedgerService) *LLMHandler {
	return &LLMHandler{
		router: router,
		ledger: ledger,
	}
}

func (h *LLMHandler) Execute(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req ExecutionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}

	result, err := h.router.Execute(userID, req)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (h *LLMHandler) GetCredits(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	balance := h.ledger.GetBalance(userID)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"balance_usd": balance,
	})
}

func (h *LLMHandler) PurchaseCredits(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		AmountUSD             float64 `json:"amount_usd"`
		StripePaymentIntentID *string `json:"stripe_payment_intent_id,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.AmountUSD <= 0 {
		http.Error(w, `{"error":"amount_usd must be positive"}`, http.StatusBadRequest)
		return
	}

	entry, err := h.ledger.AddCredits(userID, req.AmountUSD, "purchase", req.StripePaymentIntentID)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(entry)
}
