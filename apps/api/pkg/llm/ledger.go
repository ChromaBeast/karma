package llm

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
	ErrInsufficientCredits = errors.New("insufficient managed credits; please purchase credits or switch to BYOK")
)

type CreditLedgerService struct {
	mu      sync.RWMutex
	repo    *repository.LLMRepository
	ledger  map[uuid.UUID][]models.ManagedCreditLedger
	balance map[uuid.UUID]float64
}

func NewCreditLedgerService(repo ...*repository.LLMRepository) *CreditLedgerService {
	svc := &CreditLedgerService{
		ledger:  make(map[uuid.UUID][]models.ManagedCreditLedger),
		balance: make(map[uuid.UUID]float64),
	}
	if len(repo) > 0 && repo[0] != nil {
		svc.repo = repo[0]
	}
	return svc
}

func (s *CreditLedgerService) GetBalance(userID uuid.UUID) float64 {
	if s.repo != nil {
		if b, err := s.repo.GetLatestBalance(context.Background(), userID); err == nil && b > 0 {
			return b
		}
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	return s.balance[userID]
}

func (s *CreditLedgerService) AddCredits(userID uuid.UUID, amountUSD float64, reason string, paymentIntentID *string) (*models.ManagedCreditLedger, error) {
	if amountUSD <= 0 {
		return nil, errors.New("credit amount must be positive")
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	current := s.balance[userID]
	newBalance := current + amountUSD
	s.balance[userID] = newBalance

	entry := models.ManagedCreditLedger{
		ID:                    uuid.New(),
		UserID:                userID,
		DeltaUSD:              amountUSD,
		BalanceAfterUSD:       newBalance,
		Reason:                reason,
		StripePaymentIntentID: paymentIntentID,
		CreatedAt:             time.Now().UTC(),
	}

	if s.repo != nil {
		_ = s.repo.RecordLedgerEntry(context.Background(), &entry)
	}

	s.ledger[userID] = append(s.ledger[userID], entry)
	return &entry, nil
}

func (s *CreditLedgerService) DeductCredits(userID uuid.UUID, amountUSD float64, reason string) (*models.ManagedCreditLedger, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	current := s.balance[userID]
	if current < amountUSD {
		return nil, ErrInsufficientCredits
	}

	newBalance := current - amountUSD
	s.balance[userID] = newBalance

	entry := models.ManagedCreditLedger{
		ID:              uuid.New(),
		UserID:          userID,
		DeltaUSD:        -amountUSD,
		BalanceAfterUSD: newBalance,
		Reason:          reason,
		CreatedAt:       time.Now().UTC(),
	}

	if s.repo != nil {
		_ = s.repo.RecordLedgerEntry(context.Background(), &entry)
	}

	s.ledger[userID] = append(s.ledger[userID], entry)
	return &entry, nil
}
