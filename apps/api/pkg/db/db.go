package db

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

type Database struct {
	Pool *sql.DB
}

func Connect(ctx context.Context, dsn string) (*Database, error) {
	if dsn == "" {
		return nil, fmt.Errorf("empty database dsn")
	}

	pool, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	pool.SetMaxOpenConns(25)
	pool.SetMaxIdleConns(10)
	pool.SetConnMaxLifetime(15 * time.Minute)
	pool.SetConnMaxIdleTime(5 * time.Minute)

	pingCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	if err := pool.PingContext(pingCtx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("database ping failed: %w", err)
	}

	log.Println("🐘 PostgreSQL connected successfully")
	return &Database{Pool: pool}, nil
}

func (d *Database) Close() error {
	if d.Pool != nil {
		return d.Pool.Close()
	}
	return nil
}

func (d *Database) IsHealthy(ctx context.Context) bool {
	if d.Pool == nil {
		return false
	}
	return d.Pool.PingContext(ctx) == nil
}
