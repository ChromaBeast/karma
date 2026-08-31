package llm

import (
	"errors"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

var (
	ErrInsufficientCredits = errors.New("insufficient managed credits; please purchase credits or switch to BYOK")
)

type CreditLedgerService struct {
	mu      sync.RWMutex
	ledger  map[uuid.UUID][]models.ManagedCreditLedger
	balance map[uuid.UUID]float64
}

func NewCreditLedgerService() *CreditLedgerService {
	return &CreditLedgerService{
		ledger:  make(map[uuid.UUID][]models.ManagedCreditLedger),
		balance: make(map[uuid.UUID]float64),
	}
}

func (s *CreditLedgerService) GetBalance(userID uuid.UUID) float64 {
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

	s.ledger[userID] = append(s.ledger[userID], entry)
	return &entry, nil
}
