package storage

import (
	"crypto/hmac"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/google/uuid"
)

type ImageKitAuthResponse struct {
	Token     string `json:"token"`
	Expire    int64  `json:"expire"`
	Signature string `json:"signature"`
	PublicKey string `json:"publicKey"`
}

type StorageHandler struct {
	publicKey  string
	privateKey string
}

func NewStorageHandler() *StorageHandler {
	return &StorageHandler{
		publicKey:  os.Getenv("IMAGEKIT_PUBLIC_KEY"),
		privateKey: os.Getenv("IMAGEKIT_PRIVATE_KEY"),
	}
}

func (h *StorageHandler) GetImageKitAuth(w http.ResponseWriter, r *http.Request) {
	token := uuid.New().String()
	expire := time.Now().UTC().Add(30 * time.Minute).Unix()

	var signature string
	if h.privateKey != "" {
		mac := hmac.New(sha1.New, []byte(h.privateKey))
		mac.Write([]byte(token + strconv.FormatInt(expire, 10)))
		signature = hex.EncodeToString(mac.Sum(nil))
	} else {
		// Fallback token signature if private key not configured yet
		signature = fmt.Sprintf("demo-sig-%s", token[:8])
	}

	pubKey := h.publicKey
	if pubKey == "" {
		pubKey = "public_karma_default"
	}

	resp := ImageKitAuthResponse{
		Token:     token,
		Expire:    expire,
		Signature: signature,
		PublicKey: pubKey,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
