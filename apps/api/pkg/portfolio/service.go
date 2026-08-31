package portfolio

import (
	"context"
	"errors"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
	"karma/apps/api/pkg/repository"
)

var (
	ErrPortfolioNotFound = errors.New("portfolio not found")
	ErrInvalidSubdomain  = errors.New("subdomain must be 3-30 lowercase alphanumeric characters or hyphens")
	subdomainRegex       = regexp.MustCompile(`^[a-z0-9]([a-z0-9\-]{1,28}[a-z0-9])?$`)
)

type PortfolioService struct {
	mu         sync.RWMutex
	repo       *repository.PortfolioRepository
	portfolios map[uuid.UUID]*models.Portfolio
	projects   map[uuid.UUID][]*models.PortfolioProject
}

func NewPortfolioService(repo ...*repository.PortfolioRepository) *PortfolioService {
	svc := &PortfolioService{
		portfolios: make(map[uuid.UUID]*models.Portfolio),
		projects:   make(map[uuid.UUID][]*models.PortfolioProject),
	}
	if len(repo) > 0 && repo[0] != nil {
		svc.repo = repo[0]
	}
	return svc
}

func (s *PortfolioService) UpsertPortfolio(userID uuid.UUID, themeID, subdomain string, config map[string]interface{}) (*models.Portfolio, error) {
	subdomain = strings.ToLower(strings.TrimSpace(subdomain))
	if !subdomainRegex.MatchString(subdomain) {
		return nil, ErrInvalidSubdomain
	}

	s.mu.Lock()
	defer s.mu.Unlock()

	var existing *models.Portfolio
	if s.repo != nil {
		if dbP, err := s.repo.GetByUserID(context.Background(), userID); err == nil && dbP != nil {
			existing = dbP
		}
	}
	if existing == nil {
		for _, p := range s.portfolios {
			if p.UserID == userID {
				existing = p
				break
			}
		}
	}

	now := time.Now().UTC()
	if existing != nil {
		existing.ThemeID = themeID
		existing.Subdomain = subdomain
		existing.Config = config
		if s.repo != nil {
			_ = s.repo.UpsertPortfolio(context.Background(), existing)
		}
		s.portfolios[existing.ID] = existing
		return existing, nil
	}

	portfolio := &models.Portfolio{
		ID:        uuid.New(),
		UserID:    userID,
		ThemeID:   themeID,
		Subdomain: subdomain,
		Config:    config,
		CreatedAt: now,
	}

	s.portfolios[portfolio.ID] = portfolio
	if s.repo != nil {
		_ = s.repo.UpsertPortfolio(context.Background(), portfolio)
	}
	return portfolio, nil
}

func (s *PortfolioService) PublishPortfolio(userID uuid.UUID) (*models.Portfolio, error) {
	if s.repo != nil {
		if p, err := s.repo.Publish(context.Background(), userID); err == nil && p != nil {
			s.mu.Lock()
			s.portfolios[p.ID] = p
			s.mu.Unlock()
			return p, nil
		}
	}

	s.mu.Lock()
	defer s.mu.Unlock()
	for _, p := range s.portfolios {
		if p.UserID == userID {
			now := time.Now().UTC()
			p.PublishedAt = &now
			return p, nil
		}
	}
	return nil, ErrPortfolioNotFound
}

func (s *PortfolioService) GetPortfolio(userID uuid.UUID) (*models.Portfolio, error) {
	if s.repo != nil {
		if p, err := s.repo.GetByUserID(context.Background(), userID); err == nil && p != nil {
			return p, nil
		}
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	for _, p := range s.portfolios {
		if p.UserID == userID {
			return p, nil
		}
	}
	return nil, ErrPortfolioNotFound
}

func (s *PortfolioService) GetBySubdomain(subdomain string) (*models.Portfolio, error) {
	if s.repo != nil {
		if p, err := s.repo.GetBySubdomain(context.Background(), subdomain); err == nil && p != nil {
			return p, nil
		}
	}
	s.mu.RLock()
	defer s.mu.RUnlock()
	subdomain = strings.ToLower(strings.TrimSpace(subdomain))
	for _, p := range s.portfolios {
		if strings.EqualFold(p.Subdomain, subdomain) {
			return p, nil
		}
	}
	return nil, ErrPortfolioNotFound
}

func (s *PortfolioService) SetProjects(portfolioID uuid.UUID, nodeIDs []uuid.UUID) []*models.PortfolioProject {
	if s.repo != nil {
		if list, err := s.repo.SetProjects(context.Background(), portfolioID, nodeIDs); err == nil {
			return list
		}
	}
	s.mu.Lock()
	defer s.mu.Unlock()
	var list []*models.PortfolioProject
	for i, nid := range nodeIDs {
		proj := &models.PortfolioProject{
			ID:           uuid.New(),
			PortfolioID:  portfolioID,
			CareerNodeID: nid,
			DisplayOrder: i,
		}
		list = append(list, proj)
	}
	s.projects[portfolioID] = list
	return list
}
