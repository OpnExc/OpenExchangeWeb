package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "OpenEx-Backend/internal/database"
    "OpenEx-Backend/internal/models"
)

// GetUserDetails returns the authenticated user's details
func GetUserDetails(c *gin.Context) {
    user := c.MustGet("user").(models.User)

    // Fetch the user details from the database
    var userDetails models.User
    if err := database.DB.Preload("Hostel").First(&userDetails, user.ID).Error; err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
        return
    }

    // Return the user details as JSON
    c.JSON(http.StatusOK, gin.H{
        "id":             userDetails.ID,
        "name":           userDetails.Name,
        "email":          userDetails.Email,
        "contactDetails": userDetails.ContactDetails,
        "role":           userDetails.Role,
        "hostel": gin.H{
            "id":   userDetails.Hostel.ID,
            "name": userDetails.Hostel.Name,
        },
        "createdAt": userDetails.CreatedAt,
        "updatedAt": userDetails.UpdatedAt,
    })
}

// EditUserRequest is the request payload for editing user details
type EditUserRequest struct {
    Name           string `json:"name" binding:"required"`
    ContactDetails string `json:"contact_details" binding:"required"`
}

// EditUserDetails updates the authenticated user's details
func EditUserDetails(c *gin.Context) {
    user := c.MustGet("user").(models.User)

    var req EditUserRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Update the user details
    user.Name = req.Name
    user.ContactDetails = req.ContactDetails

    if err := database.DB.Save(&user).Error; err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user details"})
        return
    }

    // Return the updated user details
    c.JSON(http.StatusOK, gin.H{
        "id":             user.ID,
        "name":           user.Name,
        "email":          user.Email,
        "contactDetails": user.ContactDetails,
        "role":           user.Role,
        "hostel": gin.H{
            "id":   user.Hostel.ID,
            "name": user.Hostel.Name,
        },
        "createdAt": user.CreatedAt,
        "updatedAt": user.UpdatedAt,
    })
}