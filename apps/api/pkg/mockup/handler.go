package mockup

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"karma/apps/api/pkg/auth"
	"karma/apps/api/pkg/models"
)

type MockupHandler struct {
	service *MockupService
}

func NewMockupHandler(service *MockupService) *MockupHandler {
	return &MockupHandler{service: service}
}

func (h *MockupHandler) Generate(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		CareerNodeID   *uuid.UUID             `json:"career_node_id,omitempty"`
		AssetType      models.MockupAssetType `json:"asset_type"`
		SourceImageURL string                 `json:"source_image_url"`
		Params         map[string]interface{} `json:"params"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}

	if req.AssetType == "" {
		req.AssetType = models.MockupDeviceFrame
	}

	m, err := h.service.GenerateMockup(userID, req.CareerNodeID, req.AssetType, req.SourceImageURL, req.Params)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(m)
}

func (h *MockupHandler) List(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	list := h.service.ListMockups(userID)
	if list == nil {
		list = []*models.Mockup{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(list)
}
