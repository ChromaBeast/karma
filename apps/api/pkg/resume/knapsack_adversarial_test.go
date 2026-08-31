package resume

import (
	"testing"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

func TestKnapsackAdversarialScenarios(t *testing.T) {
	t.Run("Zero total budget should return empty selections", func(t *testing.T) {
		budget := DefaultKnapsackBudget()
		budget.TotalCharBudget = 0

		candidates := []ScoredCandidate{
			{
				Node:            &models.CareerNode{ID: uuid.New()},
				Section:         "Experience",
				ReRankScore:     0.95,
				FormattedBullet: "Led migration to Go microservices reducing latency by 40%.",
			},
		}

		res := SelectBulletsKnapsack(candidates, budget)
		if len(res) != 0 {
			t.Fatalf("expected 0 selections for zero budget, got %d", len(res))
		}
	})

	t.Run("Zero section budget should return empty selections for that section", func(t *testing.T) {
		budget := DefaultKnapsackBudget()
		budget.SectionBudgets["Experience"] = 0

		candidates := []ScoredCandidate{
			{
				Node:            &models.CareerNode{ID: uuid.New()},
				Section:         "Experience",
				ReRankScore:     0.99,
				FormattedBullet: "Scaled distributed architecture to 10M DAU.",
			},
			{
				Node:            &models.CareerNode{ID: uuid.New()},
				Section:         "Projects",
				ReRankScore:     0.80,
				FormattedBullet: "Built open-source Postgres query optimizer in Go.",
			},
		}

		res := SelectBulletsKnapsack(candidates, budget)
		if len(res) != 1 {
			t.Fatalf("expected 1 selection (Projects only), got %d", len(res))
		}
		if res[0].Section != "Projects" {
			t.Fatalf("expected Projects section, got %s", res[0].Section)
		}
	})

	t.Run("Oversized item exceeds budget is skipped, smaller fitting item is selected", func(t *testing.T) {
		budget := DefaultKnapsackBudget()
		budget.SectionBudgets["Skills"] = 50
		budget.TotalCharBudget = 50

		oversized := ScoredCandidate{
			Node:            &models.CareerNode{ID: uuid.New()},
			Section:         "Skills",
			ReRankScore:     0.99,
			FormattedBullet: "This bullet is intentionally very long and exceeds fifty characters total limit easily.",
		}
		fitting := ScoredCandidate{
			Node:            &models.CareerNode{ID: uuid.New()},
			Section:         "Skills",
			ReRankScore:     0.85,
			FormattedBullet: "Go, Kubernetes, Postgres",
		}

		res := SelectBulletsKnapsack([]ScoredCandidate{oversized, fitting}, budget)
		if len(res) != 1 {
			t.Fatalf("expected 1 fitting item selected, got %d", len(res))
		}
		if res[0].FinalText != fitting.FormattedBullet {
			t.Fatalf("expected '%s', got '%s'", fitting.FormattedBullet, res[0].FinalText)
		}
	})

	t.Run("Duplicate rank scores use shorter bullet as tie breaker", func(t *testing.T) {
		budget := DefaultKnapsackBudget()
		budget.MaxBulletsPerSec["Projects"] = 1

		longBullet := ScoredCandidate{
			Node:            &models.CareerNode{ID: uuid.New()},
			Section:         "Projects",
			ReRankScore:     0.90,
			FormattedBullet: "Architected real-time stream processing platform using Apache Kafka and Apache Flink with zero downtime.",
		}
		shortBullet := ScoredCandidate{
			Node:            &models.CareerNode{ID: uuid.New()},
			Section:         "Projects",
			ReRankScore:     0.90,
			FormattedBullet: "Built Kafka stream pipeline with zero downtime.",
		}

		res := SelectBulletsKnapsack([]ScoredCandidate{longBullet, shortBullet}, budget)
		if len(res) != 1 {
			t.Fatalf("expected 1 item due to max bullets limit, got %d", len(res))
		}
		if res[0].FinalText != shortBullet.FormattedBullet {
			t.Fatalf("expected shorter bullet '%s' on score tie, got '%s'", shortBullet.FormattedBullet, res[0].FinalText)
		}
	})

	t.Run("Empty candidates list returns empty slice", func(t *testing.T) {
		budget := DefaultKnapsackBudget()
		res := SelectBulletsKnapsack([]ScoredCandidate{}, budget)
		if len(res) != 0 {
			t.Fatalf("expected 0 selections for empty input, got %d", len(res))
		}
	})

	t.Run("Section max bullet count is strictly enforced", func(t *testing.T) {
		budget := DefaultKnapsackBudget()
		budget.MaxBulletsPerSec["Education"] = 2

		candidates := make([]ScoredCandidate, 5)
		for i := 0; i < 5; i++ {
			candidates[i] = ScoredCandidate{
				Node:            &models.CareerNode{ID: uuid.New()},
				Section:         "Education",
				ReRankScore:     0.90 - float64(i)*0.05,
				FormattedBullet: "B.S. in Computer Science, Magna Cum Laude",
			}
		}

		res := SelectBulletsKnapsack(candidates, budget)
		if len(res) != 2 {
			t.Fatalf("expected max 2 education bullets, got %d", len(res))
		}
	})
}
