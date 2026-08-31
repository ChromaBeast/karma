package tools

import (
	"context"
	"errors"
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
	"karma/apps/api/pkg/repository"
)

var SeededQuestionBanks = map[string][]string{
	"system_design": {
		"How would you design a distributed rate limiter that handles 1M requests per second across multiple regions?",
		"Design a real-time event streaming pipeline for tracking user achievements with exactly-once semantics.",
		"How would you architect a global cache invalidation strategy for high-write workloads?",
	},
	"golang_backend": {
		"Explain how the Go runtime scheduler (GMP model) works and how goroutine preemption operates.",
		"How do you prevent memory leaks when working with channels, contexts, and long-lived worker pools in Go?",
		"What are the trade-offs of sync.Pool vs direct heap allocations in high-throughput services?",
	},
}

type InterviewService struct {
	mu       sync.RWMutex
	repo     *repository.ToolsRepository
	sessions map[uuid.UUID]*models.InterviewSession
}

func NewInterviewService(repo ...*repository.ToolsRepository) *InterviewService {
	svc := &InterviewService{
		sessions: make(map[uuid.UUID]*models.InterviewSession),
	}
	if len(repo) > 0 && repo[0] != nil {
		svc.repo = repo[0]
	}
	return svc
}

func (s *InterviewService) StartSession(userID uuid.UUID, domain, roleTitle string) (*models.InterviewSession, string) {
	questions, ok := SeededQuestionBanks[domain]
	if !ok {
		questions = SeededQuestionBanks["golang_backend"]
	}

	initialQuestion := questions[0]
	session := &models.InterviewSession{
		ID:        uuid.New(),
		UserID:    userID,
		Domain:    domain,
		RoleTitle: &roleTitle,
		Transcript: []models.InterviewMessage{
			{Role: "interviewer", Content: initialQuestion},
		},
		CreatedAt: time.Now().UTC(),
	}

	if s.repo != nil {
		_ = s.repo.SaveInterviewSession(context.Background(), session)
	}

	s.mu.Lock()
	s.sessions[session.ID] = session
	s.mu.Unlock()

	return session, initialQuestion
}

func (s *InterviewService) SubmitAnswer(sessionID uuid.UUID, answer string) (*models.InterviewSession, map[string]interface{}, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	session, exists := s.sessions[sessionID]
	if !exists {
		return nil, nil, errors.New("interview session not found")
	}

	session.Transcript = append(session.Transcript, models.InterviewMessage{
		Role:    "candidate",
		Content: answer,
	})

	feedback := map[string]interface{}{
		"score_overall": 9.0,
		"rubric": map[string]int{
			"technical_depth": 9,
			"clarity":         8,
			"edge_cases":      9,
		},
		"critique": fmt.Sprintf("Strong explanation covering core architectural trade-offs. Length: %d chars.", len(answer)),
	}
	session.Feedback = feedback

	if s.repo != nil {
		_ = s.repo.SaveInterviewSession(context.Background(), session)
	}

	return session, feedback, nil
}
