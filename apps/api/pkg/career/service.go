package career

import (
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

var (
	ErrNodeNotFound  = errors.New("career node not found")
	ErrEventNotFound = errors.New("career event not found")
)

type NodeFilter struct {
	NodeType *models.NodeType
	Tag      *string
	ParentID *uuid.UUID
}

type CareerService struct {
	mu     sync.RWMutex
	events map[uuid.UUID]*models.CareerNodeEvent
	nodes  map[uuid.UUID]*models.CareerNode
}

func NewCareerService() *CareerService {
	return &CareerService{
		events: make(map[uuid.UUID]*models.CareerNodeEvent),
		nodes:  make(map[uuid.UUID]*models.CareerNode),
	}
}

func (s *CareerService) IngestEvent(userID uuid.UUID, channel models.CaptureChannel, rawText string) (*models.CareerNodeEvent, error) {
	now := time.Now().UTC()
	event := &models.CareerNodeEvent{
		ID:             uuid.New(),
		UserID:         userID,
		RawText:        rawText,
		CaptureChannel: channel,
		CreatedAt:      now,
	}

	s.mu.Lock()
	s.events[event.ID] = event
	s.mu.Unlock()

	// Process asynchronously
	go s.processEventAsync(event.ID)

	return event, nil
}

func (s *CareerService) processEventAsync(eventID uuid.UUID) {
	s.mu.Lock()
	event, exists := s.events[eventID]
	if !exists {
		s.mu.Unlock()
		return
	}

	metrics := ExtractMetrics(event.RawText)
	situation, action, result, tags := StructureEventText(event.RawText)
	embedding := GenerateVectorEmbedding(event.RawText)
	now := time.Now().UTC()

	node := &models.CareerNode{
		ID:            uuid.New(),
		UserID:        event.UserID,
		NodeType:      models.NodeTypeAchievement,
		Title:         action,
		SituationTask: &situation,
		Action:        &action,
		Result:        &result,
		Metrics:       metrics,
		Tags:          tags,
		Embedding:     embedding,
		Source:        string(event.CaptureChannel),
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	s.nodes[node.ID] = node
	event.ProcessedAt = &now
	event.CareerNodeID = &node.ID
	s.mu.Unlock()
}

func (s *CareerService) GetEvent(eventID uuid.UUID) (*models.CareerNodeEvent, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	event, exists := s.events[eventID]
	if !exists {
		return nil, ErrEventNotFound
	}
	return event, nil
}

func (s *CareerService) CreateNode(node *models.CareerNode) (*models.CareerNode, error) {
	if node.ID == uuid.Nil {
		node.ID = uuid.New()
	}
	now := time.Now().UTC()
	node.CreatedAt = now
	node.UpdatedAt = now
	node.Tags = NormalizeTags(node.Tags)
	if len(node.Embedding) == 0 {
		node.Embedding = GenerateVectorEmbedding(node.Title + " " + node.Source)
	}

	s.mu.Lock()
	s.nodes[node.ID] = node
	s.mu.Unlock()

	return node, nil
}

func (s *CareerService) GetNode(nodeID uuid.UUID) (*models.CareerNode, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	node, exists := s.nodes[nodeID]
	if !exists {
		return nil, ErrNodeNotFound
	}
	return node, nil
}

func (s *CareerService) ListNodes(userID uuid.UUID, filter NodeFilter) []*models.CareerNode {
	s.mu.RLock()
	defer s.mu.RUnlock()

	var result []*models.CareerNode
	for _, node := range s.nodes {
		if node.UserID != userID {
			continue
		}
		if filter.NodeType != nil && node.NodeType != *filter.NodeType {
			continue
		}
		if filter.ParentID != nil {
			if node.ParentID == nil || *node.ParentID != *filter.ParentID {
				continue
			}
		}
		if filter.Tag != nil {
			matched := false
			for _, t := range node.Tags {
				if t == *filter.Tag {
					matched = true
					break
				}
			}
			if !matched {
				continue
			}
		}
		result = append(result, node)
	}
	return result
}

func (s *CareerService) DeleteNode(userID uuid.UUID, nodeID uuid.UUID) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	node, exists := s.nodes[nodeID]
	if !exists || node.UserID != userID {
		return ErrNodeNotFound
	}
	delete(s.nodes, nodeID)
	return nil
}
