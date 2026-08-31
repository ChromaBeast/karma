package tools

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"karma/apps/api/pkg/auth"
)

func (h *ToolsHandler) StartInterview(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		Domain    string `json:"domain"`
		RoleTitle string `json:"role_title"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}

	session, question := h.intService.StartSession(userID, req.Domain, req.RoleTitle)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"session":          session,
		"initial_question": question,
	})
}

func (h *ToolsHandler) SubmitInterviewAnswer(w http.ResponseWriter, r *http.Request) {
	var req struct {
		SessionID uuid.UUID `json:"session_id"`
		Answer    string    `json:"answer"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}

	session, feedback, err := h.intService.SubmitAnswer(req.SessionID, req.Answer)
	if err != nil {
		http.Error(w, `{"error":"session not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"session":  session,
		"feedback": feedback,
	})
}
