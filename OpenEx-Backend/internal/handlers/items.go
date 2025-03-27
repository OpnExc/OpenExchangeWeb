package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "OpenEx-Backend/internal/database"
    "OpenEx-Backend/internal/models"
)

// ItemRequest is the request payload for creating an item
type ItemRequest struct {
    Title       string  `json:"title" binding:"required"`
    Description string  `json:"description" binding:"required"`
    Price       float64 `json:"price"`
    Image       string  `json:"image"`
    Type        string  `json:"type" binding:"required,oneof=sell exchange"`
}

// CreateItem creates a new item
func CreateItem(c *gin.Context) {
    user := c.MustGet("user").(models.User)

    var req ItemRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    item := models.Item{
        UserID:      user.ID,
        HostelID:    user.HostelID,
        Title:       req.Title,
        Description: req.Description,
        Price:       req.Price,
        Image:       req.Image,
        Type:        req.Type,
    }

    database.DB.Create(&item)
    c.JSON(http.StatusCreated, item)
}

// GetItem returns a specific item by ID
func GetItem(c *gin.Context) {
    var item models.Item
    database.DB.First(&item, c.Param("id"))
    c.JSON(http.StatusOK, item)
}

// ListItemsByHostel returns all approved items
func ListItemsByHostel(c *gin.Context) {
    var items []models.Item

    // Get all approved items without filtering by hostel
    database.DB.Where("status = ?", "approved").
        Preload("User").
        Preload("Hostel").
        Find(&items)

    // Map the data to include seller and hostel names
    var enrichedItems []gin.H
    for _, item := range items {
        enrichedItems = append(enrichedItems, gin.H{
            "ID":          item.ID,
            "Title":       item.Title,
            "Description": item.Description,
            "Price":       item.Price,
            "Image":       item.Image,
            "Type":        item.Type,
            "Status":      item.Status,
            "CreatedAt":   item.CreatedAt,
            "seller":      item.User.Name,
            "hostel":      item.Hostel.Name,
            "UserId":      item.UserID,
            "HostelId":    item.HostelID,
        })
    }

    c.JSON(http.StatusOK, enrichedItems)
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