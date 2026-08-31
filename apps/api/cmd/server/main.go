package main

import (
	"context"
	"crypto/rand"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"karma/apps/api/pkg/auth"
	"karma/apps/api/pkg/career"
	"karma/apps/api/pkg/llm"
	"karma/apps/api/pkg/mockup"
	"karma/apps/api/pkg/portfolio"
	"karma/apps/api/pkg/resume"
	"karma/apps/api/pkg/tools"
	"karma/apps/api/pkg/vault"
)

func BuildDependencies() ServerDependencies {
	kmsMaster := make([]byte, 32)
	io.ReadFull(rand.Reader, kmsMaster)
	kms, err := vault.NewKMSMasterKey(kmsMaster)
	if err != nil {
		log.Fatalf("failed to initialize KMS key: %v", err)
	}

	jwtSvc := auth.NewJWTService("karma-production-secret-key-32b-secure")
	refMgr := auth.NewRefreshTokenManager(30 * 24 * time.Hour)
	authH := auth.NewAuthHandler(jwtSvc, refMgr)

	vaultSvc := vault.NewVaultService(kms)
	vaultH := vault.NewVaultHandler(vaultSvc)

	careerSvc := career.NewCareerService()
	careerH := career.NewCareerHandler(careerSvc)

	resumeSvc := resume.NewResumeService()
	resumeH := resume.NewResumeHandler(resumeSvc, careerSvc)

	creditLedger := llm.NewCreditLedgerService()
	promptCache := llm.NewPromptCacheService()
	llmRouter := llm.NewLLMRouter(vaultSvc, creditLedger, promptCache)
	llmH := llm.NewLLMHandler(llmRouter, creditLedger)

	portSvc := portfolio.NewPortfolioService()
	portH := portfolio.NewPortfolioHandler(portSvc)

	mockupSvc := mockup.NewMockupService()
	mockupH := mockup.NewMockupHandler(mockupSvc)

	liSvc := tools.NewLinkedInService()
	intSvc := tools.NewInterviewService()
	clSvc := tools.NewCoverLetterService()
	outSvc := tools.NewOutreachService()
	sgSvc := tools.NewSkillGapService()
	toolsH := tools.NewToolsHandler(liSvc, intSvc, clSvc, outSvc, sgSvc, careerSvc, resumeSvc)

	rateLimiter := NewRateLimiter(100, 1*time.Minute)

	return ServerDependencies{
		JWTService:    jwtSvc,
		AuthHandler:   authH,
		VaultHandler:  vaultH,
		CareerHandler: careerH,
		ResumeHandler: resumeH,
		LLMHandler:    llmH,
		PortHandler:   portH,
		MockupHandler: mockupH,
		ToolsHandler:  toolsH,
		RateLimiter:   rateLimiter,
	}
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	deps := BuildDependencies()
	router := SetupRouter(deps)

	server := &http.Server{
		Addr:         ":" + port,
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("🚀 Karma API Gateway running on port %s", port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server listen error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server gracefully...")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}
	log.Println("Server exited cleanly.")
}
