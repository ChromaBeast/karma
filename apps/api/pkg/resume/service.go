package resume

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
	"karma/apps/api/pkg/repository"
)

var (
	ErrJDNotFound     = errors.New("job description not found")
	ErrResumeNotFound = errors.New("resume not found")
)

type ResumeService struct {
	mu      sync.RWMutex
	repo    *repository.ResumeRepository
	jds     map[uuid.UUID]*models.JobDescription
	resumes map[uuid.UUID]*models.GeneratedResume
}

func NewResumeService(repo ...*repository.ResumeRepository) *ResumeService {
	svc := &ResumeService{
		jds:     make(map[uuid.UUID]*models.JobDescription),
		resumes: make(map[uuid.UUID]*models.GeneratedResume),
	}
	if len(repo) > 0 && repo[0] != nil {
		svc.repo = repo[0]
	}
	return svc
}

func (s *ResumeService) IngestJD(userID uuid.UUID, rawText string, company, roleTitle *string) *models.JobDescription {
	jd := CreateJobDescription(userID, rawText, company, roleTitle)
	s.mu.Lock()
	s.jds[jd.ID] = jd
	s.mu.Unlock()

	if s.repo != nil {
		_ = s.repo.SaveJobDescription(context.Background(), jd)
	}
	return jd
}

func (s *ResumeService) GetJD(jdID uuid.UUID) (*models.JobDescription, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	jd, exists := s.jds[jdID]
	if !exists {
		return nil, ErrJDNotFound
	}
	return jd, nil
}

func (s *ResumeService) GenerateResume(user models.User, jdID *uuid.UUID, nodes []*models.CareerNode, templateID string) (*models.GeneratedResume, error) {
	var jd *models.JobDescription
	if jdID != nil {
		var err error
		jd, err = s.GetJD(*jdID)
		if err != nil {
			return nil, err
		}
	} else {
		jd = CreateJobDescription(user.ID, "Software Engineer backend distributed systems", nil, nil)
	}

	candidates := RetrieveAndRankCandidates(nodes, jd)
	budget := DefaultKnapsackBudget()
	selections := SelectBulletsKnapsack(candidates, budget)

	atsScore := CalculateATSScore(jd, selections)
	html := RenderATSHtml(user, selections)
	plainText := ExtractPlainTextSelfCheck(html)

	pdfURL := "/v1/resumes/preview.pdf"
	resume := &models.GeneratedResume{
		ID:                uuid.New(),
		UserID:            user.ID,
		JobDescriptionID:  jdID,
		TemplateID:        templateID,
		PDFURL:            &pdfURL,
		ATSScore:          atsScore,
		GenerationParams:  map[string]interface{}{"budget": budget.TotalCharBudget, "template": templateID},
		BulletSelections:  selections,
		PlainTextFallback: plainText,
		CreatedAt:         time.Now().UTC(),
	}

	s.mu.Lock()
	s.resumes[resume.ID] = resume
	s.mu.Unlock()

	if s.repo != nil {
		_ = s.repo.SaveResume(context.Background(), resume)
	}

	return resume, nil
}

func (s *ResumeService) GetResume(resumeID uuid.UUID) (*models.GeneratedResume, error) {
	if s.repo != nil {
		if r, err := s.repo.GetResume(context.Background(), resumeID); err == nil && r != nil {
			return r, nil
		}
	}

	s.mu.RLock()
	defer s.mu.RUnlock()

	resume, exists := s.resumes[resumeID]
	if !exists {
		return nil, ErrResumeNotFound
	}
	return resume, nil
}

func (s *ResumeService) ListResumes(userID uuid.UUID) []*models.GeneratedResume {
	if s.repo != nil {
		if list, err := s.repo.ListResumes(context.Background(), userID); err == nil && len(list) > 0 {
			return list
		}
	}

	s.mu.RLock()
	defer s.mu.RUnlock()

	var list []*models.GeneratedResume
	for _, r := range s.resumes {
		if r.UserID == userID {
			list = append(list, r)
		}
	}
	return list
}
