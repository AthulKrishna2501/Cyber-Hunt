package handlers

import (
	"cyberhunt-backend/utils"
	"strings"

	"github.com/gofiber/fiber/v2"
)

func JWTMiddleware(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized: Missing token"})
	}

	tokenParts := strings.Split(authHeader, " ")
	if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized: Invalid token format"})
	}

	claims, err := utils.ValidateToken(tokenParts[1], false)
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"message": "Unauthorized: " + err.Error()})
	}

	// Store claims in context for handlers to use
	c.Locals("userEmail", claims["email"])
	c.Locals("userFullName", claims["fullName"])

	return c.Next()
}
