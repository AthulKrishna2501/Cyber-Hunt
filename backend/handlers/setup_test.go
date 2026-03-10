package handlers_test

import (
	"cyberhunt-backend/handlers"
	"cyberhunt-backend/services"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
)

// setupApp creates a new Fiber instance configured for testing
func setupApp() *fiber.App {
	// Load test environment variables (or rely on defaults)
	godotenv.Load("../.env") // graceful load, ignore error if missing
	os.Setenv("JWT_SECRET", "test-secret")
	os.Setenv("JWT_REFRESH_SECRET", "test-refresh-secret")

	app := fiber.New()

	api := app.Group("/api")
	api.Get("/ping", func(c *fiber.Ctx) error {
		return c.SendString("pong")
	})

	api.Post("/register", handlers.Register)
	api.Post("/login", handlers.Login)
	api.Post("/refresh", handlers.RefreshToken)

	// Protected Routes
	reports := api.Group("/reports", handlers.JWTMiddleware)
	reports.Post("/", handlers.SubmitReport)
	reports.Get("/", handlers.GetUserSubmissions)

	// Mock the google sheets services to avoid nil pointer panic on startup
	services.GetUsers = func() ([][]interface{}, error) {
		return [][]interface{}{
			{"Jan 01, 2026 12:00:00", "John Doe", "john@test.com", "1234567890", "Batch 1", "Module 1", "Yes"},
		}, nil
	}
	services.AppendUser = func(values []interface{}) error {
		return nil
	}

	return app
}

// generateTestToken generates a valid token for protected routes
func generateTestToken() (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"team_id": "test_team_123",
		"exp":     time.Now().Add(time.Hour * 1).Unix(),
	})
	return token.SignedString([]byte("test-secret"))
}
