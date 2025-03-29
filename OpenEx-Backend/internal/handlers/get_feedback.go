package handlers

import (
	"fmt"
	"net/http"
	"net/smtp"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

// FeedbackRequest defines the structure for incoming feedback data
type FeedbackRequest struct {
	Subject     string `json:"subject" binding:"required"`
	Message     string `json:"message" binding:"required"`
	Rating      int    `json:"rating" binding:"required,min=1,max=5"`
	Category    string `json:"category" binding:"required"`
	ContactBack bool   `json:"contact_back"`
	// Name and Email removed from struct for complete anonymity
}

// GetFeedback handles user feedback submissions
func GetFeedback(c *gin.Context) {
	var req FeedbackRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Format the feedback email content
	feedbackContent := fmt.Sprintf(`
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h1 style="color: #4a6ee0;">OpenEx Anonymous User Feedback</h1>
    <table style="border-collapse: collapse; width: 100%%; margin-bottom: 20px;">
        <tr style="background-color: #f2f2f2;">
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Field</th>
            <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Value</th>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Subject</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Category</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Rating</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">%d/5</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Feedback Type</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">Anonymous</td>
        </tr>
        <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Contact Back</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">Not possible (anonymous)</td>
        </tr>
        <tr style="background-color: #f2f2f2;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Time</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">%s</td>
        </tr>
    </table>
    
    <h2 style="color: #4a6ee0;">Message:</h2>
    <div style="padding: 15px; background-color: #f9f9f9; border-left: 5px solid #4a6ee0; margin-bottom: 20px;">
        %s
    </div>
    
    <p style="color: #888; font-size: 12px;">This anonymous feedback was submitted through the OpenEx platform.</p>
</body>
</html>
`, req.Subject, req.Category, req.Rating, time.Now().Format("January 2, 2006 at 3:04 PM"), req.Message)

	// Get email credentials from environment variables
	from := os.Getenv("EMAIL_FROM")
	password := os.Getenv("EMAIL_PASSWORD")
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")

	// Email subject
	emailSubject := fmt.Sprintf("OpenEx Anonymous Feedback: %s", req.Subject)

	// Destination email
	to := os.Getenv("EMAIL_SEND")

	// Message composition
	message := []byte(fmt.Sprintf("To: %s\r\n"+
		"Subject: %s\r\n"+
		"MIME-Version: 1.0\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n"+
		"%s\r\n", to, emailSubject, feedbackContent))

	// Authentication
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Sending email
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, message)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send feedback. Please try again later."})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Thank you for your feedback! It has been sent anonymously.",
		"received_at": time.Now(),
	})
}
