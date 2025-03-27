package handlers

import (
	"net/http"
	"time"

	"OpenEx-Backend/internal/database"
	"OpenEx-Backend/internal/models"

	"github.com/gin-gonic/gin"
)

// ServiceRequest is the request payload for creating a service
type ServiceOfferRequest struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description" binding:"required"`
	Price       float64 `json:"price" binding:"required,min=0"`
	Category    string  `json:"category" binding:"required"`
}

// CreateService creates a new service offered by a user
func CreateService(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var req ServiceOfferRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	service := models.Service{
		UserID:      user.ID,
		HostelID:    user.HostelID,
		Title:       req.Title,
		Description: req.Description,
		Price:       req.Price,
		Category:    req.Category,
		Status:      "pending", // Requires admin approval
	}

	database.DB.Create(&service)
	c.JSON(http.StatusCreated, service)
}

// ListServices returns all approved services
func ListServices(c *gin.Context) {
	var services []models.Service

	// Get all approved services
	database.DB.Where("status = ?", "approved").
		Preload("User").
		Preload("Hostel").
		Find(&services)

	// Map the data to include provider and hostel names
	var enrichedServices []gin.H
	for _, service := range services {
		enrichedServices = append(enrichedServices, gin.H{
			"id":          service.ID,
			"title":       service.Title,
			"description": service.Description,
			"price":       service.Price,
			"category":    service.Category,
			"status":      service.Status,
			"createdAt":   service.CreatedAt,
			"provider":    service.User.Name,
			"hostel":      service.Hostel.Name,
			"providerId":  service.UserID,
			"hostelId":    service.HostelID,
		})
	}

	c.JSON(http.StatusOK, enrichedServices)
}

// GetMyServices returns all services offered by the authenticated user
func GetMyServices(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	var services []models.Service
	database.DB.Where("user_id = ?", user.ID).Find(&services)
	c.JSON(http.StatusOK, services)
}

// ListPendingServices returns all pending services (admin only)
func ListPendingServices(c *gin.Context) {
	var services []models.Service
	database.DB.Where("status = ?", "pending").
		Preload("User").
		Preload("Hostel").
		Find(&services)
	c.JSON(http.StatusOK, services)
}

// ApproveService approves a pending service (admin only)
func ApproveService(c *gin.Context) {
	var service models.Service
	database.DB.First(&service, c.Param("id"))
	service.Status = "approved"
	database.DB.Save(&service)
	c.JSON(http.StatusOK, service)
}

// RejectService rejects a pending service (admin only)
func RejectService(c *gin.Context) {
	var service models.Service
	database.DB.First(&service, c.Param("id"))
	service.Status = "rejected"
	database.DB.Save(&service)
	c.JSON(http.StatusOK, service)
}

// ServiceRequestDto is the request payload for creating a service request
type ServiceRequestDto struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description" binding:"required"`
	Budget      float64 `json:"budget" binding:"min=0"`
	Category    string  `json:"category" binding:"required"`
}

// CreateServiceRequest creates a new service request
func CreateServiceRequest(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var req ServiceRequestDto
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	serviceRequest := models.ServiceRequest{
		RequesterID: user.ID,
		HostelID:    user.HostelID,
		Title:       req.Title,
		Description: req.Description,
		Budget:      req.Budget,
		Category:    req.Category,
		Status:      "open",
	}

	database.DB.Create(&serviceRequest)
	c.JSON(http.StatusCreated, serviceRequest)
}

// ListServiceRequests returns all open service requests
func ListServiceRequests(c *gin.Context) {
	var serviceRequests []models.ServiceRequest

	database.DB.Where("status = ?", "open").
		Preload("Requester").
		Preload("Hostel").
		Find(&serviceRequests)

	// Map the data to include requester and hostel names
	var enrichedRequests []gin.H
	for _, request := range serviceRequests {
		enrichedRequests = append(enrichedRequests, gin.H{
			"id":          request.ID,
			"title":       request.Title,
			"description": request.Description,
			"budget":      request.Budget,
			"category":    request.Category,
			"status":      request.Status,
			"createdAt":   request.CreatedAt,
			"requester":   request.Requester.Name,
			"hostel":      request.Hostel.Name,
			"requesterId": request.RequesterID,
			"hostelId":    request.HostelID,
		})
	}

	c.JSON(http.StatusOK, enrichedRequests)
}

// GetMyServiceRequests returns all service requests created by the authenticated user
func GetMyServiceRequests(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	var serviceRequests []models.ServiceRequest
	database.DB.Where("requester_id = ?", user.ID).Find(&serviceRequests)
	c.JSON(http.StatusOK, serviceRequests)
}

// GetServiceRequestsITook returns all service requests the authenticated user has accepted
func GetServiceRequestsITook(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	var serviceRequests []models.ServiceRequest
	database.DB.Where("provider_id = ?", user.ID).Find(&serviceRequests)
	c.JSON(http.StatusOK, serviceRequests)
}

// AcceptServiceRequest allows a provider to accept a service request
func AcceptServiceRequest(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var serviceRequest models.ServiceRequest
	if err := database.DB.First(&serviceRequest, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Service request not found"})
		return
	}

	// Check if request is still open
	if serviceRequest.Status != "open" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Service request is not open"})
		return
	}

	// Check if user is not the requester
	if serviceRequest.RequesterID == user.ID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot fulfill your own request"})
		return
	}

	// Update the service request
	now := time.Now()
	serviceRequest.Status = "in-progress"
	serviceRequest.ProviderID = &user.ID
	serviceRequest.AcceptedAt = &now
	database.DB.Save(&serviceRequest)

	// Load requester details to share contact info
	var requester models.User
	database.DB.First(&requester, serviceRequest.RequesterID)

	c.JSON(http.StatusOK, gin.H{
		"message":           "Service request accepted successfully",
		"request":           serviceRequest,
		"requester_contact": requester.ContactDetails,
		"provider_contact":  user.ContactDetails,
	})
}

// CompleteServiceRequest allows a requester to mark a service as completed
func CompleteServiceRequest(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var serviceRequest models.ServiceRequest
	if err := database.DB.First(&serviceRequest, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Service request not found"})
		return
	}

	// Check if user is the requester
	if serviceRequest.RequesterID != user.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the requester can mark a service as completed"})
		return
	}

	// Check if service is in progress
	if serviceRequest.Status != "in-progress" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Service request is not in progress"})
		return
	}

	// Update the service request
	now := time.Now()
	serviceRequest.Status = "completed"
	serviceRequest.CompletedAt = &now
	database.DB.Save(&serviceRequest)

	c.JSON(http.StatusOK, gin.H{
		"message": "Service request marked as completed",
		"request": serviceRequest,
	})
}

// CancelServiceRequest allows a requester to cancel their open service request
func CancelServiceRequest(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var serviceRequest models.ServiceRequest
	if err := database.DB.First(&serviceRequest, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Service request not found"})
		return
	}

	// Check if user is the requester
	if serviceRequest.RequesterID != user.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Only the requester can cancel a service request"})
		return
	}

	// Check if service is still open
	if serviceRequest.Status != "open" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Only open service requests can be cancelled"})
		return
	}

	// Update the service request
	serviceRequest.Status = "cancelled"
	database.DB.Save(&serviceRequest)

	c.JSON(http.StatusOK, gin.H{
		"message": "Service request cancelled",
		"request": serviceRequest,
	})
}
