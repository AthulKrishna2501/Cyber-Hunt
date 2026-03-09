package main

import (
	"cyberhunt-backend/handlers"
	"cyberhunt-backend/services"
	"log"
	"os"

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

	app := fiber.New()

	// CORS Setup
	allowedOrigins := os.Getenv("ALLOWED_ORIGINS")
	if allowedOrigins == "" {
		allowedOrigins = "http://localhost:3000"
	}

	app.Use(cors.New(cors.Config{
		AllowOrigins: allowedOrigins,
		AllowHeaders: "Origin, Content-Type, Accept",
	}))

	// Routes
	api := app.Group("/api")
	api.Post("/register", handlers.Register)
	api.Post("/login", handlers.Login)
	api.Post("/reports", handlers.SubmitReport)
	api.Get("/reports", handlers.GetUserSubmissions)

	app.Static("/uploads", "./uploads")

	// Start Server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen(":" + port))
}
