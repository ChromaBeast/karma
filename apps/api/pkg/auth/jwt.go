package auth

import (
	"errors"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

var (
	ErrInvalidToken = errors.New("invalid or expired token")
	ErrInvalidClaim = errors.New("invalid token claims")
)

type KarmaClaims struct {
	UserID   string          `json:"sub"`
	PlanTier models.PlanTier `json:"plan_tier"`
	Scopes   []string        `json:"scope"`
	jwt.RegisteredClaims
}

type JWTService struct {
	secretKey []byte
	issuer    string
	ttl       time.Duration
}

func NewJWTService(secret string) *JWTService {
	return &JWTService{
		secretKey: []byte(secret),
		issuer:    "karma-api",
		ttl:       15 * time.Minute,
	}
}

func (s *JWTService) GenerateAccessToken(user models.User, scopes []string) (string, time.Time, error) {
	now := time.Now().UTC()
	expiresAt := now.Add(s.ttl)

	claims := KarmaClaims{
		UserID:   user.ID.String(),
		PlanTier: user.PlanTier,
		Scopes:   scopes,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    s.issuer,
			Subject:   user.ID.String(),
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			ID:        uuid.New().String(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signedToken, err := token.SignedString(s.secretKey)
	if err != nil {
		return "", time.Time{}, fmt.Errorf("failed to sign access token: %w", err)
	}

	return signedToken, expiresAt, nil
}

func (s *JWTService) VerifyAccessToken(tokenString string) (*KarmaClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &KarmaClaims{}, func(t *jwt.Token) (interface{}, error) {
		if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", t.Header["alg"])
		}
		return s.secretKey, nil
	})

	if err != nil || !token.Valid {
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(*KarmaClaims)
	if !ok {
		return nil, ErrInvalidClaim
	}

	return claims, nil
}
