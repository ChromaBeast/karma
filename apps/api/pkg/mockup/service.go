package mockup

import (
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type MockupService struct {
	mu      sync.RWMutex
	mockups map[uuid.UUID]*models.Mockup
}

func NewMockupService() *MockupService {
	return &MockupService{
		mockups: make(map[uuid.UUID]*models.Mockup),
	}
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

	return mockup, nil
}

func (s *MockupService) ListMockups(userID uuid.UUID) []*models.Mockup {
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
