package career

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
	"karma/apps/api/pkg/repository"
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
	repo   *repository.CareerRepository
	events map[uuid.UUID]*models.CareerNodeEvent
	nodes  map[uuid.UUID]*models.CareerNode
}

func NewCareerService(repo ...*repository.CareerRepository) *CareerService {
	svc := &CareerService{
		events: make(map[uuid.UUID]*models.CareerNodeEvent),
		nodes:  make(map[uuid.UUID]*models.CareerNode),
	}
	if len(repo) > 0 && repo[0] != nil {
		svc.repo = repo[0]
	}
	return svc
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

	if s.repo != nil {
		_ = s.repo.SaveEvent(context.Background(), event)
	}

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

	if s.repo != nil {
		_ = s.repo.CreateNode(context.Background(), node)
		_ = s.repo.UpdateEventProcessed(context.Background(), event.ID, node.ID, now)
	}
}

func (s *CareerService) GetEvent(eventID uuid.UUID) (*models.CareerNodeEvent, error) {
	if s.repo != nil {
		if e, err := s.repo.GetEvent(context.Background(), eventID); err == nil && e != nil {
			return e, nil
		}
	}
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

	if s.repo != nil {
		_ = s.repo.CreateNode(context.Background(), node)
	}
	return node, nil
}

func (s *CareerService) GetNode(nodeID uuid.UUID) (*models.CareerNode, error) {
	if s.repo != nil {
		if n, err := s.repo.GetNode(context.Background(), nodeID); err == nil && n != nil {
			return n, nil
		}
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	node, exists := s.nodes[nodeID]
	if !exists {
		return nil, ErrNodeNotFound
	}
	return node, nil
}

func (s *CareerService) ListNodes(userID uuid.UUID, filter NodeFilter) []*models.CareerNode {
	if s.repo != nil {
		if dbNodes, err := s.repo.ListNodes(context.Background(), userID); err == nil && len(dbNodes) > 0 {
			return filterNodes(dbNodes, filter)
		}
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	var list []*models.CareerNode
	for _, n := range s.nodes {
		if n.UserID == userID {
			list = append(list, n)
		}
	}
	return filterNodes(list, filter)
}

func filterNodes(nodes []*models.CareerNode, filter NodeFilter) []*models.CareerNode {
	var res []*models.CareerNode
	for _, node := range nodes {
		if filter.NodeType != nil && node.NodeType != *filter.NodeType {
			continue
		}
		if filter.ParentID != nil && (node.ParentID == nil || *node.ParentID != *filter.ParentID) {
			continue
		}
		if filter.Tag != nil && !containsTag(node.Tags, *filter.Tag) {
			continue
		}
		res = append(res, node)
	}
	return res
}

func containsTag(tags []string, target string) bool {
	for _, t := range tags {
		if t == target {
			return true
		}
	}
	return false
}

func (s *CareerService) DeleteNode(userID uuid.UUID, nodeID uuid.UUID) error {
	if s.repo != nil {
		_ = s.repo.DeleteNode(context.Background(), userID, nodeID)
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	node, exists := s.nodes[nodeID]
	if !exists || node.UserID != userID {
		return ErrNodeNotFound
	}
	delete(s.nodes, nodeID)
	return nil
}
