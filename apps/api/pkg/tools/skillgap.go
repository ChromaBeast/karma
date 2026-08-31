package tools

import (
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type SkillGapService struct {
	mu        sync.RWMutex
	analyses  map[uuid.UUID]*models.SkillGapAnalysis
}

func NewSkillGapService() *SkillGapService {
	return &SkillGapService{
		analyses: make(map[uuid.UUID]*models.SkillGapAnalysis),
	}
}

func (s *SkillGapService) AnalyzeGaps(userID uuid.UUID, jd *models.JobDescription, userNodes []*models.CareerNode) *models.SkillGapAnalysis {
	userSkillMap := make(map[string]bool)
	for _, n := range userNodes {
		for _, tag := range n.Tags {
			userSkillMap[tag] = true
		}
	}

	var matchedSkills []string
	var missingSkills []string

	if jd != nil {
		for _, reqSkill := range jd.ParsedRequirements.RequiredSkills {
			if userSkillMap[reqSkill] {
				matchedSkills = append(matchedSkills, reqSkill)
			} else {
				missingSkills = append(missingSkills, reqSkill)
			}
		}
	}

	matchPercentage := 100.0
	totalReq := len(matchedSkills) + len(missingSkills)
	if totalReq > 0 {
		matchPercentage = (float64(len(matchedSkills)) / float64(totalReq)) * 100.0
	}

	report := map[string]interface{}{
		"match_percentage": matchPercentage,
		"matched_skills":   matchedSkills,
		"missing_skills":   missingSkills,
		"recommendations": []string{
			"Add career achievements highlighting missing skills",
			"Quantify results on matched skills to improve ATS re-ranking score",
		},
	}

	var jdID *uuid.UUID
	if jd != nil {
		jdID = &jd.ID
	}

	analysis := &models.SkillGapAnalysis{
		ID:               uuid.New(),
		UserID:           userID,
		JobDescriptionID: jdID,
		GapReport:        report,
		CreatedAt:        time.Now().UTC(),
	}

	s.mu.Lock()
	s.analyses[analysis.ID] = analysis
	s.mu.Unlock()

	return analysis
}
