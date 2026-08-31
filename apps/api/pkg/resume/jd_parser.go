package resume

import (
	"regexp"
	"strings"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/career"
	"karma/apps/api/pkg/models"
)

var (
	seniorityRegex = regexp.MustCompile(`(?i)\b(senior|staff|lead|principal|junior|mid|director|vp|head)\b`)
	keywordRegex   = regexp.MustCompile(`[a-zA-Z0-9_\.\+#]+`)
)

func ParseJobDescriptionText(raw string) models.ParsedRequirements {
	lower := strings.ToLower(raw)
	words := keywordRegex.FindAllString(lower, -1)

	var skills []string
	var seniority []string
	var keywords []string

	for _, w := range words {
		if norm, ok := career.CanonicalVocabulary[w]; ok {
			skills = append(skills, norm)
		}
	}

	matches := seniorityRegex.FindAllString(raw, -1)
	for _, m := range matches {
		seniority = append(seniority, strings.ToLower(m))
	}

	for _, w := range words {
		if len(w) > 3 {
			keywords = append(keywords, w)
		}
	}

	return models.ParsedRequirements{
		RequiredSkills:   career.NormalizeTags(skills),
		PreferredSkills:  []string{},
		SenioritySignals: seniority,
		ATSKeywords:      career.NormalizeTags(keywords),
		FormattingNotes:  "Standard ATS single-column layout expected",
	}
}

func CreateJobDescription(userID uuid.UUID, rawText string, company, roleTitle *string) *models.JobDescription {
	parsed := ParseJobDescriptionText(rawText)
	embedding := career.GenerateVectorEmbedding(rawText)

	return &models.JobDescription{
		ID:                 uuid.New(),
		UserID:             userID,
		RawText:            rawText,
		Company:            company,
		RoleTitle:          roleTitle,
		ParsedRequirements: parsed,
		Embedding:          embedding,
		CreatedAt:          time.Now().UTC(),
	}
}
