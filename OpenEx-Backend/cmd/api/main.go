package main

import (
	"log"

	"OpenEx-Backend/internal/config"
	"OpenEx-Backend/internal/database"
	"OpenEx-Backend/internal/routes"
	"OpenEx-Backend/internal/worker"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	// Initialize database
	if err := database.Initialize(cfg.GetDSN()); err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Start auto-approver worker
	go worker.StartAutoApprover()

	// Set up router with all routes
	router := routes.SetupRouter()

	// Start the server
	log.Printf("Starting server on port %s", cfg.ServerPort)
	if err := router.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
