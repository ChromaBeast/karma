package cache

import (
	"testing"
	"time"
)

func TestMemoryCache(t *testing.T) {
	c := NewMemoryCache[string](50*time.Millisecond, 100)

	c.Set("user:1", "node_data_1")
	val, ok := c.Get("user:1")
	if !ok || val != "node_data_1" {
		t.Fatalf("expected node_data_1, got %v", val)
	}

	time.Sleep(70 * time.Millisecond)
	_, ok = c.Get("user:1")
	if ok {
		t.Fatalf("expected expired key to return false")
	}

	c.Set("user:2:a", "val_a")
	c.Set("user:2:b", "val_b")
	c.InvalidatePrefix("user:2")
	if _, ok := c.Get("user:2:a"); ok {
		t.Fatalf("expected prefix invalidation")
	}
}
