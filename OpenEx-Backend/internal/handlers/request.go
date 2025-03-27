package handlers

import (
    "net/http"

    "github.com/gin-gonic/gin"
    "OpenEx-Backend/internal/database"
    "OpenEx-Backend/internal/models"
)

// Request is the request payload for creating a transaction request
type Request struct {
    ItemID        uint   `json:"item_id" binding:"required"`
    OfferedItemID *uint  `json:"offered_item_id"`
    Type          string `json:"type" binding:"required,oneof=buy exchange"`
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

// ApproveRequest approves a transaction request
func ApproveRequest(c *gin.Context) {
    user := c.MustGet("user").(models.User)
    var tr models.TransactionRequest
    database.DB.Preload("Seller").Preload("Buyer").First(&tr, c.Param("id"))

    if tr.SellerID != user.ID {
        c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
        return
    }

    tr.Status = "approved"
    database.DB.Save(&tr)

    c.JSON(http.StatusOK, gin.H{
        "request":        tr,
        "seller_contact": tr.Seller.ContactDetails,
        "buyer_contact":  tr.Buyer.ContactDetails,
    })
}