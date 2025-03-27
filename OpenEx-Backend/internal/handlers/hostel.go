package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "OpenEx-Backend/internal/database"
    "OpenEx-Backend/internal/models"
)

// ListHostels returns all hostels
func ListHostels(c *gin.Context) {
    var hostels []models.Hostel
    database.DB.Find(&hostels)
    c.JSON(http.StatusOK, hostels)
}

// HostelRequest is the request payload for creating a hostel
type HostelRequest struct {
    Name string `json:"name" binding:"required"`
}

// CreateHostel creates a new hostel
func CreateHostel(c *gin.Context) {
    var req HostelRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Check if hostel with same name already exists
    var existingHostel models.Hostel
    if database.DB.Where("name = ?", req.Name).First(&existingHostel).RowsAffected > 0 {
        c.JSON(http.StatusConflict, gin.H{"error": "Hostel with this name already exists"})
        return
    }

    hostel := models.Hostel{
        Name: req.Name,
    }

    database.DB.Create(&hostel)
    c.JSON(http.StatusCreated, hostel)
}