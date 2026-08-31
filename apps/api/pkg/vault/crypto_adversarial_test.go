package vault

import (
	"bytes"
	"crypto/rand"
	"testing"

	"github.com/google/uuid"
	"karma/apps/api/pkg/models"
)

func TestEnvelopeEncryptionAdversarial(t *testing.T) {
	masterKeyBytes, err := GenerateAES256Key()
	if err != nil {
		t.Fatalf("GenerateAES256Key failed: %v", err)
	}

	kmsKey, err := NewKMSMasterKey(masterKeyBytes)
	if err != nil {
		t.Fatalf("NewKMSMasterKey failed: %v", err)
	}

	t.Run("Invalid master key lengths rejected", func(t *testing.T) {
		for _, sz := range []int{0, 15, 16, 24, 31, 33, 64} {
			badKey := make([]byte, sz)
			_, err := NewKMSMasterKey(badKey)
			if err != ErrInvalidKeySize {
				t.Fatalf("expected ErrInvalidKeySize for len %d, got %v", sz, err)
			}
		}
	})

	t.Run("Tampered ciphertext fails GCM authentication tag check", func(t *testing.T) {
		dataKey, _ := GenerateAES256Key()
		plaintext := []byte("sk-ant-api03-very-secret-token-key-123456789")
		ciphertext, iv, err := EncryptAESGCM(plaintext, dataKey)
		if err != nil {
			t.Fatalf("EncryptAESGCM failed: %v", err)
		}

		// Tamper with ciphertext
		tamperedCiphertext := make([]byte, len(ciphertext))
		copy(tamperedCiphertext, ciphertext)
		tamperedCiphertext[0] ^= 0xFF

		_, err = DecryptAESGCM(tamperedCiphertext, iv, dataKey)
		if err != ErrDecryptionFailed {
			t.Fatalf("expected ErrDecryptionFailed for tampered ciphertext, got %v", err)
		}
	})

	t.Run("Tampered IV fails GCM decryption", func(t *testing.T) {
		dataKey, _ := GenerateAES256Key()
		plaintext := []byte("sk-proj-openai-secret-key-abcdefgh")
		ciphertext, iv, _ := EncryptAESGCM(plaintext, dataKey)

		tamperedIV := make([]byte, len(iv))
		copy(tamperedIV, iv)
		tamperedIV[len(tamperedIV)-1] ^= 0xFF

		_, err := DecryptAESGCM(ciphertext, tamperedIV, dataKey)
		if err != ErrDecryptionFailed {
			t.Fatalf("expected ErrDecryptionFailed for tampered IV, got %v", err)
		}
	})

	t.Run("Unwrapping data key with wrong KMS master key fails", func(t *testing.T) {
		dataKey, _ := GenerateAES256Key()
		wrappedKey, iv, err := kmsKey.WrapDataKey(dataKey)
		if err != nil {
			t.Fatalf("WrapDataKey failed: %v", err)
		}

		wrongMasterBytes, _ := GenerateAES256Key()
		wrongKMS, _ := NewKMSMasterKey(wrongMasterBytes)

		_, err = wrongKMS.UnwrapDataKey(wrappedKey, iv)
		if err != ErrDecryptionFailed {
			t.Fatalf("expected ErrDecryptionFailed on wrong master key unwrap, got %v", err)
		}
	})

	t.Run("VaultService lifecycle and rejection of invalid input", func(t *testing.T) {
		service := NewVaultService(kmsKey)
		userID := uuid.New()

		// Empty key rejection
		_, err := service.StoreKey(userID, models.ProviderAnthropic, "")
		if err != ErrEmptyKey {
			t.Fatalf("expected ErrEmptyKey, got %v", err)
		}

		// Unsupported provider rejection
		_, err = service.StoreKey(userID, "unsupported_provider", "key123")
		if err != ErrUnsupportedProvider {
			t.Fatalf("expected ErrUnsupportedProvider, got %v", err)
		}

		// Successful store and decrypt
		rawKey := "sk-ant-test-key-9999"
		resp, err := service.StoreKey(userID, models.ProviderAnthropic, rawKey)
		if err != nil {
			t.Fatalf("StoreKey failed: %v", err)
		}
		if resp.KeyLast4 != "9999" {
			t.Fatalf("expected last4 '9999', got '%s'", resp.KeyLast4)
		}

		decrypted, err := service.DecryptKey(userID, models.ProviderAnthropic)
		if err != nil {
			t.Fatalf("DecryptKey failed: %v", err)
		}
		if decrypted != rawKey {
			t.Fatalf("expected decrypted '%s', got '%s'", rawKey, decrypted)
		}

		// Delete key and verify decryption is impossible
		err = service.DeleteKey(userID, models.ProviderAnthropic)
		if err != nil {
			t.Fatalf("DeleteKey failed: %v", err)
		}

		_, err = service.DecryptKey(userID, models.ProviderAnthropic)
		if err != ErrKeyNotFound {
			t.Fatalf("expected ErrKeyNotFound after deletion, got %v", err)
		}
	})

	t.Run("Large payload encryption/decryption round trip (64KB)", func(t *testing.T) {
		dataKey, _ := GenerateAES256Key()
		largePayload := make([]byte, 64*1024)
		_, _ = rand.Read(largePayload)

		ciphertext, iv, err := EncryptAESGCM(largePayload, dataKey)
		if err != nil {
			t.Fatalf("EncryptAESGCM large payload failed: %v", err)
		}

		decrypted, err := DecryptAESGCM(ciphertext, iv, dataKey)
		if err != nil {
			t.Fatalf("DecryptAESGCM large payload failed: %v", err)
		}

		if !bytes.Equal(largePayload, decrypted) {
			t.Fatalf("decrypted payload mismatch for 64KB payload")
		}
	})
}
