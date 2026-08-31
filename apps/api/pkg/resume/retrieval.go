package resume

import (
	"fmt"
	"math"
	"sort"

	"karma/apps/api/pkg/models"
)

type ScoredCandidate struct {
	Node            *models.CareerNode
	CosineSim       float64
	ReRankScore     float64
	ReRankRationale string
	Section         string
	FormattedBullet string
}

func CosineSimilarity(a, b []float32) float64 {
	if len(a) == 0 || len(b) == 0 || len(a) != len(b) {
		return 0.0
	}
	var dot, sumA, sumB float64
	for i := 0; i < len(a); i++ {
		dot += float64(a[i] * b[i])
		sumA += float64(a[i] * a[i])
		sumB += float64(b[i] * b[i])
	}
	if sumA == 0 || sumB == 0 {
		return 0.0
	}
	return dot / (math.Sqrt(sumA) * math.Sqrt(sumB))
}

func ReRankCandidate(node *models.CareerNode, jd *models.JobDescription, cosSim float64) (float64, string) {
	score := cosSim * 0.4

	// Keyword match boost
	matchCount := 0
	for _, reqSkill := range jd.ParsedRequirements.RequiredSkills {
		for _, nodeTag := range node.Tags {
			if reqSkill == nodeTag {
				matchCount++
			}
		}
	}
	if len(jd.ParsedRequirements.RequiredSkills) > 0 {
		keywordBoost := float64(matchCount) / float64(len(jd.ParsedRequirements.RequiredSkills))
		score += keywordBoost * 0.3
	}

	// Metric density boost
	if node.Metrics.PercentageDelta != nil || node.Metrics.DollarValueUSD != nil || node.Metrics.ScaleUsers != nil {
		score += 0.2
	}

	if score > 1.0 {
		score = 1.0
	}

	rationale := fmt.Sprintf("Cosine similarity: %.2f, keyword matches: %d, metric density bonus applied", cosSim, matchCount)
	return score, rationale
}

func RetrieveAndRankCandidates(nodes []*models.CareerNode, jd *models.JobDescription) []ScoredCandidate {
	var candidates []ScoredCandidate

	for _, node := range nodes {
		sim := CosineSimilarity(node.Embedding, jd.Embedding)
		score, rationale := ReRankCandidate(node, jd, sim)

		section := "Experience"
		if node.NodeType == models.NodeTypeProject {
			section = "Projects"
		} else if node.NodeType == models.NodeTypeSkill {
			section = "Skills"
		} else if node.NodeType == models.NodeTypeEducation {
			section = "Education"
		}

		bulletText := node.Title
		if node.Result != nil && *node.Result != "" {
			bulletText = fmt.Sprintf("%s — %s", node.Title, *node.Result)
		}

		candidates = append(candidates, ScoredCandidate{
			Node:            node,
			CosineSim:       sim,
			ReRankScore:     score,
			ReRankRationale: rationale,
			Section:         section,
			FormattedBullet: bulletText,
		})
	}

	sort.Slice(candidates, func(i, j int) bool {
		return candidates[i].ReRankScore > candidates[j].ReRankScore
	})

	return candidates
}
