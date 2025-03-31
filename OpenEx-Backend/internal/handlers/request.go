package handlers

import (
	"OpenEx-Backend/internal/database"
	"OpenEx-Backend/internal/models"
	"OpenEx-Backend/internal/services/email"
	"fmt"
	"log"
	"net/http"
	"strings"

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

	// Check if user has valid contact details (not empty and not an email)
	if user.ContactDetails == "" || strings.Contains(user.ContactDetails, "@") {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Please update your phone number in contact details before making a transaction"})
		return
	}

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

	if err := database.DB.Create(&tr).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
		return
	}

	// Find seller details to send email notification
	var seller models.User
	if err := database.DB.First(&seller, tr.SellerID).Error; err != nil {
		// Log error but don't fail the request
		log.Printf("Error finding seller details: %v", err)
	} else {
		// Send email notification to seller
		go sendSellerNotificationEmail(seller, user, item, tr)
	}

	c.JSON(http.StatusCreated, tr)
}

// Helper function to send notification email to seller
func sendSellerNotificationEmail(seller, buyer models.User, item models.Item, request models.TransactionRequest) {
	// Create email content
	requestType := "purchase"
	if request.Type == "exchange" {
		requestType = "exchange"
	}

	dateFormatted := request.CreatedAt.Format("January 2, 2006 at 3:04 PM")

	// Email subject
	subject := fmt.Sprintf("New Item %s Request: %s", requestType, item.Title)

	// Create HTML content for email
	htmlContent := fmt.Sprintf(`
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h1 style="color: #4a6ee0; margin: 0;">New Item Request!</h1>
        <p style="margin-top: 5px; color: #777;">Someone wants your item on OpenEx</p>
    </div>
    
    <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; border: 1px solid #eee;">
        <h2 style="color: #333; margin-top: 0;">Request Details</h2>
        
        <table style="width: 100%%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%%;"><strong>Item:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Price:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">₹%.2f</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Request Type:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Buyer:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Request Date:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
            </tr>
        </table>
        
        <p>Please log in to your OpenEx account to approve or reject this request. Once approved, you'll be able to see the buyer's contact information to arrange the transaction.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/app/buyrequests" style="background-color: #4a6ee0; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Request Details</a>
        </div>
        
        <p style="color: #777; font-size: 0.9em;">If you didn't list this item for sale, please ignore this email.</p>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #777; font-size: 0.8em;">
        <p>This is an automated message from OpenEx.</p>
    </div>
</body>
</html>
`, item.Title, item.Price, requestType, buyer.Name, dateFormatted)

	// Send the email
	if err := email.SendEmail(seller.Email, subject, htmlContent); err != nil {
		log.Printf("Error sending request notification email to seller: %v", err)
	} else {
		log.Printf("Request notification email sent to seller: %s", seller.Email)
	}
}

// ListRequests returns all transaction requests for the authenticated user
func ListRequests(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var requests []models.TransactionRequest
	if err := database.DB.Where("buyer_id = ? OR seller_id = ?", user.ID, user.ID).Find(&requests).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve requests"})
		return
	}

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

	// If request was approved, update the item quantity/status
	if approvalReq.Status == "approved" {
		// Get the associated item
		var item models.Item
		if err := database.DB.First(&item, request.ItemID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find associated item"})
			return
		}

		// Update item quantity or status based on remaining quantity
		if item.Quantity > 1 {
			// Decrease quantity by 1
			item.Quantity = item.Quantity - 1
			if err := database.DB.Save(&item).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item quantity"})
				return
			}
		} else {
			// If this is the last or only item, mark it as sold
			item.Status = "sold"
			if err := database.DB.Save(&item).Error; err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update item status"})
				return
			}
		}

		// Get buyer and seller details with contact information
		var buyer models.User
		var seller models.User

		if err := database.DB.Select("id, name, email, contact_details, hostel_id").First(&buyer, request.BuyerID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve buyer details"})
			return
		}

		if err := database.DB.Select("id, name, email, contact_details, hostel_id").First(&seller, request.SellerID).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve seller details"})
			return
		}

		// Get hostel information
		var buyerHostel, sellerHostel models.Hostel
		database.DB.First(&buyerHostel, buyer.HostelID)
		database.DB.First(&sellerHostel, seller.HostelID)

		// Send approval email to buyer with seller's contact
		go sendApprovalEmail(buyer, seller, request, sellerHostel.Name)

		// Return transaction request with contact details and updated item
		c.JSON(http.StatusOK, gin.H{
			"request": request,
			"item": gin.H{
				"id":       item.ID,
				"title":    item.Title,
				"quantity": item.Quantity,
				"status":   item.Status,
			},
			"buyer_contact": gin.H{
				"name":   buyer.Name,
				"email":  buyer.Email,
				"phone":  buyer.ContactDetails,
				"hostel": buyerHostel.Name,
			},
			"seller_contact": gin.H{
				"name":   seller.Name,
				"email":  seller.Email,
				"phone":  seller.ContactDetails,
				"hostel": sellerHostel.Name,
			},
		})
	} else {
		// For rejected requests, just return the updated request
		c.JSON(http.StatusOK, gin.H{
			"request": request,
			"message": "Request has been rejected",
		})
	}
}

// Add a new function to send approval email to buyer
func sendApprovalEmail(buyer, seller models.User, request models.TransactionRequest, sellerHostel string) {
	// Get item details
	var item models.Item
	if err := database.DB.First(&item, request.ItemID).Error; err != nil {
		log.Printf("Error finding item details: %v", err)
		return
	}

	// Email subject
	subject := fmt.Sprintf("Your purchase request for %s has been approved!", item.Title)

	// Create HTML content for email
	htmlContent := fmt.Sprintf(`
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h1 style="color: #4a6ee0; margin: 0;">Purchase Request Approved!</h1>
        <p style="margin-top: 5px; color: #777;">The seller has approved your request</p>
    </div>
    
    <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; border: 1px solid #eee;">
        <h2 style="color: #333; margin-top: 0;">Transaction Details</h2>
        
        <table style="width: 100%%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%%;"><strong>Item:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Price:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">₹%.2f</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Quantity:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%d</td>
            </tr>
        </table>
        
        <h3 style="color: #4a6ee0;">Seller Contact Details</h3>
        <table style="width: 100%%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee; width: 30%%;"><strong>Name:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Phone:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
            </tr>
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Hostel:</strong></td>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
            </tr>
        </table>
        
        <p>You can now contact the seller directly to arrange the exchange. Please be respectful and follow the campus guidelines.</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/app/orders/history?from=email" style="background-color: #4a6ee0; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Order Details</a>
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 20px; color: #777; font-size: 0.8em;">
        <p>This is an automated message from OpenEx.</p>
    </div>
</body>
</html>
`, item.Title, item.Price, item.Quantity, seller.Name, seller.Email, seller.ContactDetails, sellerHostel)

	// Send the email
	if err := email.SendEmail(buyer.Email, subject, htmlContent); err != nil {
		log.Printf("Error sending approval notification email to buyer: %v", err)
	} else {
		log.Printf("Approval notification email with seller contact details sent to buyer: %s", buyer.Email)
	}
}
