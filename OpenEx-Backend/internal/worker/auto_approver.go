package worker

import (
	"OpenEx-Backend/internal/database"
	"OpenEx-Backend/internal/models"
	"OpenEx-Backend/internal/services/moderator"
	"log"
	"os"
	"strconv"
	"time"
)

// GetWaitPeriod returns the configured wait period for auto-approval
func GetWaitPeriod() time.Duration {
	// Default to 24 hours if not specified
	waitHours := 24

	// Try to get from environment variable
	if envHours := os.Getenv("AUTO_APPROVE_WAIT_HOURS"); envHours != "" {
		if parsed, err := strconv.Atoi(envHours); err == nil && parsed > 0 {
			waitHours = parsed
		}
	}

	return time.Duration(waitHours) * time.Hour
}

// StartAutoApprover starts the background worker for auto-approving items
func StartAutoApprover() {
	// Initialize moderator service
	moderator.Initialize()

	// Set up periodic check
	waitPeriod := GetWaitPeriod()
	log.Printf("Auto-approver will process items after %v of pending status", waitPeriod)

	ticker := time.NewTicker(1 * time.Hour)
	go func() {
		for range ticker.C {
			processExpiredPendingItems()
			processExpiredPendingServices()
		}
	}()

	log.Println("Auto-approver worker started")
}

// processExpiredPendingItems processes items that have been pending for too long
func processExpiredPendingItems() {
	var items []models.Item

	// Find items that have been pending too long
	cutoffTime := time.Now().Add(-GetWaitPeriod())
	if err := database.DB.Where("status = ? AND created_at < ?", "pending", cutoffTime).Find(&items).Error; err != nil {
		log.Printf("Error finding pending items: %v", err)
		return
	}

	log.Printf("Found %d pending items ready for auto-processing", len(items))

	for _, item := range items {
		// Evaluate item content
		approved, confidence, reason := moderator.EvaluateContent(
			item.Title,
			item.Description,
			item.Image,
		)

		if approved {
			item.Status = "approved"
			log.Printf("Auto-approved item #%d (confidence: %.2f)", item.ID, confidence)
		} else {
			item.Status = "rejected"
			log.Printf("Auto-rejected item #%d: %s (confidence: %.2f)", item.ID, reason, confidence)
		}

		if err := database.DB.Save(&item).Error; err != nil {
			log.Printf("Error updating item #%d: %v", item.ID, err)
		}
	}
}

// processExpiredPendingServices processes services that have been pending for too long
func processExpiredPendingServices() {
	var services []models.Service

	// Find services that have been pending too long
	cutoffTime := time.Now().Add(-GetWaitPeriod())
	if err := database.DB.Where("status = ? AND created_at < ?", "pending", cutoffTime).Find(&services).Error; err != nil {
		log.Printf("Error finding pending services: %v", err)
		return
	}

	log.Printf("Found %d pending services ready for auto-processing", len(services))

	for _, service := range services {
		// Evaluate service content
		approved, confidence, reason := moderator.EvaluateContent(
			service.Title,
			service.Description,
			"", // Services typically don't have images
		)

		if approved {
			service.Status = "approved"
			log.Printf("Auto-approved service #%d (confidence: %.2f)", service.ID, confidence)
		} else {
			service.Status = "rejected"
			log.Printf("Auto-rejected service #%d: %s (confidence: %.2f)", service.ID, reason, confidence)
		}

		if err := database.DB.Save(&service).Error; err != nil {
			log.Printf("Error updating service #%d: %v", service.ID, err)
		}
	}
}
