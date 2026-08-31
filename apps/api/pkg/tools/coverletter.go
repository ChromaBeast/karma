package tools

import (
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type CoverLetterService struct {
	mu      sync.RWMutex
	letters map[uuid.UUID]*models.CoverLetter
}

func NewCoverLetterService() *CoverLetterService {
	return &CoverLetterService{
		letters: make(map[uuid.UUID]*models.CoverLetter),
	}
}

func (s *CoverLetterService) SynthesizeCoverLetter(userID uuid.UUID, jdID *uuid.UUID, company, roleTitle string, highlightNodes []*models.CareerNode) *models.CoverLetter {
	var highlights []string
	for _, n := range highlightNodes {
		highlights = append(highlights, fmt.Sprintf("• %s", n.Title))
	}
	highlightsStr := strings.Join(highlights, "\n")
	if highlightsStr == "" {
		highlightsStr = "• Architected high-concurrency microservice APIs with 99.99% reliability."
	}

	body := fmt.Sprintf(`Dear Hiring Team at %s,

I am writing to express my strong interest in the %s position. Throughout my career, I have focused on engineering scalable backend systems and high-throughput architectures that compound technical value.

Key achievements relevant to this role:
%s

I welcome the opportunity to discuss how my technical expertise aligns with your engineering goals.

Sincerely,
Karma Candidate`, company, roleTitle, highlightsStr)

	pdfURL := "/v1/cover-letters/download.pdf"
	letter := &models.CoverLetter{
		ID:               uuid.New(),
		UserID:           userID,
		JobDescriptionID: jdID,
		GeneratedText:    body,
		PDFURL:           &pdfURL,
		CreatedAt:        time.Now().UTC(),
	}

	s.mu.Lock()
	s.letters[letter.ID] = letter
	s.mu.Unlock()

	return letter
}
