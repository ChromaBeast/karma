package vault

import (
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"
)

var (
	ErrHostNotAllowed = errors.New("outbound target host is not in BYOK provider allowlist")
)

var DefaultAllowedHosts = map[string]bool{
	"api.anthropic.com":                true,
	"api.openai.com":                   true,
	"generativelanguage.googleapis.com": true,
}

type AllowlistTransport struct {
	BaseTransport http.RoundTripper
	AllowedHosts  map[string]bool
}

func NewAllowlistTransport(allowedHosts map[string]bool) *AllowlistTransport {
	if allowedHosts == nil {
		allowedHosts = DefaultAllowedHosts
	}
	return &AllowlistTransport{
		BaseTransport: http.DefaultTransport,
		AllowedHosts:  allowedHosts,
	}
}

func (t *AllowlistTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	hostname := strings.ToLower(req.URL.Hostname())
	if !t.AllowedHosts[hostname] {
		return nil, fmt.Errorf("%w: %s", ErrHostNotAllowed, hostname)
	}

	transport := t.BaseTransport
	if transport == nil {
		transport = http.DefaultTransport
	}
	return transport.RoundTrip(req)
}

func NewAllowlistedHTTPClient(timeout time.Duration) *http.Client {
	if timeout <= 0 {
		timeout = 30 * time.Second
	}
	return &http.Client{
		Transport: NewAllowlistTransport(DefaultAllowedHosts),
		Timeout:   timeout,
	}
}
