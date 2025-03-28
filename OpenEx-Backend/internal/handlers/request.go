package handlers

import (
	"net/http"

	"OpenEx-Backend/internal/database"
	"OpenEx-Backend/internal/models"

	"github.com/gin-gonic/gin"
)

// Request is the request payload for creating a transaction request
type Request struct {
	ItemID        uint   `json:"item_id" binding:"required"`
	OfferedItemID *uint  `json:"offered_item_id"`
	Type          string `json:"type" binding:"required,oneof=buy exchange"`
}

// ApprovalRequest is the request payload for approving or rejecting a transaction request
type ApprovalRequest struct {
	Status string `json:"status" binding:"required,oneof=approved rejected"`
}

// CreateRequest creates a new transaction request
func CreateRequest(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var req Request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var item models.Item
	if err := database.DB.Preload("User").First(&item, req.ItemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	if item.Status != "approved" || item.UserID == user.ID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	tr := models.TransactionRequest{
		BuyerID:       user.ID,
		SellerID:      item.User.ID,
		ItemID:        item.ID,
		OfferedItemID: req.OfferedItemID,
		Type:          req.Type,
	}

	database.DB.Create(&tr)
	c.JSON(http.StatusCreated, tr)
}

// ListRequests returns all transaction requests for the authenticated user
func ListRequests(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	var requests []models.TransactionRequest
	database.DB.Preload("Item").Preload("OfferedItem").
		Where("buyer_id = ? OR seller_id = ?", user.ID, user.ID).
		Find(&requests)
	c.JSON(http.StatusOK, requests)
}

// ApproveRequest approves or rejects a transaction request
func ApproveRequest(c *gin.Context) {
	user := c.MustGet("user").(models.User)
	requestID := c.Param("id")

	var approvalReq ApprovalRequest
	if err := c.ShouldBindJSON(&approvalReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var request models.TransactionRequest
	if err := database.DB.First(&request, requestID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Request not found"})
		return
	}

	// Verify that the user is the seller
	if request.SellerID != user.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Not authorized to approve/reject this request"})
		return
	}

	// Check if request is already processed
	if request.Status != "pending" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Request is already processed"})
		return
	}

	// Update the request status
	request.Status = approvalReq.Status
	if err := database.DB.Save(&request).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update request"})
		return
	}

	c.JSON(http.StatusOK, request)
}
