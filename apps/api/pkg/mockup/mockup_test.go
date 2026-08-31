package mockup

import (
	"strings"
	"testing"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

func TestMockupGeneration(t *testing.T) {
	svc := NewMockupService()
	userID := uuid.New()

	m, err := svc.GenerateMockup(userID, nil, models.MockupDeviceFrame, "https://example.com/screenshot.png", map[string]interface{}{
		"frame_type": "browser",
		"title":      "Analytics Dashboard",
	})
	if err != nil {
		t.Fatalf("failed to generate mockup: %v", err)
	}

	if m.RenderedURL == nil || *m.RenderedURL == "" {
		t.Errorf("rendered URL should be set")
	}

	svg := GenerateDeviceFrameSVG(FrameBrowser, "https://example.com/screenshot.png", "Analytics Dashboard")
	if !strings.Contains(svg, "<svg") || !strings.Contains(svg, "Analytics Dashboard") {
		t.Errorf("SVG frame generation missing expected tags")
	}
}
