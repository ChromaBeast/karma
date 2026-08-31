package models

import (
	"time"

	"github.com/google/uuid"
)

type ParsedRequirements struct {
	RequiredSkills   []string `json:"required_skills"`
	PreferredSkills  []string `json:"preferred_skills"`
	SenioritySignals []string `json:"seniority_signals"`
	ATSKeywords      []string `json:"ats_keywords"`
	FormattingNotes  string   `json:"formatting_notes,omitempty"`
}

type JobDescription struct {
	ID                 uuid.UUID          `json:"id"`
	UserID             uuid.UUID          `json:"user_id"`
	RawText            string             `json:"raw_text"`
	Company            *string            `json:"company,omitempty"`
	RoleTitle          *string            `json:"role_title,omitempty"`
	ParsedRequirements ParsedRequirements `json:"parsed_requirements"`
	Embedding          []float32          `json:"embedding,omitempty"`
	CreatedAt          time.Time          `json:"created_at"`
}

type ResumeBulletSelection struct {
	ResumeID     uuid.UUID `json:"resume_id"`
	CareerNodeID uuid.UUID `json:"career_node_id"`
	RankScore    float64   `json:"rank_score"`
	FinalText    string    `json:"final_text"`
	Section      string    `json:"section"`
	CharCount    int       `json:"char_count"`
}

type GeneratedResume struct {
	ID                uuid.UUID               `json:"id"`
	UserID            uuid.UUID               `json:"user_id"`
	JobDescriptionID  *uuid.UUID              `json:"job_description_id,omitempty"`
	TemplateID        string                  `json:"template_id"`
	PDFURL            *string                 `json:"pdf_url,omitempty"`
	ATSScore          float64                 `json:"ats_score"`
	GenerationParams  map[string]interface{}  `json:"generation_params"`
	LLMExecutionID    *uuid.UUID              `json:"llm_execution_id,omitempty"`
	BulletSelections  []ResumeBulletSelection `json:"bullet_selections,omitempty"`
	PlainTextFallback string                  `json:"plain_text_fallback,omitempty"`
	CreatedAt         time.Time               `json:"created_at"`
}
