package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

type ResumeRepository struct {
	db *sql.DB
}

func NewResumeRepository(db *sql.DB) *ResumeRepository {
	return &ResumeRepository{db: db}
}

func (r *ResumeRepository) SaveJobDescription(ctx context.Context, jd *models.JobDescription) error {
	if r.db == nil {
		return nil
	}
	reqJSON, _ := json.Marshal(jd.ParsedRequirements)
	query := `
		INSERT INTO job_descriptions (id, user_id, raw_text, company, role_title, parsed_requirements, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (id) DO NOTHING;
	`
	_, err := r.db.ExecContext(ctx, query, jd.ID, jd.UserID, jd.RawText, jd.Company, jd.RoleTitle, reqJSON, jd.CreatedAt)
	return err
}

func (r *ResumeRepository) SaveResume(ctx context.Context, res *models.GeneratedResume) error {
	if r.db == nil {
		return nil
	}
	genJSON, _ := json.Marshal(res.GenerationParams)
	tx, err := r.db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}
	defer tx.Rollback()

	query := `
		INSERT INTO generated_resumes (id, user_id, job_description_id, template_id, ats_score, generation_params, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		ON CONFLICT (id) DO NOTHING;
	`
	_, err = tx.ExecContext(ctx, query, res.ID, res.UserID, res.JobDescriptionID, res.TemplateID, res.ATSScore, genJSON, res.CreatedAt)
	if err != nil {
		return err
	}

	for _, b := range res.BulletSelections {
		_, _ = tx.ExecContext(ctx, `
			INSERT INTO resume_bullet_selections (resume_id, career_node_id, rank_score, final_text)
			VALUES ($1, $2, $3, $4)
			ON CONFLICT (resume_id, career_node_id) DO UPDATE SET rank_score = EXCLUDED.rank_score, final_text = EXCLUDED.final_text;
		`, res.ID, b.CareerNodeID, b.RankScore, b.FinalText)
	}

	return tx.Commit()
}

func (r *ResumeRepository) ListResumes(ctx context.Context, userID uuid.UUID) ([]*models.GeneratedResume, error) {
	if r.db == nil {
		return nil, errors.New("db not connected")
	}
	query := `
		SELECT id, user_id, job_description_id, template_id, ats_score, generation_params, created_at
		FROM generated_resumes WHERE user_id = $1 ORDER BY created_at DESC;
	`
	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []*models.GeneratedResume
	for rows.Next() {
		var res models.GeneratedResume
		var genJSON []byte
		if err := rows.Scan(&res.ID, &res.UserID, &res.JobDescriptionID, &res.TemplateID, &res.ATSScore, &genJSON, &res.CreatedAt); err == nil {
			if len(genJSON) > 0 {
				_ = json.Unmarshal(genJSON, &res.GenerationParams)
			}
			list = append(list, &res)
		}
	}
	return list, nil
}

func (r *ResumeRepository) GetResume(ctx context.Context, resumeID uuid.UUID) (*models.GeneratedResume, error) {
	if r.db == nil {
		return nil, errors.New("db not connected")
	}
	query := `
		SELECT id, user_id, job_description_id, template_id, ats_score, generation_params, created_at
		FROM generated_resumes WHERE id = $1 LIMIT 1;
	`
	var res models.GeneratedResume
	var genJSON []byte
	err := r.db.QueryRowContext(ctx, query, resumeID).Scan(&res.ID, &res.UserID, &res.JobDescriptionID, &res.TemplateID, &res.ATSScore, &genJSON, &res.CreatedAt)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, nil
		}
		return nil, err
	}
	if len(genJSON) > 0 {
		_ = json.Unmarshal(genJSON, &res.GenerationParams)
	}

	bRows, err := r.db.QueryContext(ctx, `SELECT career_node_id, rank_score, final_text FROM resume_bullet_selections WHERE resume_id = $1`, resumeID)
	if err == nil {
		defer bRows.Close()
		for bRows.Next() {
			var b models.ResumeBulletSelection
			b.ResumeID = resumeID
			if err := bRows.Scan(&b.CareerNodeID, &b.RankScore, &b.FinalText); err == nil {
				res.BulletSelections = append(res.BulletSelections, b)
			}
		}
	}

	return &res, nil
}
