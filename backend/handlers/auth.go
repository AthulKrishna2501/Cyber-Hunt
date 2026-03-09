package handlers

import (
	"cyberhunt-backend/models"
	"cyberhunt-backend/services"
	"cyberhunt-backend/utils"
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
	rows, err := services.GetUsers()
	if err == nil {
		for _, row := range rows {
			if len(row) >= 3 {
				email := fmt.Sprintf("%v", row[2])
				if email == user.Email {
					return c.Status(409).JSON(fiber.Map{"message": "Identity already established. Request access through secure channels."})
				}
			}
		}
	}

	// Sign up user
	userValues := []interface{}{
		user.FullName,
		user.Email,
		user.Phone,
		user.Batch,
		user.Module,
		user.Consent,
	}

	err = services.AppendUser(userValues)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "Failed to create identity: " + err.Error()})
	}

	accessToken, refreshToken, err := utils.GenerateTokens(user.Email, user.FullName)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "Failed to generate security tokens"})
	}

	targetURL := os.Getenv("TARGET_URL")
	return c.Status(201).JSON(fiber.Map{
		"message":      "Identity established. Credentials accepted.",
		"fullName":     user.FullName,
		"targetUrl":    targetURL,
		"accessToken":  accessToken,
		"refreshToken": refreshToken,
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
				accessToken, refreshToken, err := utils.GenerateTokens(fullName, email)
				if err != nil {
					return c.Status(500).JSON(fiber.Map{"message": "Failed to generate security tokens"})
				}

				return c.Status(200).JSON(fiber.Map{
					"message":      "Authorization granted. Accessing Mainframe...",
					"token":        accessToken, // Keep for backward compatibility or transition
					"accessToken":  accessToken,
					"refreshToken": refreshToken,
					"fullName":     fullName,
					"targetUrl":    targetURL,
				})
			}
		}
	}

	return c.Status(401).JSON(fiber.Map{"message": "Authorization failed. Unknown credentials."})
}

func RefreshToken(c *fiber.Ctx) error {
	var body struct {
		RefreshToken string `json:"refreshToken"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(400).JSON(fiber.Map{"message": "Refresh token required"})
	}

	claims, err := utils.ValidateToken(body.RefreshToken, true)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"message": "Invalid or expired refresh token"})
	}

	email := claims["email"].(string)
	// We might want to fetch full name again if needed, but for now we can just use email
	// or store name in refresh token too. In GenerateTokens I used (email, fullName) for Access and just (email) for Refresh.
	// Let's adjust GenerateTokens to include fullName in refresh if needed, but usually email is enough to identify.

	accessToken, newRefreshToken, err := utils.GenerateTokens(email, "") // fullName empty for now
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"message": "Failed to regenerate tokens"})
	}

	return c.Status(200).JSON(fiber.Map{
		"accessToken":  accessToken,
		"refreshToken": newRefreshToken,
	})
}
