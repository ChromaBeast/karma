package vault

import (
	"crypto/rand"
	"io"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

func TestEnvelopeEncryptionAndDecryption(t *testing.T) {
	masterKey := make([]byte, 32)
	io.ReadFull(rand.Reader, masterKey)
	kms, err := NewKMSMasterKey(masterKey)
	if err != nil {
		t.Fatalf("failed to init KMS master key: %v", err)
	}

	vaultSvc := NewVaultService(kms)
	userID := uuid.New()
	rawAPIKey := "sk-ant-api03-secret1234567890-testkey"

	resp, err := vaultSvc.StoreKey(userID, models.ProviderAnthropic, rawAPIKey)
	if err != nil {
		t.Fatalf("failed to store BYOK key: %v", err)
	}

	if resp.KeyLast4 != "tkey" {
		t.Errorf("expected last4 'tkey', got '%s'", resp.KeyLast4)
	}
	if resp.Provider != models.ProviderAnthropic {
		t.Errorf("expected provider anthropic, got %s", resp.Provider)
	}

	// Decrypt on demand
	decrypted, err := vaultSvc.DecryptKey(userID, models.ProviderAnthropic)
	if err != nil {
		t.Fatalf("failed to decrypt key: %v", err)
	}
	if decrypted != rawAPIKey {
		t.Fatalf("decrypted key mismatch: expected %s, got %s", rawAPIKey, decrypted)
	}

	// Test non-existent user / provider
	_, err = vaultSvc.DecryptKey(uuid.New(), models.ProviderOpenAI)
	if err != ErrKeyNotFound {
		t.Errorf("expected ErrKeyNotFound, got %v", err)
	}
}

func TestAllowlistEgressTransport(t *testing.T) {
	transport := NewAllowlistTransport(DefaultAllowedHosts)
	client := &http.Client{Transport: transport}

	// Test disallowed host
	reqDisallowed, _ := http.NewRequest("POST", "https://malicious-proxy.com/v1/harvest", nil)
	_, err := client.Do(reqDisallowed)
	if err == nil {
		t.Fatalf("expected error for disallowed host, got nil")
	}

	// Test custom mock with allowed host simulation
	customAllowed := map[string]bool{"127.0.0.1": true, "localhost": true}
	customClient := &http.Client{Transport: NewAllowlistTransport(customAllowed)}
	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("ok"))
	}))
	defer ts.Close()

	reqAllowed, _ := http.NewRequest("GET", ts.URL, nil)
	res, err := customClient.Do(reqAllowed)
	if err != nil {
		t.Fatalf("unexpected error for allowed local host: %v", err)
	}
	if res.StatusCode != http.StatusOK {
		t.Errorf("expected 200, got %d", res.StatusCode)
	}
}
