package resume

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"karma/apps/api/pkg/auth"
	"karma/apps/api/pkg/career"
	"karma/apps/api/pkg/models"
)

type ResumeHandler struct {
	resumeService *ResumeService
	careerService *career.CareerService
}

func NewResumeHandler(rSvc *ResumeService, cSvc *career.CareerService) *ResumeHandler {
	return &ResumeHandler{
		resumeService: rSvc,
		careerService: cSvc,
	}
}

func (h *ResumeHandler) IngestJD(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		RawText   string  `json:"raw_text"`
		Company   *string `json:"company,omitempty"`
		RoleTitle *string `json:"role_title,omitempty"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.RawText == "" {
		http.Error(w, `{"error":"raw_text is required"}`, http.StatusBadRequest)
		return
	}

	jd := h.resumeService.IngestJD(userID, req.RawText, req.Company, req.RoleTitle)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(jd)
}

func (h *ResumeHandler) GenerateResume(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	var req struct {
		JobDescriptionID *uuid.UUID `json:"job_description_id,omitempty"`
		TemplateID       string     `json:"template_id"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request payload"}`, http.StatusBadRequest)
		return
	}

	if req.TemplateID == "" {
		req.TemplateID = "modern_ats_single_column"
	}

	nodes := h.careerService.ListNodes(userID, career.NodeFilter{})
	user := models.User{
		ID:       userID,
		Email:    "user@karma.app",
		Name:     "Karma Candidate",
		PlanTier: models.PlanTierAccess,
	}

	resume, err := h.resumeService.GenerateResume(user, req.JobDescriptionID, nodes, req.TemplateID)
	if err != nil {
		http.Error(w, `{"error":"`+err.Error()+`"}`, http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(resume)
}

func (h *ResumeHandler) GetResume(w http.ResponseWriter, r *http.Request) {
	resumeIDStr := chi.URLParam(r, "id")
	resumeID, err := uuid.Parse(resumeIDStr)
	if err != nil {
		http.Error(w, `{"error":"invalid resume id"}`, http.StatusBadRequest)
		return
	}

	resume, err := h.resumeService.GetResume(resumeID)
	if err != nil {
		http.Error(w, `{"error":"resume not found"}`, http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resume)
}

func (h *ResumeHandler) ListResumes(w http.ResponseWriter, r *http.Request) {
	userID, ok := auth.GetUserID(r.Context())
	if !ok {
		http.Error(w, `{"error":"unauthorized"}`, http.StatusUnauthorized)
		return
	}

	list := h.resumeService.ListResumes(userID)
	if list == nil {
		list = []*models.GeneratedResume{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(list)
}
