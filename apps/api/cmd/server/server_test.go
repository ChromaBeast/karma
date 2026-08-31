package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"karma/apps/api/pkg/models"
)

func TestCompleteServerRouterE2E(t *testing.T) {
	deps := BuildDependencies()
	router := SetupRouter(deps)

	// 1. Healthz Check
	reqHealth := httptest.NewRequest("GET", "/healthz", nil)
	recHealth := httptest.NewRecorder()
	router.ServeHTTP(recHealth, reqHealth)
	if recHealth.Code != http.StatusOK {
		t.Fatalf("expected 200 on /healthz, got %d", recHealth.Code)
	}

	// 2. LinkedIn Auth Callback
	authPayload := []byte(`{"email":"alice@karma.app","name":"Alice Engineer","linkedin_sub":"li_alice_123"}`)
	reqAuth := httptest.NewRequest("POST", "/v1/auth/linkedin/callback", bytes.NewBuffer(authPayload))
	recAuth := httptest.NewRecorder()
	router.ServeHTTP(recAuth, reqAuth)
	if recAuth.Code != http.StatusOK {
		t.Fatalf("expected 200 on auth callback, got %d", recAuth.Code)
	}

	var authResp models.AuthResponse
	if err := json.NewDecoder(recAuth.Body).Decode(&authResp); err != nil {
		t.Fatalf("failed to parse auth response: %v", err)
	}
	tokenHeader := "Bearer " + authResp.AccessToken

	// 3. BYOK Vault: Store key
	vaultPayload := []byte(`{"provider":"anthropic","api_key":"sk-ant-test-key-12345"}`)
	reqVault := httptest.NewRequest("POST", "/v1/vault/keys", bytes.NewBuffer(vaultPayload))
	reqVault.Header.Set("Authorization", tokenHeader)
	recVault := httptest.NewRecorder()
	router.ServeHTTP(recVault, reqVault)
	if recVault.Code != http.StatusCreated {
		t.Fatalf("expected 201 on vault key store, got %d", recVault.Code)
	}

	// 4. Career Event: Ingest
	eventPayload := []byte(`{"raw_text":"Architected high-scale microservices, reducing p99 latency by 50% and saving $80k annually.","capture_channel":"quick_add"}`)
	reqEvent := httptest.NewRequest("POST", "/v1/career-events", bytes.NewBuffer(eventPayload))
	reqEvent.Header.Set("Authorization", tokenHeader)
	recEvent := httptest.NewRecorder()
	router.ServeHTTP(recEvent, reqEvent)
	if recEvent.Code != http.StatusAccepted {
		t.Fatalf("expected 202 on career event ingestion, got %d", recEvent.Code)
	}

	// 5. Resume Engine: Ingest JD & Generate Resume
	jdPayload := []byte(`{"raw_text":"Staff Backend Engineer with Golang and AWS experience."}`)
	reqJD := httptest.NewRequest("POST", "/v1/resumes/ingest-jd", bytes.NewBuffer(jdPayload))
	reqJD.Header.Set("Authorization", tokenHeader)
	recJD := httptest.NewRecorder()
	router.ServeHTTP(recJD, reqJD)
	if recJD.Code != http.StatusCreated {
		t.Fatalf("expected 201 on JD ingestion, got %d", recJD.Code)
	}

	var jd models.JobDescription
	json.NewDecoder(recJD.Body).Decode(&jd)

	genResumePayload := []byte(`{"job_description_id":"` + jd.ID.String() + `","template_id":"modern_ats"}`)
	reqResume := httptest.NewRequest("POST", "/v1/resumes/generate", bytes.NewBuffer(genResumePayload))
	reqResume.Header.Set("Authorization", tokenHeader)
	recResume := httptest.NewRecorder()
	router.ServeHTTP(recResume, reqResume)
	if recResume.Code != http.StatusCreated {
		t.Fatalf("expected 201 on resume generation, got %d", recResume.Code)
	}

	// 6. Tools: LinkedIn Headline
	liPayload := []byte(`{"role_title":"Staff Engineer","top_skills":"Go, Kubernetes"}`)
	reqLI := httptest.NewRequest("POST", "/v1/tools/linkedin/headline", bytes.NewBuffer(liPayload))
	reqLI.Header.Set("Authorization", tokenHeader)
	recLI := httptest.NewRecorder()
	router.ServeHTTP(recLI, reqLI)
	if recLI.Code != http.StatusOK {
		t.Fatalf("expected 200 on tools headline, got %d", recLI.Code)
	}

	// 7. Portfolio: Upsert
	portPayload := []byte(`{"theme_id":"dark","subdomain":"alice","config":{"accent":"#6366f1"}}`)
	reqPort := httptest.NewRequest("POST", "/v1/portfolios", bytes.NewBuffer(portPayload))
	reqPort.Header.Set("Authorization", tokenHeader)
	recPort := httptest.NewRecorder()
	router.ServeHTTP(recPort, reqPort)
	if recPort.Code != http.StatusOK {
		t.Fatalf("expected 200 on portfolio upsert, got %d", recPort.Code)
	}
}
