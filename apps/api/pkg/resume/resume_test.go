package resume

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/google/uuid"
	"karma/apps/api/pkg/auth"
	"karma/apps/api/pkg/career"
	"karma/apps/api/pkg/models"
)

func TestJDParsingAndRequirements(t *testing.T) {
	rawJD := "Looking for a Senior Golang Backend Engineer with experience in Kubernetes, PostgreSQL, and Redis. Must understand distributed systems."
	parsed := ParseJobDescriptionText(rawJD)

	expectedSkills := map[string]bool{
		"golang":              true,
		"kubernetes":          true,
		"postgresql":          true,
		"redis":               true,
		"distributed_systems": true,
	}

	for _, s := range parsed.RequiredSkills {
		if !expectedSkills[s] {
			t.Logf("Found skill: %s", s)
		}
	}

	if len(parsed.SenioritySignals) == 0 || parsed.SenioritySignals[0] != "senior" {
		t.Errorf("expected senior signal, got %v", parsed.SenioritySignals)
	}
}

func TestKnapsackBudgetConstraint(t *testing.T) {
	var candidates []ScoredCandidate
	for i := 0; i < 20; i++ {
		sec := "Experience"
		if i%3 == 0 {
			sec = "Projects"
		}
		candidates = append(candidates, ScoredCandidate{
			Node: &models.CareerNode{
				ID: uuid.New(),
			},
			ReRankScore:     float64(20-i) / 20.0,
			Section:         sec,
			FormattedBullet: "Led major initiative to build distributed data pipeline with Go, Kafka, and Postgres.",
		})
	}

	budget := KnapsackBudget{
		TotalCharBudget:  300,
		SectionBudgets:   map[string]int{"Experience": 200, "Projects": 100},
		MaxBulletsPerSec: map[string]int{"Experience": 2, "Projects": 1},
	}

	selections := SelectBulletsKnapsack(candidates, budget)

	totalChars := 0
	for _, sel := range selections {
		totalChars += sel.CharCount
	}

	if totalChars > budget.TotalCharBudget {
		t.Fatalf("total chars %d exceeded budget %d", totalChars, budget.TotalCharBudget)
	}
	if len(selections) == 0 {
		t.Fatalf("knapsack selection returned 0 bullets")
	}
}

func TestATSRenderingAndSelfCheck(t *testing.T) {
	user := models.User{
		ID:    uuid.New(),
		Name:  "Jane Doe",
		Email: "jane@karma.app",
	}

	selections := []models.ResumeBulletSelection{
		{
			CareerNodeID: uuid.New(),
			Section:      "Experience",
			FinalText:    "Built high-throughput Go microservice processing 10k rps with 99.99% uptime.",
			CharCount:    76,
		},
	}

	html := RenderATSHtml(user, selections)
	plainText := ExtractPlainTextSelfCheck(html)

	if plainText == "" {
		t.Fatalf("plain text self check is empty")
	}
	if !bytes.Contains([]byte(plainText), []byte("Jane Doe")) {
		t.Errorf("plain text should contain candidate name")
	}
}

func TestResumeHTTPHandler(t *testing.T) {
	rSvc := NewResumeService()
	cSvc := career.NewCareerService()
	handler := NewResumeHandler(rSvc, cSvc)
	jwtSvc := auth.NewJWTService("test-secret-key-32-chars-long-123")

	userID := uuid.New()
	token, _, _ := jwtSvc.GenerateAccessToken(models.User{ID: userID, PlanTier: models.PlanTierAccess}, []string{"resume:generate"})

	// 1. Ingest JD
	jdBody := []byte(`{"raw_text":"Backend engineer with Golang and AWS"}`)
	req := httptest.NewRequest("POST", "/v1/resumes/ingest-jd", bytes.NewBuffer(jdBody))
	req.Header.Set("Authorization", "Bearer "+token)
	rec := httptest.NewRecorder()

	auth.AuthMiddleware(jwtSvc)(http.HandlerFunc(handler.IngestJD)).ServeHTTP(rec, req)
	if rec.Code != http.StatusCreated {
		t.Fatalf("expected 201 Created on JD ingestion, got %d", rec.Code)
	}

	var jd models.JobDescription
	json.NewDecoder(rec.Body).Decode(&jd)

	// 2. Generate Resume
	genBody := []byte(`{"job_description_id":"` + jd.ID.String() + `","template_id":"modern_ats"}`)
	reqGen := httptest.NewRequest("POST", "/v1/resumes/generate", bytes.NewBuffer(genBody))
	reqGen.Header.Set("Authorization", "Bearer "+token)
	recGen := httptest.NewRecorder()

	auth.AuthMiddleware(jwtSvc)(http.HandlerFunc(handler.GenerateResume)).ServeHTTP(recGen, reqGen)
	if recGen.Code != http.StatusCreated {
		t.Fatalf("expected 201 Created on resume generation, got %d: %s", recGen.Code, recGen.Body.String())
	}
}
