package vault

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"errors"
	"fmt"
	"io"
)

var (
	ErrDecryptionFailed = errors.New("failed to decrypt ciphertext: integrity verification failed")
	ErrInvalidKeySize   = errors.New("invalid AES key size: must be 32 bytes for AES-256")
)

type KMSMasterKey struct {
	masterKey []byte
}

func NewKMSMasterKey(key []byte) (*KMSMasterKey, error) {
	if len(key) != 32 {
		return nil, ErrInvalidKeySize
	}
	return &KMSMasterKey{masterKey: key}, nil
}

func GenerateAES256Key() ([]byte, error) {
	key := make([]byte, 32)
	if _, err := io.ReadFull(rand.Reader, key); err != nil {
		return nil, fmt.Errorf("failed to generate random key: %w", err)
	}
	return key, nil
}

func EncryptAESGCM(plaintext []byte, key []byte) (ciphertext []byte, iv []byte, err error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, nil, err
	}

	iv = make([]byte, gcm.NonceSize())
	if _, err = io.ReadFull(rand.Reader, iv); err != nil {
		return nil, nil, err
	}

	ciphertext = gcm.Seal(nil, iv, plaintext, nil)
	return ciphertext, iv, nil
}

func DecryptAESGCM(ciphertext []byte, iv []byte, key []byte) ([]byte, error) {
	block, err := aes.NewCipher(key)
	if err != nil {
		return nil, err
	}

	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return nil, err
	}

	plaintext, err := gcm.Open(nil, iv, ciphertext, nil)
	if err != nil {
		return nil, ErrDecryptionFailed
	}

	return plaintext, nil
}

func (k *KMSMasterKey) WrapDataKey(dataKey []byte) (wrappedKey []byte, iv []byte, err error) {
	return EncryptAESGCM(dataKey, k.masterKey)
}

func (k *KMSMasterKey) UnwrapDataKey(wrappedKey []byte, iv []byte) ([]byte, error) {
	return DecryptAESGCM(wrappedKey, iv, k.masterKey)
}
