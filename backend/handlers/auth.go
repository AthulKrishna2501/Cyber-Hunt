package handlers

import (
	"cyberhunt-backend/models"
	"cyberhunt-backend/services"
	"fmt"
	"os"

	"github.com/gofiber/fiber/v2"
)

func Register(c *fiber.Ctx) error {
	user := new(models.User)
	if err := c.BodyParser(user); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Invalid request body"})
	}

	// 1. Check if user already exists
	users, err := services.GetUsers()
	if err == nil { // If we can't get users, we might still want to proceed or fail, but usually we check
		for _, row := range users {
			if len(row) >= 3 {
				email := fmt.Sprintf("%v", row[2])
				if email == user.Email {
					return c.Status(409).JSON(fiber.Map{"message": "Identity already established in the mainframe."})
				}
			}
		}
	}

	// Append user to Sheets
	values := []interface{}{
		user.FullName,
		user.Email,
		user.Phone,
		user.Batch,
		user.Module,
		user.Consent,
	}

	if err := services.AppendUser(values); err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "Failed to create identity: " + err.Error()})
	}

	targetURL := os.Getenv("TARGET_URL")

	return c.Status(201).JSON(fiber.Map{
		"message":   "Identity established. Credentials accepted.",
		"fullName":  user.FullName,
		"targetUrl": targetURL,
	})
}

func Login(c *fiber.Ctx) error {
	req := new(models.LoginRequest)
	if err := c.BodyParser(req); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Invalid request body"})
	}

	users, err := services.GetUsers()
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "Failed to access mainframe: " + err.Error()})
	}

	for _, row := range users {
		if len(row) >= 3 {
			fullName := fmt.Sprintf("%v", row[1])
			email := fmt.Sprintf("%v", row[2])

			if email == req.Email {
				targetURL := os.Getenv("TARGET_URL")
				return c.Status(200).JSON(fiber.Map{
					"message":   "Authorization granted. Accessing Mainframe...",
					"token":     "dummy-token-for-now",
					"fullName":  fullName,
					"targetUrl": targetURL,
				})
			}
		}
	}

	return c.Status(401).JSON(fiber.Map{"message": "Invalid credentials"})
}
