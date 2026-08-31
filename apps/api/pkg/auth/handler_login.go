package auth

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
	"karma/apps/api/pkg/models"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name,omitempty"`
}

type LogoutRequest struct {
	RefreshToken string `json:"refresh_token"`
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func checkPassword(hash, password string) bool {
	return bcrypt.CompareHashAndPassword([]byte(hash), []byte(password)) == nil
}

func (h *AuthHandler) EmailLogin(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || strings.TrimSpace(req.Email) == "" {
		http.Error(w, `{"error":"valid email is required"}`, http.StatusBadRequest)
		return
	}

	email := strings.TrimSpace(strings.ToLower(req.Email))
	password := strings.TrimSpace(req.Password)
	name := strings.TrimSpace(req.Name)
	if name == "" {
		parts := strings.Split(email, "@")
		name = strings.Title(parts[0])
	}

	var user *models.User
	if h.repo != nil {
		user, _ = h.repo.GetByEmail(context.Background(), email)
	}

	if user == nil {
		h.mu.RLock()
		for _, u := range h.users {
			if strings.EqualFold(u.Email, email) {
				user = u
				break
			}
		}
		h.mu.RUnlock()
	}

	if user != nil {
		// Existing user: verify password if password was provided and user has password_hash
		if user.PasswordHash != "" && password != "" {
			if !checkPassword(user.PasswordHash, password) {
				http.Error(w, `{"error":"invalid email or password"}`, http.StatusUnauthorized)
				return
			}
		}
	} else {
		// New user: register with bcrypt hash
		pwHash, _ := hashPassword(password)
		if pwHash == "" {
			pwHash, _ = hashPassword("demo1234")
		}

		user = &models.User{
			ID:           uuid.New(),
			LinkedInSub:  "local_" + uuid.New().String()[:8],
			Email:        email,
			Name:         name,
			PasswordHash: pwHash,
			PlanTier:     models.PlanTierAccessPlusCredits,
			CreatedAt:    time.Now().UTC(),
			UpdatedAt:    time.Now().UTC(),
		}

		h.mu.Lock()
		h.users[user.ID] = user
		h.mu.Unlock()

		if h.repo != nil {
			_ = h.repo.CreateUser(context.Background(), user)
		}
	}

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
