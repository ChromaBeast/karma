package mockup

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
	"karma/apps/api/pkg/repository"
)

type MockupService struct {
	mu      sync.RWMutex
	repo    *repository.MockupRepository
	mockups map[uuid.UUID]*models.Mockup
}

func NewMockupService(repo ...*repository.MockupRepository) *MockupService {
	svc := &MockupService{
		mockups: make(map[uuid.UUID]*models.Mockup),
	}
	if len(repo) > 0 && repo[0] != nil {
		svc.repo = repo[0]
	}
	return svc
}

func (s *MockupService) GenerateMockup(userID uuid.UUID, nodeID *uuid.UUID, assetType models.MockupAssetType, sourceImageURL string, params map[string]interface{}) (*models.Mockup, error) {
	if sourceImageURL == "" {
		return nil, errors.New("source_image_url is required")
	}

	frameType := "browser"
	if f, ok := params["frame_type"].(string); ok {
		frameType = f
	}

	title := "Karma Project Showcase"
	if t, ok := params["title"].(string); ok {
		title = t
	}

	_ = GenerateDeviceFrameSVG(WindowType(frameType), sourceImageURL, title)
	renderedURL := "/v1/mockups/rendered/" + uuid.New().String() + ".svg"

	mockup := &models.Mockup{
		ID:             uuid.New(),
		UserID:         userID,
		CareerNodeID:   nodeID,
		AssetType:      assetType,
		SourceImageURL: sourceImageURL,
		RenderedURL:    &renderedURL,
		Params:         params,
		CreatedAt:      time.Now().UTC(),
	}

	s.mu.Lock()
	s.mockups[mockup.ID] = mockup
	s.mu.Unlock()

	if s.repo != nil {
		_ = s.repo.SaveMockup(context.Background(), mockup)
	}

	return mockup, nil
}

func (s *MockupService) ListMockups(userID uuid.UUID) []*models.Mockup {
	if s.repo != nil {
		if list, err := s.repo.ListMockups(context.Background(), userID); err == nil && len(list) > 0 {
			return list
		}
	}

	s.mu.RLock()
	defer s.mu.RUnlock()

	var list []*models.Mockup
	for _, m := range s.mockups {
		if m.UserID == userID {
			list = append(list, m)
		}
	}
	return list
}
