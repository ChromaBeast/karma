package llm

import (
	"crypto/sha256"
	"encoding/hex"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type PromptCacheService struct {
	mu    sync.RWMutex
	cache map[string]*models.PromptCacheEntry
}

func NewPromptCacheService() *PromptCacheService {
	return &PromptCacheService{
		cache: make(map[string]*models.PromptCacheEntry),
	}
}

func ComputeInputHash(module, model, input string) string {
	sum := sha256.Sum256([]byte(module + ":" + model + ":" + input))
	return hex.EncodeToString(sum[:])
}

func (s *PromptCacheService) Get(module, model, input string) (*models.PromptCacheEntry, bool) {
	key := ComputeInputHash(module, model, input)
	s.mu.Lock()
	defer s.mu.Unlock()

	entry, exists := s.cache[key]
	if !exists {
		return nil, false
	}

	if time.Now().UTC().After(entry.ExpiresAt) {
		delete(s.cache, key)
		return nil, false
	}

	entry.HitCount++
	return entry, true
}

func (s *PromptCacheService) Set(module, model, input, response string, ttl time.Duration) *models.PromptCacheEntry {
	if ttl <= 0 {
		ttl = 24 * time.Hour
	}
	key := ComputeInputHash(module, model, input)
	now := time.Now().UTC()

	entry := &models.PromptCacheEntry{
		ID:        uuid.New(),
		Module:    module,
		InputHash: key,
		Response:  response,
		HitCount:  0,
		ExpiresAt: now.Add(ttl),
		CreatedAt: now,
	}

	s.mu.Lock()
	s.cache[key] = entry
	s.mu.Unlock()

	return entry
}
