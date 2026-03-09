package handlers

import (
	"cyberhunt-backend/models"
	"cyberhunt-backend/services"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func SubmitReport(c *fiber.Ctx) error {
	// 1. Get user email from some auth context or request (for now we assume it's passed or we'll need it)
	// In a real app, we'd get this from a JWT.
	// For this demo, let's look for a header or form field.
	userEmail := c.FormValue("userEmail")
	if userEmail == "" {
		return c.Status(400).JSON(fiber.Map{"message": "User email is required for logging"})
	}

	title := c.FormValue("title")
	description := c.FormValue("description")
	steps := c.FormValue("steps")
	severity := c.FormValue("severity")

	secureURL := c.FormValue("proofUrl")

	if secureURL == "" {
		// 2. Handle file upload (Fallback if not direct-to-cloud)
		file, err := c.FormFile("proof")
		if err != nil {
			return c.Status(400).JSON(fiber.Map{"message": "Proof attachment or proofUrl is required"})
		}

		// Create unique filename and sanitize it (replace spaces)
		cleanName := strings.ReplaceAll(file.Filename, " ", "_")
		filename := fmt.Sprintf("%s_%s", uuid.New().String(), cleanName)
		savePath := filepath.Join("uploads", filename)

		if err := c.SaveFile(file, savePath); err != nil {
			return c.Status(500).JSON(fiber.Map{"message": "Failed to save temporary attachment: " + err.Error()})
		}
		defer os.Remove(savePath) // Clean up local temporary file

		// 3. Upload to Cloudinary
		secureURL, err = services.UploadToCloudinary(savePath, filename)
		if err != nil {
			return c.Status(500).JSON(fiber.Map{"message": "Failed to upload to cloud storage (Cloudinary): " + err.Error()})
		}
	}

	// 4. Create Report object
	report := models.Report{
		ID:             uuid.New().String()[:8],
		UserEmail:      userEmail,
		Title:          title,
		Description:    description,
		Steps:          steps,
		Severity:       severity,
		AttachmentPath: secureURL, // Store the Cloudinary Secure URL
		Status:         "Pending",
		Date:           time.Now().Format("Jan 02, 2006"),
		Timestamp:      time.Now().Format("Jan 02, 2006 15:04:05"),
	}

	// 5. Append to Sheets (Backgrounded for performance)
	go func(r models.Report) {
		if err := services.AppendReport(r); err != nil {
			log.Printf("ERROR: Failed to log report to Google Sheets in background: %v", err)
		} else {
			log.Printf("SUCCESS: Report %s logged to Google Sheets in background", r.ID)
		}
	}(report)

	return c.Status(201).JSON(fiber.Map{
		"message": "Vulnerability report successfully encrypted and transmitted.",
		"report":  report,
	})
}

func GetUserSubmissions(c *fiber.Ctx) error {
	email := c.Query("email")
	if email == "" {
		return c.Status(400).JSON(fiber.Map{"message": "Email query param is required"})
	}

	rows, err := services.GetReports()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "Failed to fetch reports: " + err.Error()})
	}

	userReports := []models.Report{}
	for _, row := range rows {
		// Schema: [Timestamp, ID, UserEmail, Title, Description, Steps, Severity, Attachment Path, Status, Date]
		if len(row) >= 10 {
			rowEmail := fmt.Sprintf("%v", row[2]) // Email is now at index 2
			if rowEmail == email {
				userReports = append(userReports, models.Report{
					Timestamp:      fmt.Sprintf("%v", row[0]),
					ID:             fmt.Sprintf("%v", row[1]),
					UserEmail:      rowEmail,
					Title:          fmt.Sprintf("%v", row[3]),
					Description:    fmt.Sprintf("%v", row[4]),
					Steps:          fmt.Sprintf("%v", row[5]),
					Severity:       fmt.Sprintf("%v", row[6]),
					AttachmentPath: fmt.Sprintf("%v", row[7]),
					Status:         fmt.Sprintf("%v", row[8]),
					Date:           fmt.Sprintf("%v", row[9]),
				})
			}
		}
	}

	return c.Status(200).JSON(userReports)
}
