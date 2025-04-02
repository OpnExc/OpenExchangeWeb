package handlers

import (
	"net/http"

	"OpenEx-Backend/internal/database"
	"OpenEx-Backend/internal/models"

	"github.com/gin-gonic/gin"
)

// AddToFavorites adds an item to user's favorites
func AddToFavorites(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var req struct {
		ItemID uint `json:"item_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if item exists
	var item models.Item
	if err := database.DB.First(&item, req.ItemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	// Check if already in favorites - Use Count instead of First to avoid error
	var count int64
	database.DB.Model(&models.Favorite{}).Where("user_id = ? AND item_id = ?", user.ID, req.ItemID).Count(&count)

	if count > 0 {
		c.JSON(http.StatusOK, gin.H{"message": "Item already in favorites"})
		return
	}

	// Add to favorites
	favorite := models.Favorite{
		UserID: user.ID,
		ItemID: req.ItemID,
	}

	if err := database.DB.Create(&favorite).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add to favorites"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Added to favorites"})
}

// RemoveFromFavorites removes an item from user's favorites
func RemoveFromFavorites(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	itemID := c.Param("id")

	var favorite models.Favorite
	result := database.DB.Where("user_id = ? AND item_id = ?", user.ID, itemID).First(&favorite)

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not in favorites"})
		return
	}

	if err := database.DB.Delete(&favorite).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove from favorites"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Removed from favorites"})
}

// ListFavorites lists all favorites of the authenticated user
func ListFavorites(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var favorites []models.Favorite
	database.DB.Where("user_id = ?", user.ID).Preload("Item").Preload("Item.User").Preload("Item.Hostel").Find(&favorites)

	var enrichedFavorites []gin.H
	for _, favorite := range favorites {
		enrichedFavorites = append(enrichedFavorites, gin.H{
			"id":          favorite.ID,
			"item_id":     favorite.ItemID,
			"title":       favorite.Item.Title,
			"description": favorite.Item.Description,
			"price":       favorite.Item.Price,
			"image":       favorite.Item.Image,
			"type":        favorite.Item.Type,
			"quantity":    favorite.Item.Quantity,
			"seller":      favorite.Item.User.Name,
			"hostel":      favorite.Item.Hostel.Name,
			"created_at":  favorite.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, enrichedFavorites)
}

// CheckFavoriteStatus checks if an item is in user's favorites
func CheckFavoriteStatus(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	itemID := c.Param("id")

	var favorite models.Favorite
	result := database.DB.Where("user_id = ? AND item_id = ?", user.ID, itemID).First(&favorite)

	isFavorite := result.RowsAffected > 0

	c.JSON(http.StatusOK, gin.H{"is_favorite": isFavorite})
}
