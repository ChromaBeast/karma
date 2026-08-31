package tools

import (
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type OutreachService struct {
	mu      sync.RWMutex
	scripts map[uuid.UUID]*models.OutreachScript
}

func NewOutreachService() *OutreachService {
	return &OutreachService{
		scripts: make(map[uuid.UUID]*models.OutreachScript),
	}
}

func (s *OutreachService) GenerateOutreach(userID uuid.UUID, channel models.OutreachChannel, company, roleTitle, contactName string) (*models.OutreachScript, []string) {
	if contactName == "" {
		contactName = "Engineering Leader"
	}

	var variants []string
	if channel == models.ChannelLinkedInDM {
		variants = []string{
			fmt.Sprintf("Hi %s — saw your team is building at %s. I have been focusing on distributed systems and high-throughput APIs. Would love to connect and share notes on engineering challenges!", contactName, company),
			fmt.Sprintf("Hey %s, noticed the %s opening at %s. I recently optimized high-scale Go backends and thought my experience might align with what you are scaling. Open to a brief chat?", contactName, roleTitle, company),
		}
	} else {
		variants = []string{
			fmt.Sprintf("Subject: %s Opportunity — Engineering Background\n\nHi %s,\n\nI have followed %s's engineering work closely. With extensive background in Go, microservice architecture, and system scaling, I would love to explore if my technical background could assist your team's roadmap for %s.\n\nBest,\nKarma Candidate", roleTitle, contactName, company, roleTitle),
		}
	}

	script := &models.OutreachScript{
		ID:      uuid.New(),
		UserID:  userID,
		Channel: channel,
		TargetContext: map[string]interface{}{
			"company":      company,
			"role_title":   roleTitle,
			"contact_name": contactName,
		},
		GeneratedText: variants[0],
		CreatedAt:     time.Now().UTC(),
	}

	s.mu.Lock()
	s.scripts[script.ID] = script
	s.mu.Unlock()

	return script, variants
}
