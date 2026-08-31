package vault

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"karma/apps/api/pkg/auth"
	"karma/apps/api/pkg/models"
)

type VaultHandler struct {
	vaultService *VaultService
}

func NewVaultHandler(svc *VaultService) *VaultHandler {
	return &VaultHandler{vaultService: svc}
}

func (h *VaultHandler) StoreKey(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req models.StoreKeyRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}

	resp, err := h.vaultService.StoreKey(userID, req.Provider, req.APIKey)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resp)
}

func (h *VaultHandler) ListKeys(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	keys := h.vaultService.ListKeys(userID)
	if keys == nil {
		keys = []models.VaultKeyResponse{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(keys)
}

func (h *VaultHandler) DeleteKey(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	provider := models.VaultProvider(chi.URLParam(r, "provider"))
	if err := h.vaultService.DeleteKey(userID, provider); err != nil {
		http.Error(w, `{"error":"key not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}
