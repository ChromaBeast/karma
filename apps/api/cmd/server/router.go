package main

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"karma/apps/api/pkg/auth"
	"karma/apps/api/pkg/career"
	"karma/apps/api/pkg/llm"
	"karma/apps/api/pkg/mockup"
	"karma/apps/api/pkg/portfolio"
	"karma/apps/api/pkg/resume"
	"karma/apps/api/pkg/tools"
	"karma/apps/api/pkg/vault"
)

type ServerDependencies struct {
	JWTService    *auth.JWTService
	AuthHandler   *auth.AuthHandler
	VaultHandler  *vault.VaultHandler
	CareerHandler *career.CareerHandler
	ResumeHandler *resume.ResumeHandler
	LLMHandler    *llm.LLMHandler
	PortHandler   *portfolio.PortfolioHandler
	MockupHandler *mockup.MockupHandler
	ToolsHandler  *tools.ToolsHandler
	RateLimiter   *RateLimiter
}

func SetupRouter(deps ServerDependencies) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.CleanPath)
	r.Use(middleware.Compress(5))
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"https://*", "http://*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	if deps.RateLimiter != nil {
		r.Use(deps.RateLimiter.Middleware())
	}

	r.Get("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "ok",
			"service": "karma-api-gateway",
			"version": "1.0.0",
		})
	})

	r.Route("/v1", func(v1 chi.Router) {
		// Public auth endpoints
		v1.Route("/auth", func(a chi.Router) {
			a.Post("/login", deps.AuthHandler.EmailLogin)
			a.Post("/logout", deps.AuthHandler.Logout)
			a.Get("/linkedin/start", deps.AuthHandler.LinkedInStart)
			a.Post("/linkedin/callback", deps.AuthHandler.LinkedInCallback)
			a.Post("/refresh", deps.AuthHandler.Refresh)

			a.Group(func(authGroup chi.Router) {
				authGroup.Use(auth.AuthMiddleware(deps.JWTService))
				authGroup.Get("/me", deps.AuthHandler.Me)
			})
		})

		// Protected endpoints
		v1.Group(func(p chi.Router) {
			p.Use(auth.AuthMiddleware(deps.JWTService))

			// BYOK Vault
			p.Route("/vault", func(vr chi.Router) {
				vr.Get("/keys", deps.VaultHandler.ListKeys)
				vr.Post("/keys", deps.VaultHandler.StoreKey)
				vr.Delete("/keys/{provider}", deps.VaultHandler.DeleteKey)
			})

			// Career Graph
			p.Post("/career-events", deps.CareerHandler.IngestEvent)
			p.Get("/career-events/{id}", deps.CareerHandler.GetEventStatus)
			p.Get("/career-nodes", deps.CareerHandler.ListNodes)
			p.Post("/career-nodes", deps.CareerHandler.CreateNode)
			p.Get("/career-nodes/{id}", deps.CareerHandler.GetNode)
			p.Delete("/career-nodes/{id}", deps.CareerHandler.DeleteNode)

			// ATS Resume Engine
			p.Route("/resumes", func(rr chi.Router) {
				rr.Post("/ingest-jd", deps.ResumeHandler.IngestJD)
				rr.Post("/generate", deps.ResumeHandler.GenerateResume)
				rr.Get("/", deps.ResumeHandler.ListResumes)
				rr.Get("/{id}", deps.ResumeHandler.GetResume)
			})

			// LLM Router & Credits
			p.Route("/llm", func(lr chi.Router) {
				lr.Post("/execute", deps.LLMHandler.Execute)
				lr.Get("/credits", deps.LLMHandler.GetCredits)
				lr.Post("/credits/purchase", deps.LLMHandler.PurchaseCredits)
			})

			// Portfolio
			p.Route("/portfolios", func(pr chi.Router) {
				pr.Get("/me", deps.PortHandler.GetMine)
				pr.Post("/", deps.PortHandler.Upsert)
				pr.Put("/publish", deps.PortHandler.Publish)
				pr.Post("/projects", deps.PortHandler.SetProjects)
			})

			// Mockups
			p.Route("/mockups", func(mr chi.Router) {
				mr.Post("/generate", deps.MockupHandler.Generate)
				mr.Get("/", deps.MockupHandler.List)
			})

			// Career Acceleration Tools
			p.Route("/tools", func(tr chi.Router) {
				tr.Post("/linkedin/headline", deps.ToolsHandler.GenerateHeadline)
				tr.Post("/linkedin/post", deps.ToolsHandler.GeneratePost)
				tr.Post("/interview/start", deps.ToolsHandler.StartInterview)
				tr.Post("/interview/answer", deps.ToolsHandler.SubmitInterviewAnswer)
				tr.Post("/cover-letter", deps.ToolsHandler.GenerateCoverLetter)
				tr.Post("/outreach", deps.ToolsHandler.GenerateOutreach)
				tr.Post("/skill-gap", deps.ToolsHandler.AnalyzeSkillGap)
			})
		})
	})

	return r
}
