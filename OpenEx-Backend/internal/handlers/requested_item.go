package handlers

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"OpenEx-Backend/internal/database"
	"OpenEx-Backend/internal/models"
	"OpenEx-Backend/internal/services/email"

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
	Quantity        int     `json:"quantity"`
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

	// Validate quantity
	if req.Quantity <= 0 {
		// Set default quantity to 1
		req.Quantity = 1
	} else if req.Quantity > 100 {
		// Add a reasonable upper limit to prevent errors
		c.JSON(http.StatusBadRequest, gin.H{"error": "Quantity cannot exceed 100"})
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
		Quantity:    req.Quantity,
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

	// Get the buyer details
	var buyer models.User
	if err := database.DB.First(&buyer, requestedItem.BuyerID).Error; err != nil {
		log.Printf("Error finding buyer details: %v", err)
	} else {
		// Send email notification to buyer
		go sendRequestFulfilledEmail(buyer, user, item, tr, requestedItem)
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Request fulfilled successfully",
		"item":    item,
		"request": tr,
	})
}

// Helper function to send notification email to buyer when their request is fulfilled
func sendRequestFulfilledEmail(buyer, seller models.User, item models.Item, request models.TransactionRequest, requestedItem models.RequestedItem) {
	// Email subject
	subject := fmt.Sprintf("Your Request Has Been Fulfilled: %s", requestedItem.Title)

	// Create HTML content for email
	htmlContent := fmt.Sprintf(`
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h1 style="color: #4a6ee0; margin: 0;">Your Request Has Been Fulfilled!</h1>
        <p style="margin-top: 5px; color: #777;">Someone is offering exactly what you're looking for</p>
    </div>
    
    <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; border: 1px solid #eee;">
        <h2 style="color: #333; margin-top: 0;">Request Details</h2>
        
        <table style="width: 100%%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%%;"><strong>Your Request:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Offered Price:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">₹%.2f</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Quantity:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%d</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Seller:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Fulfilled Date:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
            </tr>
        </table>
        
        <p>Please log in to your OpenEx account to view the offer and approve the transaction if you'd like to proceed. Once approved, you'll be able to see the seller's contact information.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/app/orders/history?from=email" style="background-color: #4a6ee0; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Order History</a>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #777; font-size: 0.8em;">
        <p>This is an automated message from OpenEx.</p>
    </div>
</body>
</html>
`, requestedItem.Title, item.Price, item.Quantity, seller.Name, time.Now().Format("January 2, 2006 at 3:04 PM"))

	// Send the email
	if err := email.SendEmail(buyer.Email, subject, htmlContent); err != nil {
		log.Printf("Error sending fulfillment notification email to buyer: %v", err)
	} else {
		log.Printf("Fulfillment notification email sent to buyer: %s", buyer.Email)
	}
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
