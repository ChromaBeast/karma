package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type ResumeRepository struct {
	db *sql.DB
}

func NewResumeRepository(db *sql.DB) *ResumeRepository {
	return &ResumeRepository{db: db}
}

func (r *ResumeRepository) SaveJD(ctx context.Context, jd *models.JobDescription) error {
	reqJSON, err := json.Marshal(jd.ParsedRequirements)
	if err != nil {
		reqJSON = []byte("{}")
	}

	query := `
		INSERT INTO job_descriptions (id, user_id, raw_text, company, role_title, parsed_requirements, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)`

	if jd.ID == uuid.Nil {
		jd.ID = uuid.New()
	}
	if jd.CreatedAt.IsZero() {
		jd.CreatedAt = time.Now().UTC()
	}

	_, err = r.db.ExecContext(ctx, query, jd.ID, jd.UserID, jd.RawText, jd.Company, jd.RoleTitle, reqJSON, jd.CreatedAt)
	return err
}

func (r *ResumeRepository) GetJD(ctx context.Context, jdID uuid.UUID) (*models.JobDescription, error) {
	query := `
		SELECT id, user_id, raw_text, company, role_title, parsed_requirements, created_at
		FROM job_descriptions WHERE id = $1`

	row := r.db.QueryRowContext(ctx, query, jdID)
	var jd models.JobDescription
	var reqBytes []byte

	err := row.Scan(&jd.ID, &jd.UserID, &jd.RawText, &jd.Company, &jd.RoleTitle, &reqBytes, &jd.CreatedAt)
	if err != nil {
		return nil, err
	}
	_ = json.Unmarshal(reqBytes, &jd.ParsedRequirements)
	return &jd, nil
}

func (r *ResumeRepository) SaveResume(ctx context.Context, res *models.GeneratedResume) error {
	paramsJSON, err := json.Marshal(res.GenerationParams)
	if err != nil {
		paramsJSON = []byte("{}")
	}

	query := `
		INSERT INTO generated_resumes (
			id, user_id, job_description_id, template_id, pdf_url, ats_score,
			generation_params, llm_execution_id, created_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`

	if res.ID == uuid.Nil {
		res.ID = uuid.New()
	}
	if res.CreatedAt.IsZero() {
		res.CreatedAt = time.Now().UTC()
	}

	_, err = r.db.ExecContext(
		ctx, query,
		res.ID, res.UserID, res.JobDescriptionID, res.TemplateID, res.PDFURL,
		res.ATSScore, paramsJSON, res.LLMExecutionID, res.CreatedAt,
	)
	return err
}

func (r *ResumeRepository) GetResume(ctx context.Context, resumeID uuid.UUID) (*models.GeneratedResume, error) {
	query := `
		SELECT id, user_id, job_description_id, template_id, pdf_url, ats_score,
		       generation_params, llm_execution_id, created_at
		FROM generated_resumes WHERE id = $1`

	row := r.db.QueryRowContext(ctx, query, resumeID)
	var res models.GeneratedResume
	var paramsBytes []byte

	err := row.Scan(
		&res.ID, &res.UserID, &res.JobDescriptionID, &res.TemplateID, &res.PDFURL,
		&res.ATSScore, &paramsBytes, &res.LLMExecutionID, &res.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	_ = json.Unmarshal(paramsBytes, &res.GenerationParams)
	return &res, nil
}

func (r *ResumeRepository) ListResumes(ctx context.Context, userID uuid.UUID) ([]*models.GeneratedResume, error) {
	query := `
		SELECT id, user_id, job_description_id, template_id, pdf_url, ats_score,
		       generation_params, llm_execution_id, created_at
		FROM generated_resumes WHERE user_id = $1 ORDER BY created_at DESC`

	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to list resumes: %w", err)
	}
	defer rows.Close()

	var list []*models.GeneratedResume
	for rows.Next() {
		var res models.GeneratedResume
		var paramsBytes []byte
		err := rows.Scan(
			&res.ID, &res.UserID, &res.JobDescriptionID, &res.TemplateID, &res.PDFURL,
			&res.ATSScore, &paramsBytes, &res.LLMExecutionID, &res.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		_ = json.Unmarshal(paramsBytes, &res.GenerationParams)
		list = append(list, &res)
	}
	return list, nil
}
