package auth

import (
	"sync"
	"testing"
	"time"

	"github.com/google/uuid"
)

func TestRefreshTokenFamilyAdversarial(t *testing.T) {
	mgr := NewRefreshTokenManager(1 * time.Hour)
	userID := uuid.New()

	t.Run("Multi-hop rotation and replay of earliest token revokes entire family", func(t *testing.T) {
		// T1 -> T2 -> T3
		raw1, t1, err := mgr.CreateInitialToken(userID)
		if err != nil {
			t.Fatalf("CreateInitialToken failed: %v", err)
		}

		raw2, t2, err := mgr.RotateToken(raw1)
		if err != nil {
			t.Fatalf("Rotate T1 -> T2 failed: %v", err)
		}
		if t2.FamilyID != t1.FamilyID {
			t.Fatalf("Family ID mismatch: got %v, expected %v", t2.FamilyID, t1.FamilyID)
		}

		raw3, t3, err := mgr.RotateToken(raw2)
		if err != nil {
			t.Fatalf("Rotate T2 -> T3 failed: %v", err)
		}
		if t3.FamilyID != t1.FamilyID {
			t.Fatalf("Family ID mismatch: got %v, expected %v", t3.FamilyID, t1.FamilyID)
		}

		// Replay T1 (stolen token attack)
		_, _, err = mgr.RotateToken(raw1)
		if err != ErrRefreshTokenReused {
			t.Fatalf("expected ErrRefreshTokenReused when replaying T1, got %v", err)
		}

		// Verify that the newest valid token T3 is now ALSO revoked
		_, _, err = mgr.RotateToken(raw3)
		if err != ErrRefreshTokenReused {
			t.Fatalf("expected ErrRefreshTokenReused when rotating T3 after breach, got %v", err)
		}
	})

	t.Run("Replay intermediate token revokes family", func(t *testing.T) {
		rawA, _, _ := mgr.CreateInitialToken(userID)
		rawB, _, _ := mgr.RotateToken(rawA)
		rawC, _, _ := mgr.RotateToken(rawB)

		// Replay intermediate rawB
		_, _, err := mgr.RotateToken(rawB)
		if err != ErrRefreshTokenReused {
			t.Fatalf("expected ErrRefreshTokenReused on replaying intermediate token, got %v", err)
		}

		// rawC is now dead
		_, _, err = mgr.RotateToken(rawC)
		if err != ErrRefreshTokenReused {
			t.Fatalf("expected ErrRefreshTokenReused on latest token, got %v", err)
		}
	})

	t.Run("Non-existent token returns ErrRefreshTokenNotFound", func(t *testing.T) {
		fakeToken := "0000000000000000000000000000000000000000000000000000000000000000"
		_, _, err := mgr.RotateToken(fakeToken)
		if err != ErrRefreshTokenNotFound {
			t.Fatalf("expected ErrRefreshTokenNotFound, got %v", err)
		}
	})

	t.Run("Expired token returns ErrRefreshTokenExpired without revoking fresh family", func(t *testing.T) {
		shortMgr := NewRefreshTokenManager(50 * time.Millisecond)
		rawExp, _, _ := shortMgr.CreateInitialToken(userID)
		time.Sleep(70 * time.Millisecond)

		_, _, err := shortMgr.RotateToken(rawExp)
		if err != ErrRefreshTokenExpired {
			t.Fatalf("expected ErrRefreshTokenExpired, got %v", err)
		}
	})

	t.Run("Independent token families remain isolated", func(t *testing.T) {
		rawFam1, tFam1, _ := mgr.CreateInitialToken(userID)
		rawFam2, tFam2, _ := mgr.CreateInitialToken(userID)

		if tFam1.FamilyID == tFam2.FamilyID {
			t.Fatalf("two sessions for same user should have distinct family IDs")
		}

		// Rotate Fam1
		_, _, _ = mgr.RotateToken(rawFam1)
		// Replay rawFam1 -> revokes Fam1
		_, _, _ = mgr.RotateToken(rawFam1)

		// Fam2 should still be completely valid and rotatable!
		rawFam2Next, _, err := mgr.RotateToken(rawFam2)
		if err != nil {
			t.Fatalf("Fam2 should NOT be affected by Fam1 revocation, got error: %v", err)
		}
		if rawFam2Next == "" {
			t.Fatalf("expected valid token from Fam2 rotation")
		}
	})

	t.Run("Concurrent replay race condition stress", func(t *testing.T) {
		rawInit, _, _ := mgr.CreateInitialToken(userID)
		rawValid, _, _ := mgr.RotateToken(rawInit)

		var wg sync.WaitGroup
		errs := make([]error, 20)
		for i := 0; i < 20; i++ {
			wg.Add(1)
			go func(idx int) {
				defer wg.Done()
				_, _, err := mgr.RotateToken(rawInit) // all attempt to replay rawInit concurrently
				errs[idx] = err
			}(i)
		}
		wg.Wait()

		// All concurrent attempts must get ErrRefreshTokenReused
		for i, err := range errs {
			if err != ErrRefreshTokenReused {
				t.Fatalf("goroutine %d: expected ErrRefreshTokenReused, got %v", i, err)
			}
		}

		// And rawValid must be revoked
		_, _, err := mgr.RotateToken(rawValid)
		if err != ErrRefreshTokenReused {
			t.Fatalf("expected ErrRefreshTokenReused for rawValid after race, got %v", err)
		}
	})
}
