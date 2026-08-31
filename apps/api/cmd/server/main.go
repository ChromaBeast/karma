package main

import (
	"bufio"
	"context"
	"crypto/rand"
	"io"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"karma/apps/api/pkg/auth"
	"karma/apps/api/pkg/career"
	"karma/apps/api/pkg/db"
	"karma/apps/api/pkg/llm"
	"karma/apps/api/pkg/mockup"
	"karma/apps/api/pkg/portfolio"
	"karma/apps/api/pkg/repository"
	"karma/apps/api/pkg/resume"
	"karma/apps/api/pkg/tools"
	"karma/apps/api/pkg/vault"
)

func loadEnvFile(paths ...string) {
	for _, path := range paths {
		f, err := os.Open(path)
		if err != nil {
			continue
		}
		defer f.Close()
		scanner := bufio.NewScanner(f)
		for scanner.Scan() {
			line := strings.TrimSpace(scanner.Text())
			if line == "" || strings.HasPrefix(line, "#") {
				continue
			}
			parts := strings.SplitN(line, "=", 2)
			if len(parts) == 2 {
				k := strings.TrimSpace(parts[0])
				v := strings.Trim(strings.TrimSpace(parts[1]), "\"'")
				if os.Getenv(k) == "" {
					os.Setenv(k, v)
				}
			}
		}
	}
}

func BuildDependencies() ServerDependencies {
	loadEnvFile(".env", "../.env")

	kmsMaster := make([]byte, 32)
	io.ReadFull(rand.Reader, kmsMaster)
	kms, err := vault.NewKMSMasterKey(kmsMaster)
	if err != nil {
		log.Fatalf("failed to initialize KMS key: %v", err)
	}

	var careerRepo *repository.CareerRepository
	var vaultRepo *repository.VaultRepository

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL != "" {
		ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
		defer cancel()
		database, err := db.Connect(ctx, dbURL)
		if err != nil {
			log.Printf("⚠️ PostgreSQL connection failed: %v (falling back to memory)", err)
		} else {
			if err := db.RunMigrations(ctx, database.Pool); err != nil {
				log.Printf("⚠️ Auto-migration error: %v", err)
			}
			careerRepo = repository.NewCareerRepository(database.Pool)
			vaultRepo = repository.NewVaultRepository(database.Pool)
		}
	} else {
		log.Println("ℹ️ DATABASE_URL not set — running with in-memory persistence")
	}

	jwtSvc := auth.NewJWTService("karma-production-secret-key-32b-secure")
	refMgr := auth.NewRefreshTokenManager(30 * 24 * time.Hour)
	authH := auth.NewAuthHandler(jwtSvc, refMgr)

	vaultSvc := vault.NewVaultService(kms, vaultRepo)
	vaultH := vault.NewVaultHandler(vaultSvc)

	careerSvc := career.NewCareerService(careerRepo)
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
