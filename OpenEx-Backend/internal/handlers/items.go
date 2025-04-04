package handlers

import (
	"net/http"
	"time"

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
	HostelID    uint    `json:"hostelId" binding:"required"` // Add this field
}

type ItemResponse struct {
	ID          uint      `json:"ID"`
	Title       string    `json:"Title"`
	Description string    `json:"Description"`
	Price       float64   `json:"Price"`
	Image       string    `json:"Image"`
	Type        string    `json:"Type"`
	Status      string    `json:"Status"`
	Quantity    int       `json:"Quantity"`
	UserID      uint      `json:"UserID"`
	HostelID    uint      `json:"HostelID"`
	HostelName  string    `json:"HostelName"`
	CreatedAt   time.Time `json:"CreatedAt"`
	UpdatedAt   time.Time `json:"UpdatedAt"`
}

// CreateItem creates a new item
func CreateItem(c *gin.Context) {
	var req ItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user from context
	user := c.MustGet("user").(models.User)

	// Validate hostel exists
	var hostel models.Hostel
	if result := database.DB.First(&hostel, req.HostelID); result.Error != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid hostel ID"})
		return
	}

	item := models.Item{
		Title:       req.Title,
		Description: req.Description,
		Price:       req.Price,
		Image:       req.Image,
		Type:        req.Type,
		Quantity:    req.Quantity,
		UserID:      user.ID,
		HostelID:    req.HostelID, // Add this field
		Status:      "pending",
	}

	if err := database.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create item"})
		return
	}

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

// ListItems returns all approved items
func ListItems(c *gin.Context) {
	var items []models.Item

	// Add status filter for approved items only
	if err := database.DB.Preload("Hostel").Where("status = ?", "approved").Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch items"})
		return
	}

	var response []ItemResponse
	for _, item := range items {
		response = append(response, ItemResponse{
			ID:          item.ID,
			Title:       item.Title,
			Description: item.Description,
			Price:       item.Price,
			Image:       item.Image,
			Type:        item.Type,
			Status:      item.Status,
			Quantity:    item.Quantity,
			UserID:      item.UserID,
			HostelID:    item.HostelID,
			HostelName:  item.Hostel.Name,
			CreatedAt:   item.CreatedAt,
			UpdatedAt:   item.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, response)
}

// ListItemsByHostel returns all approved items for a specific hostel
func ListItemsByHostel(c *gin.Context) {
	hostelID := c.Param("id")
	var items []models.Item

	// Add status filter for approved items only
	if err := database.DB.Preload("Hostel").Where("hostel_id = ? AND status = ?", hostelID, "approved").Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch items"})
		return
	}

	var response []ItemResponse
	for _, item := range items {
		response = append(response, ItemResponse{
			ID:          item.ID,
			Title:       item.Title,
			Description: item.Description,
			Price:       item.Price,
			Image:       item.Image,
			Type:        item.Type,
			Status:      item.Status,
			Quantity:    item.Quantity,
			UserID:      item.UserID,
			HostelID:    item.HostelID,
			HostelName:  item.Hostel.Name,
			CreatedAt:   item.CreatedAt,
			UpdatedAt:   item.UpdatedAt,
		})
	}

	c.JSON(http.StatusOK, response)
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
