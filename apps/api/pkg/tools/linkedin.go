package tools

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
	"karma/apps/api/pkg/repository"
)

type LinkedInService struct {
	mu     sync.RWMutex
	repo   *repository.ToolsRepository
	assets map[uuid.UUID]*models.LinkedInAsset
}

func NewLinkedInService(repo ...*repository.ToolsRepository) *LinkedInService {
	svc := &LinkedInService{
		assets: make(map[uuid.UUID]*models.LinkedInAsset),
	}
	if len(repo) > 0 && repo[0] != nil {
		svc.repo = repo[0]
	}
	return svc
}

func (s *LinkedInService) GenerateHeadline(userID uuid.UUID, roleTitle, topSkills string) (*models.LinkedInAsset, []string) {
	variants := []string{
		fmt.Sprintf("%s | Building Scalable Systems with %s", roleTitle, topSkills),
		fmt.Sprintf("%s specializing in High-Throughput Architecture & %s", roleTitle, topSkills),
		fmt.Sprintf("Driving Engineering Impact: %s | %s", roleTitle, topSkills),
	}

	asset := &models.LinkedInAsset{
		ID:        uuid.New(),
		UserID:    userID,
		AssetType: models.LinkedInHeadline,
		InputContext: map[string]interface{}{
			"role_title": roleTitle,
			"top_skills": topSkills,
		},
		GeneratedText: variants[0],
		Status:        models.StatusDraft,
		CreatedAt:     time.Now().UTC(),
	}

	if s.repo != nil {
		_ = s.repo.SaveLinkedInAsset(context.Background(), asset)
	}

	s.mu.Lock()
	s.assets[asset.ID] = asset
	s.mu.Unlock()

	return asset, variants
}

func (s *LinkedInService) GeneratePost(userID uuid.UUID, projectTitle, metricsResult string) (*models.LinkedInAsset, []string) {
	variants := []string{
		fmt.Sprintf("🚀 Just shipped %s!\n\nHere is how we achieved %s:\n1. Deconstructed the bottlenecks\n2. Built resilient architecture\n3. Monitored production metrics\n\nWhat are your thoughts on this approach?", projectTitle, metricsResult),
		fmt.Sprintf("Engineering lessons from %s 💡\n\nKey outcome: %s.\n\nKey takeaways below 👇", projectTitle, metricsResult),
	}

	asset := &models.LinkedInAsset{
		ID:        uuid.New(),
		UserID:    userID,
		AssetType: models.LinkedInPost,
		InputContext: map[string]interface{}{
			"project_title":  projectTitle,
			"metrics_result": metricsResult,
		},
		GeneratedText: variants[0],
		Status:        models.StatusDraft,
		CreatedAt:     time.Now().UTC(),
	}

	if s.repo != nil {
		_ = s.repo.SaveLinkedInAsset(context.Background(), asset)
	}

	s.mu.Lock()
	s.assets[asset.ID] = asset
	s.mu.Unlock()

	return asset, variants
}
