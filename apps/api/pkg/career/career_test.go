package career

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/auth"
	"karma/apps/api/pkg/models"
)

func TestTagNormalization(t *testing.T) {
	tags := []string{"Go", "k8s", "PostgreSQL", "Tailwind", "custom-tag"}
	norm := NormalizeTags(tags)

	expected := map[string]bool{
		"golang":      true,
		"kubernetes":  true,
		"postgresql":  true,
		"tailwind_css": true,
		"custom_tag":  true,
	}

	for _, n := range norm {
		if !expected[n] {
			t.Errorf("unexpected normalized tag: %s", n)
		}
	}
}

func TestMetricExtraction(t *testing.T) {
	text := "Led migration to Go microservices, reduced p99 latency by 45%, saved $120k annually, and supported 250k users."
	metrics := ExtractMetrics(text)

	if metrics.PercentageDelta == nil || *metrics.PercentageDelta != 45.0 {
		t.Errorf("expected 45%% percentage delta, got %v", metrics.PercentageDelta)
	}
	if metrics.DollarValueUSD == nil || *metrics.DollarValueUSD != 120000.0 {
		t.Errorf("expected $120,000 USD, got %v", metrics.DollarValueUSD)
	}
	if metrics.ScaleUsers == nil || *metrics.ScaleUsers != 250000 {
		t.Errorf("expected 250,000 users, got %v", metrics.ScaleUsers)
	}
}

func TestEventIngestionAndAsyncStructuring(t *testing.T) {
	svc := NewCareerService()
	userID := uuid.New()
	rawText := "Architected distributed Redis caching layer. Reduced query response times by 60%. Scaled system to 500k DAU."

	event, err := svc.IngestEvent(userID, models.ChannelQuickAdd, rawText)
	if err != nil {
		t.Fatalf("failed to ingest event: %v", err)
	}
	if event.ProcessedAt != nil {
		// Asynchronous processing should start
	}

	// Wait for async processing
	time.Sleep(50 * time.Millisecond)

	processedEvent, err := svc.GetEvent(event.ID)
	if err != nil {
		t.Fatalf("failed to get event: %v", err)
	}
	if processedEvent.ProcessedAt == nil || processedEvent.CareerNodeID == nil {
		t.Fatalf("event was not processed asynchronously")
	}

	node, err := svc.GetNode(*processedEvent.CareerNodeID)
	if err != nil {
		t.Fatalf("failed to get created node: %v", err)
	}
	if node.Metrics.PercentageDelta == nil || *node.Metrics.PercentageDelta != 60.0 {
		t.Errorf("expected 60%% percentage delta on node, got %v", node.Metrics.PercentageDelta)
	}
	if len(node.Embedding) != 1536 {
		t.Errorf("expected 1536 embedding dimensions, got %d", len(node.Embedding))
	}
}

func TestCareerHTTPHandlers(t *testing.T) {
	svc := NewCareerService()
	handler := NewCareerHandler(svc)
	jwtSvc := auth.NewJWTService("test-secret-key-32-chars-long-123")

	userID := uuid.New()
	token, _, _ := jwtSvc.GenerateAccessToken(models.User{ID: userID, PlanTier: models.PlanTierAccess}, []string{"career:write"})

	body := []byte(`{"raw_text":"Optimized SQL queries by 30%","capture_channel":"quick_add"}`)
	req := httptest.NewRequest("POST", "/v1/career-events", bytes.NewBuffer(body))
	req.Header.Set("Authorization", "Bearer "+token)
	rec := httptest.NewRecorder()

	auth.AuthMiddleware(jwtSvc)(http.HandlerFunc(handler.IngestEvent)).ServeHTTP(rec, req)

	if rec.Code != http.StatusAccepted {
		t.Fatalf("expected 202 Accepted, got %d", rec.Code)
	}

	var ev models.CareerNodeEvent
	if err := json.NewDecoder(rec.Body).Decode(&ev); err != nil {
		t.Fatalf("failed to parse event response: %v", err)
	}
	if ev.ID == uuid.Nil {
		t.Errorf("expected non-nil event ID")
	}
}
