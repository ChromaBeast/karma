package career

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"karma/apps/api/pkg/auth"
	"karma/apps/api/pkg/models"
)

type CareerHandler struct {
	service *CareerService
}

func NewCareerHandler(service *CareerService) *CareerHandler {
	return &CareerHandler{service: service}
}

func (h *CareerHandler) IngestEvent(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		RawText string                `json:"raw_text"`
		Channel models.CaptureChannel `json:"capture_channel"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.RawText == "" {
		http.Error(w, `{"error":"raw_text is required"}`, http.StatusBadRequest)
		return
	}

	if req.Channel == "" {
		req.Channel = models.ChannelQuickAdd
	}

	event, err := h.service.IngestEvent(userID, req.Channel, req.RawText)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusAccepted)
	json.NewEncoder(w).Encode(event)
}

func (h *CareerHandler) GetEventStatus(w http.ResponseWriter, r *http.Request) {
	eventIDStr := chi.URLParam(r, "id")
	eventID, err := uuid.Parse(eventIDStr)
	if err != nil {
		http.Error(w, `{"error":"invalid event id"}`, http.StatusBadRequest)
		return
	}

	event, err := h.service.GetEvent(eventID)
	if err != nil {
		http.Error(w, `{"error":"event not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(event)
}

func (h *CareerHandler) ListNodes(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var filter NodeFilter
	if nodeTypeStr := r.URL.Query().Get("node_type"); nodeTypeStr != "" {
		nt := models.NodeType(nodeTypeStr)
		filter.NodeType = &nt
	}
	if tagStr := r.URL.Query().Get("tag"); tagStr != "" {
		filter.Tag = &tagStr
	}
	if parentIDStr := r.URL.Query().Get("parent_id"); parentIDStr != "" {
		if pid, err := uuid.Parse(parentIDStr); err == nil {
			filter.ParentID = &pid
		}
	}

	nodes := h.service.ListNodes(userID, filter)
	if nodes == nil {
		nodes = []*models.CareerNode{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(nodes)
}

func (h *CareerHandler) CreateNode(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var node models.CareerNode
	if err := json.NewDecoder(r.Body).Decode(&node); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}
	node.UserID = userID

	created, err := h.service.CreateNode(&node)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(created)
}

func (h *CareerHandler) GetNode(w http.ResponseWriter, r *http.Request) {
	nodeIDStr := chi.URLParam(r, "id")
	nodeID, err := uuid.Parse(nodeIDStr)
	if err != nil {
		http.Error(w, `{"error":"invalid node id"}`, http.StatusBadRequest)
		return
	}

	node, err := h.service.GetNode(nodeID)
	if err != nil {
		http.Error(w, `{"error":"node not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(node)
}

func (h *CareerHandler) DeleteNode(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	nodeIDStr := chi.URLParam(r, "id")
	nodeID, err := uuid.Parse(nodeIDStr)
	if err != nil {
		http.Error(w, `{"error":"invalid node id"}`, http.StatusBadRequest)
		return
	}

	if err := h.service.DeleteNode(userID, nodeID); err != nil {
		http.Error(w, `{"error":"node not found"}`, http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
