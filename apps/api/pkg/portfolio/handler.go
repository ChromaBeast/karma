package portfolio

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"karma/apps/api/pkg/auth"
)

type PortfolioHandler struct {
	service *PortfolioService
}

func NewPortfolioHandler(service *PortfolioService) *PortfolioHandler {
	return &PortfolioHandler{service: service}
}

func (h *PortfolioHandler) GetMine(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	p, err := h.service.GetPortfolio(userID)
	if err != nil {
		http.Error(w, `{"error":"portfolio not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func (h *PortfolioHandler) GetPublic(w http.ResponseWriter, r *http.Request) {
	subdomain := chi.URLParam(r, "subdomain")
	p, err := h.service.GetBySubdomain(subdomain)
	if err != nil {
		http.Error(w, `{"error":"portfolio not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "public, max-age=60, s-maxage=3600, stale-while-revalidate=86400")
	json.NewEncoder(w).Encode(p)
}

func (h *PortfolioHandler) Upsert(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		ThemeID   string                 `json:"theme_id"`
		Subdomain string                 `json:"subdomain"`
		Config    map[string]interface{} `json:"config"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}

	p, err := h.service.UpsertPortfolio(userID, req.ThemeID, req.Subdomain, req.Config)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func (h *PortfolioHandler) Publish(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	p, err := h.service.PublishPortfolio(userID)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(p)
}

func (h *PortfolioHandler) SetProjects(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	p, err := h.service.GetPortfolio(userID)
	if err != nil {
		http.Error(w, `{"error":"portfolio not found"}`, http.StatusNotFound)
		return
	}

	var req struct {
		CareerNodeIDs []uuid.UUID `json:"career_node_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}

	projects := h.service.SetProjects(p.ID, req.CareerNodeIDs)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}
