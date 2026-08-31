package repository

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"karma/apps/api/pkg/models"
)

type CareerRepository struct {
	db *sql.DB
}

func NewCareerRepository(db *sql.DB) *CareerRepository {
	return &CareerRepository{db: db}
}

func (r *CareerRepository) ensureUser(ctx context.Context, userID uuid.UUID) {
	query := `
		INSERT INTO users (id, linkedin_sub, email, name, plan_tier)
		VALUES ($1, $2, $3, $4, 'access_plus_credits')
		ON CONFLICT (id) DO NOTHING`
	_, _ = r.db.ExecContext(ctx, query, userID, "sub-"+userID.String()[:8], "user@karma.app", "Karma Member")
}

func (r *CareerRepository) SaveEvent(ctx context.Context, e *models.CareerNodeEvent) error {
	r.ensureUser(ctx, e.UserID)
	query := `
		INSERT INTO career_node_events (id, user_id, raw_text, capture_channel, created_at)
		VALUES ($1, $2, $3, $4, $5)`
	_, err := r.db.ExecContext(ctx, query, e.ID, e.UserID, e.RawText, string(e.CaptureChannel), e.CreatedAt)
	return err
}

func (r *CareerRepository) UpdateEventProcessed(ctx context.Context, eventID uuid.UUID, nodeID uuid.UUID, processedAt time.Time) error {
	query := `
		UPDATE career_node_events 
		SET processed_at = $1, career_node_id = $2 
		WHERE id = $3`
	_, err := r.db.ExecContext(ctx, query, processedAt, nodeID, eventID)
	return err
}

func (r *CareerRepository) GetEvent(ctx context.Context, eventID uuid.UUID) (*models.CareerNodeEvent, error) {
	query := `SELECT id, user_id, raw_text, capture_channel, processed_at, career_node_id, created_at FROM career_node_events WHERE id = $1`
	row := r.db.QueryRowContext(ctx, query, eventID)
	var e models.CareerNodeEvent
	var channel string
	err := row.Scan(&e.ID, &e.UserID, &e.RawText, &channel, &e.ProcessedAt, &e.CareerNodeID, &e.CreatedAt)
	if err != nil {
		return nil, err
	}
	e.CaptureChannel = models.CaptureChannel(channel)
	return &e, nil
}

func (r *CareerRepository) CreateNode(ctx context.Context, n *models.CareerNode) error {
	r.ensureUser(ctx, n.UserID)
	metricsJSON, err := json.Marshal(n.Metrics)
	if err != nil {
		metricsJSON = []byte("{}")
	}

	query := `
		INSERT INTO career_nodes (
			id, user_id, parent_id, node_type, title, org, start_date, end_date,
			situation_task, action, result, metrics, tags, source, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
		)`

	_, err = r.db.ExecContext(
		ctx, query,
		n.ID, n.UserID, n.ParentID, string(n.NodeType), n.Title, n.Org,
		n.StartDate, n.EndDate, n.SituationTask, n.Action, n.Result,
		metricsJSON, pq.Array(n.Tags), n.Source, n.CreatedAt, n.UpdatedAt,
	)
	return err
}

func (r *CareerRepository) GetNode(ctx context.Context, nodeID uuid.UUID) (*models.CareerNode, error) {
	query := `
		SELECT id, user_id, parent_id, node_type, title, org, start_date, end_date,
		       situation_task, action, result, metrics, tags, source, created_at, updated_at
		FROM career_nodes WHERE id = $1`

	row := r.db.QueryRowContext(ctx, query, nodeID)
	var n models.CareerNode
	var nodeType string
	var metricsBytes []byte
	var tags []string

	err := row.Scan(
		&n.ID, &n.UserID, &n.ParentID, &nodeType, &n.Title, &n.Org,
		&n.StartDate, &n.EndDate, &n.SituationTask, &n.Action, &n.Result,
		&metricsBytes, pq.Array(&tags), &n.Source, &n.CreatedAt, &n.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	n.NodeType = models.NodeType(nodeType)
	n.Tags = tags
	_ = json.Unmarshal(metricsBytes, &n.Metrics)
	return &n, nil
}

func (r *CareerRepository) ListNodes(ctx context.Context, userID uuid.UUID) ([]*models.CareerNode, error) {
	query := `
		SELECT id, user_id, parent_id, node_type, title, org, start_date, end_date,
		       situation_task, action, result, metrics, tags, source, created_at, updated_at
		FROM career_nodes WHERE user_id = $1 ORDER BY created_at DESC`

	rows, err := r.db.QueryContext(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query nodes: %w", err)
	}
	defer rows.Close()

	var nodes []*models.CareerNode
	for rows.Next() {
		var n models.CareerNode
		var nodeType string
		var metricsBytes []byte
		var tags []string

		err := rows.Scan(
			&n.ID, &n.UserID, &n.ParentID, &nodeType, &n.Title, &n.Org,
			&n.StartDate, &n.EndDate, &n.SituationTask, &n.Action, &n.Result,
			&metricsBytes, pq.Array(&tags), &n.Source, &n.CreatedAt, &n.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}

		n.NodeType = models.NodeType(nodeType)
		n.Tags = tags
		_ = json.Unmarshal(metricsBytes, &n.Metrics)
		nodes = append(nodes, &n)
	}
	return nodes, nil
}

func (r *CareerRepository) DeleteNode(ctx context.Context, userID uuid.UUID, nodeID uuid.UUID) error {
	query := `DELETE FROM career_nodes WHERE id = $1 AND user_id = $2`
	res, err := r.db.ExecContext(ctx, query, nodeID, userID)
	if err != nil {
		return err
	}
	rows, err := res.RowsAffected()
	if err != nil || rows == 0 {
		return fmt.Errorf("node not found or unauthorized")
	}
	return nil
}
