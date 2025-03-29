package handlers

import (
	"OpenEx-Backend/internal/database"
	"OpenEx-Backend/internal/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

// GetBuyerOrderHistory returns all transaction requests where the authenticated user is the buyer
func GetBuyerOrderHistory(c *gin.Context) {
	user := c.MustGet("user").(models.User)

	var orders []struct {
		models.TransactionRequest
		ItemTitle       string    `json:"item_title"`
		ItemDescription string    `json:"item_description"`
		ItemPrice       float64   `json:"item_price"`
		ItemImage       string    `json:"item_image"`
		SellerName      string    `json:"seller_name"`
		SellerEmail     string    `json:"seller_email"`
		SellerPhone     string    `json:"seller_phone"`
		SellerHostel    string    `json:"seller_hostel"`
		OrderDate       time.Time `json:"order_date"`
	}

	// Use a join query to get item and seller details in one go
	query := `
        SELECT 
            tr.*,
            i.title as item_title, 
            i.description as item_description,
            i.price as item_price,
            i.image as item_image,
            u.name as seller_name,
            u.email as seller_email,
            u.phone as seller_phone,
            h.name as seller_hostel,
            tr.created_at as order_date
        FROM transaction_requests tr
        JOIN items i ON tr.item_id = i.id
        JOIN users u ON tr.seller_id = u.id
        JOIN hostels h ON u.hostel_id = h.id
        WHERE tr.buyer_id = ? 
        ORDER BY tr.created_at DESC`

	if err := database.DB.Raw(query, user.ID).Scan(&orders).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve order history"})
		return
	}

	// Hide contact details for non-approved orders
	for i := range orders {
		if orders[i].Status != "approved" {
			orders[i].SellerEmail = ""
			orders[i].SellerPhone = ""
		}
	}

	c.JSON(http.StatusOK, orders)
}
