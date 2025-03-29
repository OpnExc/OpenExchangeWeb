package handlers

import (
	"net/http"

	"OpenEx-Backend/internal/database"
	"OpenEx-Backend/internal/models"

	"github.com/gin-gonic/gin"
)

// ItemRequest is the request payload for creating an item
type ItemRequest struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description" binding:"required"`
	Price       float64 `json:"price"`
	Image       string  `json:"image"`
	Type        string  `json:"type" binding:"required,oneof=sell exchange"`
	Quantity    int     `json:"quantity"`
}

// CreateItem creates a new item
func CreateItem(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var req ItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Set a default quantity of 1 if not specified
	quantity := 1
	if req.Quantity > 0 {
		quantity = req.Quantity
	}

	item := models.Item{
		UserID:      user.ID,
		HostelID:    user.HostelID,
		Title:       req.Title,
		Description: req.Description,
		Price:       req.Price,
		Image:       req.Image,
		Type:        req.Type,
		Quantity:    quantity,
	}

	database.DB.Create(&item)
	c.JSON(http.StatusCreated, item)
}

// GetItem returns a specific item by ID
func GetItem(c *gin.Context) {
	var item models.Item

	if err := database.DB.Preload("User").Preload("Hostel").First(&item, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	// Check if the item is in the user's favorites if user is authenticated
	isFavorite := false
	if user, exists := c.Get("user"); exists {
		var favorite models.Favorite
		result := database.DB.Where("user_id = ? AND item_id = ?", user.(models.User).ID, item.ID).First(&favorite)
		isFavorite = result.RowsAffected > 0
	}

	// Enrich the response
	response := gin.H{
		"id":          item.ID,
		"title":       item.Title,
		"description": item.Description,
		"price":       item.Price,
		"image":       item.Image,
		"type":        item.Type,
		"status":      item.Status,
		"quantity":    item.Quantity,
		"created_at":  item.CreatedAt,
		"seller":      item.User.Name,
		"hostel":      item.Hostel.Name,
		"is_favorite": isFavorite,
	}

	c.JSON(http.StatusOK, response)
}

// ListItemsByHostel returns all approved items for a specific hostel
func ListItemsByHostel(c *gin.Context) {
	hostelID := c.Param("id")

	var items []models.Item
	// Only show approved items that aren't sold
	result := database.DB.Where("hostel_id = ? AND status = ? AND status != ?", hostelID, "approved", "sold").Find(&items)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch items"})
		return
	}

	c.JSON(http.StatusOK, items)
}

// GetUserItems returns all items belonging to the authenticated user
func GetUserItems(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	var items []models.Item
	database.DB.Where("user_id = ?", user.ID).Find(&items)
	c.JSON(http.StatusOK, items)
}

// ListPendingItems returns all pending items (admin only)
func ListPendingItems(c *gin.Context) {
	var items []models.Item
	database.DB.Where("status = 'pending'").Find(&items)
	c.JSON(http.StatusOK, items)
}

// ApproveItem approves a pending item (admin only)
func ApproveItem(c *gin.Context) {
	var item models.Item
	database.DB.First(&item, c.Param("id"))
	item.Status = "approved"
	database.DB.Save(&item)
	c.JSON(http.StatusOK, item)
}

// RejectItem rejects a pending item (admin only)
func RejectItem(c *gin.Context) {
	var item models.Item
	database.DB.First(&item, c.Param("id"))
	item.Status = "rejected"
	database.DB.Save(&item)
	c.JSON(http.StatusOK, item)
}
