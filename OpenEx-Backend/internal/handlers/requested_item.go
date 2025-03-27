package handlers

import (
	"net/http"

	"OpenEx-Backend/internal/database"
	"OpenEx-Backend/internal/models"

	"github.com/gin-gonic/gin"
)

// RequestedItemRequest is the request payload for creating a requested item
type RequestedItemRequest struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description" binding:"required"`
	MaxPrice    float64 `json:"max_price"`
}

// CreateRequestedItem creates a new requested item
func CreateRequestedItem(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var req RequestedItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	requestedItem := models.RequestedItem{
		BuyerID:     user.ID,
		HostelID:    user.HostelID,
		Title:       req.Title,
		Description: req.Description,
		MaxPrice:    req.MaxPrice,
		Status:      "open",
	}

	database.DB.Create(&requestedItem)
	c.JSON(http.StatusCreated, requestedItem)
}

// ListRequestedItems returns all open requested items
func ListRequestedItems(c *gin.Context) {
	var requestedItems []models.RequestedItem

	database.DB.Where("status = ?", "open").
		Preload("Buyer").
		Preload("Hostel").
		Find(&requestedItems)

	// Map the data to include buyer and hostel names
	var enrichedItems []gin.H
	for _, item := range requestedItems {
		enrichedItems = append(enrichedItems, gin.H{
			"id":          item.ID,
			"title":       item.Title,
			"description": item.Description,
			"maxPrice":    item.MaxPrice,
			"status":      item.Status,
			"createdAt":   item.CreatedAt,
			"buyer":       item.Buyer.Name,
			"hostel":      item.Hostel.Name,
			"buyerId":     item.BuyerID,
			"hostelId":    item.HostelID,
		})
	}

	c.JSON(http.StatusOK, enrichedItems)
}

// FulfillRequest is the request payload for fulfilling a requested item
type FulfillRequest struct {
	RequestedItemID uint    `json:"requested_item_id" binding:"required"`
	Price           float64 `json:"price" binding:"required"`
	Image           string  `json:"image"`
}

// FulfillRequestedItem allows a seller to fulfill a requested item
func FulfillRequestedItem(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var req FulfillRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get the requested item
	var requestedItem models.RequestedItem
	if err := database.DB.First(&requestedItem, req.RequestedItemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Requested item not found"})
		return
	}

	// Check if the request is still open
	if requestedItem.Status != "open" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Request is not open"})
		return
	}

	// Check if the user is not the buyer (can't fulfill your own request)
	if requestedItem.BuyerID == user.ID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You cannot fulfill your own request"})
		return
	}

	// Check if price is within the max price
	if req.Price > requestedItem.MaxPrice && requestedItem.MaxPrice > 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Price exceeds maximum price"})
		return
	}

	// Create a new item
	item := models.Item{
		UserID:      user.ID,
		HostelID:    user.HostelID,
		Title:       requestedItem.Title,
		Description: requestedItem.Description,
		Price:       req.Price,
		Image:       req.Image,
		Type:        "sell",
		Status:      "approved", // Auto-approve since it's fulfilling a request
	}

	if err := database.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item"})
		return
	}

	// Create a transaction request
	tr := models.TransactionRequest{
		BuyerID:  requestedItem.BuyerID,
		SellerID: user.ID,
		ItemID:   item.ID,
		Type:     "buy",
		Status:   "pending",
	}

	if err := database.DB.Create(&tr).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create transaction request"})
		return
	}

	// Update the requested item status
	requestedItem.Status = "fulfilled"
	database.DB.Save(&requestedItem)

	c.JSON(http.StatusOK, gin.H{
		"message": "Request fulfilled successfully",
		"item":    item,
		"request": tr,
	})
}

// GetMyRequestedItems returns all requested items created by the authenticated user
func GetMyRequestedItems(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	var requestedItems []models.RequestedItem
	database.DB.Where("buyer_id = ?", user.ID).Find(&requestedItems)
	c.JSON(http.StatusOK, requestedItems)
}

// CloseRequestedItem allows a buyer to close their requested item
func CloseRequestedItem(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var requestedItem models.RequestedItem
	if err := database.DB.First(&requestedItem, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Requested item not found"})
		return
	}

	if requestedItem.BuyerID != user.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	if requestedItem.Status != "open" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Request is already closed or fulfilled"})
		return
	}

	requestedItem.Status = "closed"
	database.DB.Save(&requestedItem)

	c.JSON(http.StatusOK, gin.H{"message": "Request closed successfully"})
}
