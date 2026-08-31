package auth

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

func TestJWTService(t *testing.T) {
	svc := NewJWTService("test-secret-key-32-chars-long-123")
	user := models.User{
		ID:       uuid.New(),
		Email:    "test@karma.app",
		Name:     "Test User",
		PlanTier: models.PlanTierAccess,
	}

	token, exp, err := svc.GenerateAccessToken(user, []string{"resume:generate"})
	if err != nil {
		t.Fatalf("unexpected error generating token: %v", err)
	}
	if token == "" || exp.Before(time.Now()) {
		t.Fatalf("invalid token or expiry: %v", exp)
	}

	claims, err := svc.VerifyAccessToken(token)
	if err != nil {
		t.Fatalf("failed to verify valid token: %v", err)
	}
	if claims.UserID != user.ID.String() {
		t.Errorf("expected user ID %s, got %s", user.ID.String(), claims.UserID)
	}
	if claims.PlanTier != models.PlanTierAccess {
		t.Errorf("expected plan tier access, got %v", claims.PlanTier)
	}
}

func TestRefreshTokenFamilyRotationAndReuse(t *testing.T) {
	mgr := NewRefreshTokenManager(1 * time.Hour)
	userID := uuid.New()

	raw1, t1, err := mgr.CreateInitialToken(userID)
	if err != nil {
		t.Fatalf("failed to create initial token: %v", err)
	}
	if t1.FamilyID == uuid.Nil {
		t.Fatalf("family ID should not be nil")
	}

	// First rotation: valid
	raw2, t2, err := mgr.RotateToken(raw1)
	if err != nil {
		t.Fatalf("failed to rotate token: %v", err)
	}
	if t2.FamilyID != t1.FamilyID {
		t.Errorf("family ID mismatch: %v vs %v", t2.FamilyID, t1.FamilyID)
	}
	if *t2.RotatedFrom != t1.ID {
		t.Errorf("expected rotated_from %v, got %v", t1.ID, *t2.RotatedFrom)
	}

	// Second rotation: valid
	raw3, t3, err := mgr.RotateToken(raw2)
	if err != nil {
		t.Fatalf("failed second rotation: %v", err)
	}
	if t3.FamilyID != t1.FamilyID {
		t.Errorf("family ID mismatch on second rotation")
	}

	// REPLAY ATTACK: Use raw1 again (which was rotated in step 1)
	_, _, err = mgr.RotateToken(raw1)
	if err != ErrRefreshTokenReused {
		t.Fatalf("expected ErrRefreshTokenReused, got %v", err)
	}

	// Now raw3 (which was active) should also be revoked because the entire family is compromised!
	_, _, err = mgr.RotateToken(raw3)
	if err != ErrRefreshTokenReused {
		t.Fatalf("expected raw3 to be revoked after family compromise, got %v", err)
	}
}

func TestAuthMiddleware(t *testing.T) {
	svc := NewJWTService("test-secret-key-32-chars-long-123")
	user := models.User{
		ID:       uuid.New(),
		Email:    "test@karma.app",
		PlanTier: models.PlanTierAccess,
	}
	token, _, _ := svc.GenerateAccessToken(user, []string{"career:read"})

	handler := AuthMiddleware(svc)(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		uid, ok := GetUserID(r.Context())
		if !ok || uid != user.ID {
			http.Error(w, "invalid context", http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	}))

	req := httptest.NewRequest("GET", "/protected", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	rec := httptest.NewRecorder()

	handler.ServeHTTP(rec, req)
	if rec.Code != http.StatusOK {
		t.Errorf("expected 200, got %d", rec.Code)
	}
}

func TestAuthHandlerEndpoints(t *testing.T) {
	svc := NewJWTService("test-secret-key-32-chars-long-123")
	mgr := NewRefreshTokenManager(1 * time.Hour)
	handler := NewAuthHandler(svc, mgr)

	// Test LinkedIn Callback
	cbBody := []byte(`{"email":"dev@karma.app","name":"Dev User","linkedin_sub":"li_12345"}`)
	req := httptest.NewRequest("POST", "/v1/auth/linkedin/callback", bytes.NewBuffer(cbBody))
	rec := httptest.NewRecorder()
	handler.LinkedInCallback(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected 200 on callback, got %d", rec.Code)
	}

	var authResp models.AuthResponse
	if err := json.NewDecoder(rec.Body).Decode(&authResp); err != nil {
		t.Fatalf("failed to decode response: %v", err)
	}
	if authResp.AccessToken == "" || authResp.RefreshToken == "" {
		t.Fatalf("empty tokens in response")
	}

	// Test Refresh
	refBody := []byte(`{"refresh_token":"` + authResp.RefreshToken + `"}`)
	reqRef := httptest.NewRequest("POST", "/v1/auth/refresh", bytes.NewBuffer(refBody))
	recRef := httptest.NewRecorder()
	handler.Refresh(recRef, reqRef)

	if recRef.Code != http.StatusOK {
		t.Fatalf("expected 200 on refresh, got %d", recRef.Code)
	}
}
