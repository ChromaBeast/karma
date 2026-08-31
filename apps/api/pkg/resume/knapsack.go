package resume

import (
	"sort"

	"karma/apps/api/pkg/models"
)

type KnapsackBudget struct {
	TotalCharBudget   int
	SectionBudgets    map[string]int
	MaxBulletsPerSec  map[string]int
}

func DefaultKnapsackBudget() KnapsackBudget {
	return KnapsackBudget{
		TotalCharBudget: 2800,
		SectionBudgets: map[string]int{
			"Experience": 1600,
			"Projects":   800,
			"Skills":     300,
			"Education":  200,
		},
		MaxBulletsPerSec: map[string]int{
			"Experience": 8,
			"Projects":   4,
			"Skills":     5,
			"Education":  2,
		},
	}
}

func SelectBulletsKnapsack(candidates []ScoredCandidate, budget KnapsackBudget) []models.ResumeBulletSelection {
	// Group candidates by section
	bySection := make(map[string][]ScoredCandidate)
	for _, c := range candidates {
		bySection[c.Section] = append(bySection[c.Section], c)
	}

	for _, list := range bySection {
		sort.Slice(list, func(i, j int) bool {
			// Rank score prioritized; tie-breaker: shorter bullet length (better density)
			if list[i].ReRankScore == list[j].ReRankScore {
				return len(list[i].FormattedBullet) < len(list[j].FormattedBullet)
			}
			return list[i].ReRankScore > list[j].ReRankScore
		})
	}

	var selections []models.ResumeBulletSelection
	currentTotalChars := 0
	sectionChars := make(map[string]int)
	sectionBulletCounts := make(map[string]int)

	order := []string{"Experience", "Projects", "Skills", "Education"}
	for _, sec := range order {
		candidatesInSec := bySection[sec]
		maxSecChars := budget.SectionBudgets[sec]
		maxBullets := budget.MaxBulletsPerSec[sec]

		for _, item := range candidatesInSec {
			charLen := len(item.FormattedBullet)
			if sectionBulletCounts[sec] >= maxBullets {
				continue
			}
			if sectionChars[sec]+charLen > maxSecChars {
				continue
			}
			if currentTotalChars+charLen > budget.TotalCharBudget {
				continue
			}

			selections = append(selections, models.ResumeBulletSelection{
				CareerNodeID: item.Node.ID,
				RankScore:    item.ReRankScore,
				FinalText:    item.FormattedBullet,
				Section:      sec,
				CharCount:    charLen,
			})

			currentTotalChars += charLen
			sectionChars[sec] += charLen
			sectionBulletCounts[sec]++
		}
	}

	return selections
}
