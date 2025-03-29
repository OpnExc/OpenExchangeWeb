package email

import (
	"fmt"
	"net/smtp"
	"os"
)

// SendEmail sends an email with the given subject and HTML body to the recipient
func SendEmail(to, subject, htmlContent string) error {
	// Get email credentials from environment variables
	from := os.Getenv("EMAIL_FROM")
	password := os.Getenv("EMAIL_PASSWORD")
	smtpHost := os.Getenv("SMTP_HOST")
	smtpPort := os.Getenv("SMTP_PORT")

	// Message composition
	message := []byte(fmt.Sprintf("To: %s\r\n"+
		"Subject: %s\r\n"+
		"MIME-Version: 1.0\r\n"+
		"Content-Type: text/html; charset=UTF-8\r\n"+
		"\r\n"+
		"%s\r\n", to, subject, htmlContent))

	// Authentication
	auth := smtp.PlainAuth("", from, password, smtpHost)

	// Sending email
	return smtp.SendMail(smtpHost+":"+smtpPort, auth, from, []string{to}, message)
}
