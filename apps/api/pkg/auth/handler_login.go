package auth

import (
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type LoginRequest struct {
	Email string `json:"email"`
	Name  string `json:"name"`
}

type LogoutRequest struct {
	RefreshToken string `json:"refresh_token"`
}

func (h *AuthHandler) EmailLogin(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || strings.TrimSpace(req.Email) == "" {
		http.Error(w, `{"error":"valid email is required"}`, http.StatusBadRequest)
		return
	}

	email := strings.TrimSpace(strings.ToLower(req.Email))
	name := strings.TrimSpace(req.Name)
	if name == "" {
		parts := strings.Split(email, "@")
		name = strings.Title(parts[0])
	}

	h.mu.Lock()
	var user *models.User
	for _, u := range h.users {
		if strings.EqualFold(u.Email, email) {
			user = u
			break
		}
	}

	if user == nil {
		user = &models.User{
			ID:          uuid.New(),
			LinkedInSub: "local_" + uuid.New().String()[:8],
			Email:       email,
			Name:        name,
			PlanTier:    models.PlanTierAccessPlusCredits,
			CreatedAt:   time.Now().UTC(),
			UpdatedAt:   time.Now().UTC(),
		}
		h.users[user.ID] = user
	}
	h.mu.Unlock()

	resp, err := h.issueAuthTokens(user)
	if err != nil {
		http.Error(w, `{"error":"failed to generate tokens"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	var req LogoutRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err == nil && req.RefreshToken != "" {
		h.refreshMgr.RevokeToken(req.RefreshToken)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]bool{"success": true})
}

func (h *AuthHandler) issueAuthTokens(user *models.User) (models.AuthResponse, error) {
	scopes := []string{"admin", "career:write", "vault:write", "resume:generate"}
	accessToken, _, err := h.jwtService.GenerateAccessToken(*user, scopes)
	if err != nil {
		return models.AuthResponse{}, err
	}

	refreshToken, _, err := h.refreshMgr.CreateInitialToken(user.ID)
	if err != nil {
		return models.AuthResponse{}, err
	}

	return models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    900,
		User:         *user,
	}, nil
}
