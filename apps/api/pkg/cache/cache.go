package cache

import (
	"sync"
	"time"
)

type cacheItem[T any] struct {
	value     T
	expiresAt time.Time
}

type MemoryCache[T any] struct {
	mu      sync.RWMutex
	items   map[string]cacheItem[T]
	ttl     time.Duration
	maxSize int
}

func NewMemoryCache[T any](ttl time.Duration, maxSize int) *MemoryCache[T] {
	if ttl <= 0 {
		ttl = 1 * time.Minute
	}
	if maxSize <= 0 {
		maxSize = 10000
	}
	c := &MemoryCache[T]{
		items:   make(map[string]cacheItem[T]),
		ttl:     ttl,
		maxSize: maxSize,
	}
	go c.startJanitor(ttl * 2)
	return c
}

func (c *MemoryCache[T]) Get(key string) (T, bool) {
	c.mu.RLock()
	item, found := c.items[key]
	c.mu.RUnlock()

	if !found {
		var zero T
		return zero, false
	}

	if time.Now().After(item.expiresAt) {
		c.Delete(key)
		var zero T
		return zero, false
	}

	return item.value, true
}

func (c *MemoryCache[T]) Set(key string, value T) {
	c.mu.Lock()
	defer c.mu.Unlock()

	if len(c.items) >= c.maxSize {
		// Evict an arbitrary expired item or the first entry
		for k, v := range c.items {
			if time.Now().After(v.expiresAt) {
				delete(c.items, k)
				break
			}
		}
	}

	c.items[key] = cacheItem[T]{
		value:     value,
		expiresAt: time.Now().Add(c.ttl),
	}
}

func (c *MemoryCache[T]) Delete(key string) {
	c.mu.Lock()
	delete(c.items, key)
	c.mu.Unlock()
}

func (c *MemoryCache[T]) InvalidatePrefix(prefix string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	for k := range c.items {
		if len(k) >= len(prefix) && k[:len(prefix)] == prefix {
			delete(c.items, k)
		}
	}
}

func (c *MemoryCache[T]) startJanitor(interval time.Duration) {
	ticker := time.NewTicker(interval)
	for range ticker.C {
		c.mu.Lock()
		now := time.Now()
		for k, v := range c.items {
			if now.After(v.expiresAt) {
				delete(c.items, k)
			}
		}
		c.mu.Unlock()
	}
}
