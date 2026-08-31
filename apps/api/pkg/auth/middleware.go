package auth

import (
	"context"
	"net/http"
	"strings"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type contextKey string

const (
	UserIDContextKey   contextKey = "user_id"
	PlanTierContextKey contextKey = "plan_tier"
	ScopesContextKey   contextKey = "scopes"
)

func AuthMiddleware(jwtService *JWTService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				http.Error(w, `{"error":"missing authorization header"}`, http.StatusUnauthorized)
				return
			}

			parts := strings.SplitN(authHeader, " ", 2)
			if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
				http.Error(w, `{"error":"invalid authorization header format"}`, http.StatusUnauthorized)
				return
			}

			claims, err := jwtService.VerifyAccessToken(parts[1])
			if err != nil {
				http.Error(w, `{"error":"invalid or expired token"}`, http.StatusUnauthorized)
				return
			}

			parsedID, err := uuid.Parse(claims.UserID)
			if err != nil {
				http.Error(w, `{"error":"invalid subject in token"}`, http.StatusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), UserIDContextKey, parsedID)
			ctx = context.WithValue(ctx, PlanTierContextKey, claims.PlanTier)
			ctx = context.WithValue(ctx, ScopesContextKey, claims.Scopes)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetUserID(ctx context.Context) (uuid.UUID, bool) {
	val, ok := ctx.Value(UserIDContextKey).(uuid.UUID)
	return val, ok
}

func GetPlanTier(ctx context.Context) (models.PlanTier, bool) {
	val, ok := ctx.Value(PlanTierContextKey).(models.PlanTier)
	return val, ok
}

func GetScopes(ctx context.Context) ([]string, bool) {
	val, ok := ctx.Value(ScopesContextKey).([]string)
	return val, ok
}

func RequireScope(requiredScope string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			scopes, ok := GetScopes(r.Context())
			if !ok {
				http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
				return
			}

			for _, s := range scopes {
				if s == requiredScope || s == "admin" {
					next.ServeHTTP(w, r)
					return
				}
			}

			http.Error(w, `{"error":"insufficient permissions"}`, http.StatusForbidden)
		})
	}
}
