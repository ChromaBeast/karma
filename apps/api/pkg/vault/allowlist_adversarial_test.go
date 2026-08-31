package vault

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestAllowlistEgressAdversarial(t *testing.T) {
	transport := NewAllowlistTransport(nil) // uses DefaultAllowedHosts

	t.Run("Valid allowlisted hosts pass transport check", func(t *testing.T) {
		validURLs := []string{
			"https://api.anthropic.com/v1/messages",
			"https://API.OPENAI.COM/v1/chat/completions", // Uppercase test
			"https://generativelanguage.googleapis.com/v1beta/models",
			"https://api.openai.com:443/v1/models", // Explicit HTTPS port
		}

		for _, u := range validURLs {
			req, err := http.NewRequest("GET", u, nil)
			if err != nil {
				t.Fatalf("Failed to create request for %s: %v", u, err)
			}
			hostname := strings.ToLower(req.URL.Hostname())
			if !transport.AllowedHosts[hostname] {
				t.Fatalf("Expected %s to be allowed, but was blocked", u)
			}
		}
	})

	t.Run("Malicious SSRF, proxies and harvest domains are strictly rejected", func(t *testing.T) {
		maliciousURLs := []string{
			"https://attacker-proxy.com/v1/chat",
			"https://evil-harvest-server.net/steal",
			"https://api.openai.com.attacker-domain.com/v1",  // Domain suffix trick
			"https://fake-generativelanguage.googleapis.com", // Domain prefix trick
			"http://127.0.0.1:8000/internal",                // Localhost IPv4
			"http://localhost:5432/postgres",                // Localhost hostname
			"http://169.254.169.254/latest/meta-data/",       // AWS IMDS metadata service
			"http://[::1]:8080/admin",                       // Localhost IPv6
			"https://api.anthropic.com@evil.com/harvest",    // User-info trick in URL
			"http://0.0.0.0:8080/exploit",
		}

		for _, u := range maliciousURLs {
			req, err := http.NewRequest("GET", u, nil)
			if err != nil {
				t.Fatalf("Failed to create request for %s: %v", u, err)
			}

			_, err = transport.RoundTrip(req)
			if err == nil {
				t.Fatalf("CRITICAL SECURITY VULNERABILITY: Malicious URL was NOT rejected: %s", u)
			}
			if !errors.Is(err, ErrHostNotAllowed) {
				t.Fatalf("Expected ErrHostNotAllowed for %s, got: %v", u, err)
			}
		}
	})

	t.Run("Mock server verifies end-to-end RoundTrip with custom allowlist", func(t *testing.T) {
		ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusOK)
			_, _ = w.Write([]byte(`{"status":"ok"}`))
		}))
		defer ts.Close()

		req, _ := http.NewRequest("GET", ts.URL, nil)

		// With default allowlist, mock server host is blocked
		clientDefault := &http.Client{Transport: transport}
		_, err := clientDefault.Do(req)
		if err == nil {
			t.Fatalf("Expected mock server URL %s to be blocked by default allowlist", ts.URL)
		}

		// With test mock server added to allowed list, it succeeds
		customAllowed := map[string]bool{
			strings.ToLower(req.URL.Hostname()): true,
		}
		clientCustom := &http.Client{
			Transport: &AllowlistTransport{
				BaseTransport: http.DefaultTransport,
				AllowedHosts:  customAllowed,
			},
		}

		resp, err := clientCustom.Do(req)
		if err != nil {
			t.Fatalf("Custom allowed host should have succeeded: %v", err)
		}
		defer resp.Body.Close()
		if resp.StatusCode != http.StatusOK {
			t.Fatalf("Expected 200 OK, got %d", resp.StatusCode)
		}
	})
}
