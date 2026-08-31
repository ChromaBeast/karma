package repository

import (
	"context"
	"database/sql"
	"encoding/json"

	"karma/apps/api/pkg/models"
)

type ToolsRepository struct {
	db *sql.DB
}

func NewToolsRepository(db *sql.DB) *ToolsRepository {
	return &ToolsRepository{db: db}
}

func (r *ToolsRepository) SaveCoverLetter(ctx context.Context, cl *models.CoverLetter) error {
	if r.db == nil {
		return nil
	}
	query := `
		INSERT INTO cover_letters (id, user_id, job_description_id, generated_text, pdf_url, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (id) DO NOTHING;
	`
	_, err := r.db.ExecContext(ctx, query, cl.ID, cl.UserID, cl.JobDescriptionID, cl.GeneratedText, cl.PDFURL, cl.CreatedAt)
	return err
}

func (r *ToolsRepository) SaveInterviewSession(ctx context.Context, s *models.InterviewSession) error {
	if r.db == nil {
		return nil
	}
	tJSON, _ := json.Marshal(s.Transcript)
	fJSON, _ := json.Marshal(s.Feedback)
	query := `
		INSERT INTO interview_sessions (id, user_id, domain, role_title, transcript, feedback, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (id) DO UPDATE SET transcript = EXCLUDED.transcript, feedback = EXCLUDED.feedback;
	`
	_, err := r.db.ExecContext(ctx, query, s.ID, s.UserID, s.Domain, s.RoleTitle, tJSON, fJSON, s.CreatedAt)
	return err
}

func (r *ToolsRepository) SaveLinkedInAsset(ctx context.Context, a *models.LinkedInAsset) error {
	if r.db == nil {
		return nil
	}
	ctxJSON, _ := json.Marshal(a.InputContext)
	query := `
		INSERT INTO linkedin_assets (id, user_id, asset_type, input_context, generated_text, status, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (id) DO NOTHING;
	`
	_, err := r.db.ExecContext(ctx, query, a.ID, a.UserID, string(a.AssetType), ctxJSON, a.GeneratedText, string(a.Status), a.CreatedAt)
	return err
}

func (r *ToolsRepository) SaveOutreachScript(ctx context.Context, s *models.OutreachScript) error {
	if r.db == nil {
		return nil
	}
	ctxJSON, _ := json.Marshal(s.TargetContext)
	query := `
		INSERT INTO outreach_scripts (id, user_id, channel, target_context, generated_text, created_at)
		VALUES ($1, $2, $3, $4, $5, $6)
		ON CONFLICT (id) DO NOTHING;
	`
	_, err := r.db.ExecContext(ctx, query, s.ID, s.UserID, s.Channel, ctxJSON, s.GeneratedText, s.CreatedAt)
	return err
}

func (r *ToolsRepository) SaveSkillGap(ctx context.Context, a *models.SkillGapAnalysis) error {
	if r.db == nil {
		return nil
	}
	repJSON, _ := json.Marshal(a.GapReport)
	query := `
		INSERT INTO skill_gap_analyses (id, user_id, job_description_id, gap_report, created_at)
		VALUES ($1, $2, $3, $4, $5)
		ON CONFLICT (id) DO NOTHING;
	`
	_, err := r.db.ExecContext(ctx, query, a.ID, a.UserID, a.JobDescriptionID, repJSON, a.CreatedAt)
	return err
}
