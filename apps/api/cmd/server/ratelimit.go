package main

import (
	"net/http"
	"sync"
	"time"
)

type clientRate struct {
	count    int
	lastSeen time.Time
}

type RateLimiter struct {
	mu      sync.Mutex
	clients map[string]*clientRate
	rate    int           // max requests
	window  time.Duration // per window
}

func NewRateLimiter(rate int, window time.Duration) *RateLimiter {
	rl := &RateLimiter{
		clients: make(map[string]*clientRate),
		rate:    rate,
		window:  window,
	}

	go rl.cleanupRoutine()
	return rl
}

func (rl *RateLimiter) cleanupRoutine() {
	ticker := time.NewTicker(rl.window * 2)
	for range ticker.C {
		rl.mu.Lock()
		now := time.Now()
		for ip, client := range rl.clients {
			if now.Sub(client.lastSeen) > rl.window {
				delete(rl.clients, ip)
			}
		}
		rl.mu.Unlock()
	}
}

func (rl *RateLimiter) Middleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := r.RemoteAddr

			rl.mu.Lock()
			client, exists := rl.clients[ip]
			now := time.Now()

			if !exists || now.Sub(client.lastSeen) > rl.window {
				rl.clients[ip] = &clientRate{count: 1, lastSeen: now}
				rl.mu.Unlock()
				next.ServeHTTP(w, r)
				return
			}

			if client.count >= rl.rate {
				rl.mu.Unlock()
				w.Header().Set("Retry-After", "60")
				http.Error(w, `{"error":"rate limit exceeded"}`, http.StatusTooManyRequests)
				return
			}

			client.count++
			client.lastSeen = now
			rl.mu.Unlock()

			next.ServeHTTP(w, r)
		})
	}
}
