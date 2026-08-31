package portfolio

import (
	"testing"

	"github.com/google/uuid"
)

func TestPortfolioOperations(t *testing.T) {
	svc := NewPortfolioService()
	userID := uuid.New()

	// 1. Upsert valid portfolio
	p, err := svc.UpsertPortfolio(userID, "minimal_dark", "johndoe", map[string]interface{}{
		"accent_color": "#6366f1",
	})
	if err != nil {
		t.Fatalf("failed to upsert portfolio: %v", err)
	}
	if p.Subdomain != "johndoe" {
		t.Errorf("expected subdomain johndoe, got %s", p.Subdomain)
	}

	// 2. Subdomain validation (invalid characters)
	_, err = svc.UpsertPortfolio(uuid.New(), "modern", "Invalid Subdomain!", nil)
	if err != ErrInvalidSubdomain {
		t.Errorf("expected ErrInvalidSubdomain, got %v", err)
	}

	// 3. Publish portfolio
	published, err := svc.PublishPortfolio(userID)
	if err != nil {
		t.Fatalf("failed to publish portfolio: %v", err)
	}
	if published.PublishedAt == nil {
		t.Errorf("expected published_at to be populated")
	}

	// 4. Set projects
	n1, n2 := uuid.New(), uuid.New()
	projects := svc.SetProjects(p.ID, []uuid.UUID{n1, n2})
	if len(projects) != 2 || projects[1].DisplayOrder != 1 {
		t.Errorf("projects linking failed")
	}
}
