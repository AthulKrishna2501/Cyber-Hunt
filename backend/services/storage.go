package services

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
)

var Cld *cloudinary.Cloudinary

func InitStorage() error {
	cloudName := os.Getenv("CLOUDINARY_CLOUD_NAME")
	apiKey := os.Getenv("CLOUDINARY_API_KEY")
	apiSecret := os.Getenv("CLOUDINARY_API_SECRET")

	if cloudName == "" || apiKey == "" || apiSecret == "" {
		return fmt.Errorf("Cloudinary environment variables not set")
	}

	cld, err := cloudinary.NewFromParams(cloudName, apiKey, apiSecret)
	if err != nil {
		return fmt.Errorf("failed to initialize Cloudinary: %v", err)
	}

	Cld = cld
	return nil
}

func UploadToCloudinary(filePath string, filename string) (string, error) {
	ctx := context.Background()

	// Robustly remove extension for PublicID
	ext := filepath.Ext(filename)
	publicID := strings.TrimSuffix(filename, ext)

	log.Printf("Uploading to Cloudinary: File=%s, PublicID=%s, Ext=%s", filePath, publicID, ext)

	resp, err := Cld.Upload.Upload(ctx, filePath, uploader.UploadParams{
		PublicID:     publicID,
		Folder:       "cyber_hunt_proofs",
		ResourceType: "auto",
		Type:         "upload", // Explicitly set to public upload
	})
	if err != nil {
		return "", fmt.Errorf("failed to upload to Cloudinary: %v", err)
	}

	log.Printf("Cloudinary Upload Success: %s", resp.SecureURL)
	return resp.SecureURL, nil
}
