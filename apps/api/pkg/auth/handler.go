package auth

import (
	"encoding/json"
	"net/http"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type AuthHandler struct {
	jwtService *JWTService
	refreshMgr *RefreshTokenManager
	mu         sync.RWMutex
	users      map[uuid.UUID]*models.User
}

func NewAuthHandler(jwtSvc *JWTService, refMgr *RefreshTokenManager) *AuthHandler {
	return &AuthHandler{
		jwtService: jwtSvc,
		refreshMgr: refMgr,
		users:      make(map[uuid.UUID]*models.User),
	}
}

func (h *AuthHandler) SeedUser(user *models.User) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.users[user.ID] = user
}

func (h *AuthHandler) LinkedInStart(w http.ResponseWriter, r *http.Request) {
	state, _ := generateSecureString(16)
	codeVerifier, _ := generateSecureString(32)

	resp := map[string]string{
		"state":         state,
		"code_verifier": codeVerifier,
		"auth_url":      "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=karma_client&scope=openid%20profile%20email&state=" + state,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *AuthHandler) LinkedInCallback(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Code        string `json:"code"`
		Email       string `json:"email"`
		Name        string `json:"name"`
		LinkedInSub string `json:"linkedin_sub"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request body"}`, http.StatusBadRequest)
		return
	}

	if req.LinkedInSub == "" {
		req.LinkedInSub = "li_" + uuid.New().String()[:8]
	}
	if req.Email == "" {
		req.Email = req.LinkedInSub + "@example.com"
	}
	if req.Name == "" {
		req.Name = "Karma User"
	}

	h.mu.Lock()
	var user *models.User
	for _, u := range h.users {
		if u.LinkedInSub == req.LinkedInSub || u.Email == req.Email {
			user = u
			break
		}
	}

	if user == nil {
		user = &models.User{
			ID:          uuid.New(),
			LinkedInSub: req.LinkedInSub,
			Email:       req.Email,
			Name:        req.Name,
			PlanTier:    models.PlanTierFree,
			CreatedAt:   time.Now().UTC(),
			UpdatedAt:   time.Now().UTC(),
		}
		h.users[user.ID] = user
	}
	h.mu.Unlock()

	scopes := []string{"resume:read", "career:read", "career:write"}
	accessToken, _, err := h.jwtService.GenerateAccessToken(*user, scopes)
	if err != nil {
		http.Error(w, `{"error":"failed to generate access token"}`, http.StatusInternalServerError)
		return
	}

	refreshToken, _, err := h.refreshMgr.CreateInitialToken(user.ID)
	if err != nil {
		http.Error(w, `{"error":"failed to generate refresh token"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.AuthResponse{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		TokenType:    "Bearer",
		ExpiresIn:    900,
		User:         *user,
	})
}

func (h *AuthHandler) Refresh(w http.ResponseWriter, r *http.Request) {
	var req struct {
		RefreshToken string `json:"refresh_token"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.RefreshToken == "" {
		http.Error(w, `{"error":"refresh_token is required"}`, http.StatusBadRequest)
		return
	}

	newRawToken, tokenModel, err := h.refreshMgr.RotateToken(req.RefreshToken)
	if err != nil {
		if err == ErrRefreshTokenReused {
			http.Error(w, `{"error":"refresh token reuse detected; all sessions revoked"}`, http.StatusForbidden)
			return
		}
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusUnauthorized)
		return
	}

	h.mu.RLock()
	user, exists := h.users[tokenModel.UserID]
	h.mu.RUnlock()

	if !exists {
		user = &models.User{
			ID:       tokenModel.UserID,
			Email:    "user@example.com",
			Name:     "Karma User",
			PlanTier: models.PlanTierFree,
		}
	}

	scopes := []string{"resume:read", "career:read", "career:write"}
	newAccessToken, _, err := h.jwtService.GenerateAccessToken(*user, scopes)
	if err != nil {
		http.Error(w, `{"error":"failed to generate access token"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(models.AuthResponse{
		AccessToken:  newAccessToken,
		RefreshToken: newRawToken,
		TokenType:    "Bearer",
		ExpiresIn:    900,
		User:         *user,
	})
}

func (h *AuthHandler) Me(w http.ResponseWriter, r *http.Request) {
	userID, ok := GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	h.mu.RLock()
	user, exists := h.users[userID]
	h.mu.RUnlock()

	if !exists {
		http.Error(w, `{"error":"user not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
