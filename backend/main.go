package main

import (
	"cyberhunt-backend/handlers"
	"cyberhunt-backend/services"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize Google Sheets
	if err := services.InitSheets(); err != nil {
		log.Fatalf("Failed to initialize Google Sheets: %v", err)
	}

	// Initialize Cloudinary Storage
	if err := services.InitStorage(); err != nil {
		log.Printf("Warning: Failed to initialize Cloudinary: %v", err)
	}

	// Ensure uploads directory exists for temporary storage
	if err := os.MkdirAll("./uploads", 0755); err != nil {
		log.Printf("Warning: Could not create uploads directory: %v", err)
	}

	app := fiber.New()

	// CORS Setup
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:3000"
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS",
		AllowCredentials: true,
	}))

	// Routes
	app.Get("/ping", func(c *fiber.Ctx) error {
		return c.SendString("pong")
	})

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

	app.Static("/uploads", "./uploads")

	// Start keep-alive cron job
	go keepalive()

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}

func keepalive() {
	url := os.Getenv("RENDER_EXTERNAL_URL")
	if url == "" {
		url = os.Getenv("SERVER_URL")
	}
	if url == "" {
		log.Println("Target URL for keep-alive not found. Skipping cron job.")
		return
	}

	ticker := time.NewTicker(14 * time.Minute)
	for range ticker.C {
		resp, err := http.Get(url + "/api/ping")
		if err != nil {
			log.Printf("Keep-alive ping failed: %v", err)
		} else {
			log.Printf("Keep-alive ping successful: %d", resp.StatusCode)
			resp.Body.Close()
		}
	}
}
