package tools

import (
	"testing"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
	"karma/apps/api/pkg/resume"
)

func TestCareerAccelerationTools(t *testing.T) {
	userID := uuid.New()

	// 1. LinkedIn headline
	liSvc := NewLinkedInService()
	_, variants := liSvc.GenerateHeadline(userID, "Principal Engineer", "Golang, Kubernetes")
	if len(variants) < 2 {
		t.Fatalf("expected at least 2 headline variants")
	}

	// 2. Interview simulator
	intSvc := NewInterviewService()
	session, q := intSvc.StartSession(userID, "system_design", "Staff Engineer")
	if q == "" || session.ID == uuid.Nil {
		t.Fatalf("failed to start interview session")
	}
	_, feedback, err := intSvc.SubmitAnswer(session.ID, "I would partition the database and implement distributed token buckets.")
	if err != nil || feedback == nil {
		t.Fatalf("failed to submit interview answer: %v", err)
	}

	// 3. Cover letter
	clSvc := NewCoverLetterService()
	letter := clSvc.SynthesizeCoverLetter(userID, nil, "Stripe", "Senior Infrastructure Engineer", nil)
	if letter.GeneratedText == "" {
		t.Fatalf("empty cover letter generated")
	}

	// 4. Outreach
	outSvc := NewOutreachService()
	_, outVars := outSvc.GenerateOutreach(userID, models.ChannelLinkedInDM, "Anthropic", "Backend Engineer", "Alex")
	if len(outVars) == 0 {
		t.Fatalf("outreach scripts empty")
	}

	// 5. Skill gap
	sgSvc := NewSkillGapService()
	jd := resume.CreateJobDescription(userID, "Requires Golang, Kubernetes, Kafka, and Redis", nil, nil)
	userNodes := []*models.CareerNode{
		{
			ID:   uuid.New(),
			Tags: []string{"golang", "kubernetes", "postgresql"},
		},
	}
	analysis := sgSvc.AnalyzeGaps(userID, jd, userNodes)
	if analysis.GapReport == nil {
		t.Fatalf("gap report missing")
	}
}
