package tools

import (
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"karma/apps/api/pkg/auth"
	"karma/apps/api/pkg/career"
	"karma/apps/api/pkg/models"
	"karma/apps/api/pkg/resume"
)

type ToolsHandler struct {
	liService  *LinkedInService
	intService *InterviewService
	clService  *CoverLetterService
	outService *OutreachService
	sgService  *SkillGapService
	carService *career.CareerService
	resService *resume.ResumeService
}

func NewToolsHandler(
	li *LinkedInService,
	intSvc *InterviewService,
	cl *CoverLetterService,
	out *OutreachService,
	sg *SkillGapService,
	car *career.CareerService,
	res *resume.ResumeService,
) *ToolsHandler {
	return &ToolsHandler{
		liService:  li,
		intService: intSvc,
		clService:  cl,
		outService: out,
		sgService:  sg,
		carService: car,
		resService: res,
	}
}

func (h *ToolsHandler) GenerateHeadline(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		RoleTitle string `json:"role_title"`
		TopSkills string `json:"top_skills"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}

	asset, variants := h.liService.GenerateHeadline(userID, req.RoleTitle, req.TopSkills)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"asset":    asset,
		"variants": variants,
	})
}

func (h *ToolsHandler) GeneratePost(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		ProjectTitle  string `json:"project_title"`
		MetricsResult string `json:"metrics_result"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}

	asset, variants := h.liService.GeneratePost(userID, req.ProjectTitle, req.MetricsResult)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"asset":    asset,
		"variants": variants,
	})
}

func (h *ToolsHandler) GenerateCoverLetter(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		JobDescriptionID *uuid.UUID `json:"job_description_id,omitempty"`
		Company          string     `json:"company"`
		RoleTitle        string     `json:"role_title"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}

	nodes := h.carService.ListNodes(userID, career.NodeFilter{})
	letter := h.clService.SynthesizeCoverLetter(userID, req.JobDescriptionID, req.Company, req.RoleTitle, nodes)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(letter)
}

func (h *ToolsHandler) GenerateOutreach(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		Channel     models.OutreachChannel `json:"channel"`
		Company     string                 `json:"company"`
		RoleTitle   string                 `json:"role_title"`
		ContactName string                 `json:"contact_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}

	script, variants := h.outService.GenerateOutreach(userID, req.Channel, req.Company, req.RoleTitle, req.ContactName)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"script":   script,
		"variants": variants,
	})
}

func (h *ToolsHandler) AnalyzeSkillGap(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		JobDescriptionID *uuid.UUID `json:"job_description_id,omitempty"`
	}
	json.NewDecoder(r.Body).Decode(&req)

	var jd *models.JobDescription
	if req.JobDescriptionID != nil {
		jd, _ = h.resService.GetJD(*req.JobDescriptionID)
	}

	nodes := h.carService.ListNodes(userID, career.NodeFilter{})
	analysis := h.sgService.AnalyzeGaps(userID, jd, nodes)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(analysis)
}
