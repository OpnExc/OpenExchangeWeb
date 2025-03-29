package handlers

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"time"

	"OpenEx-Backend/internal/database"
	"OpenEx-Backend/internal/models"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// SignupRequest is the request payload for signup
type SignupRequest struct {
	Name           string `json:"name" binding:"required"`
	Email          string `json:"email" binding:"required"`
	Password       string `json:"password" binding:"required"`
	ContactDetails string `json:"contact_details" binding:"required"`
	HostelID       uint   `json:"hostel_id" binding:"required"`
}

// LoginRequest is the request payload for login
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// GoogleAuthRequest is the request payload for Google authentication
type GoogleAuthRequest struct {
	Token   string `json:"token" binding:"required"`
	Email   string `json:"email" binding:"required"`
	Name    string `json:"name" binding:"required"`
	Picture string `json:"picture"`
}

// Signup handles user registration
func Signup(c *gin.Context) {
	// Log the raw request body for debugging
	body, _ := ioutil.ReadAll(c.Request.Body)
	c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(body))
	fmt.Printf("Signup request body: %s\n", string(body))

	var req SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		fmt.Printf("Error binding JSON: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Log the parsed request
	fmt.Printf("Parsed request: %+v\n", req)

	// Ensure required fields are present
	if req.Name == "" || req.Email == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Name, email, and password are required"})
		return
	}

	// Make sure the hostel ID is valid
	var hostel models.Hostel
	if err := database.DB.First(&hostel, req.HostelID).Error; err != nil {
		fmt.Printf("Error finding hostel: %v\n", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Hostel not found"})
		return
	}

	// Check if email already exists
	var existingUser models.User
	result := database.DB.Where("email = ?", req.Email).First(&existingUser)
	if result.RowsAffected > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		fmt.Printf("Error hashing password: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := models.User{
		Name:           req.Name,
		Email:          req.Email,
		Password:       string(hashedPassword),
		ContactDetails: req.ContactDetails,
		HostelID:       req.HostelID,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		fmt.Printf("Error creating user: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user: " + err.Error()})
		return
	}

	// Return the user (excluding password)
	user.Password = ""
	c.JSON(http.StatusCreated, user)
}

// Login handles user authentication
func Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := database.DB.Where("email = ?", req.Email).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": tokenString})
}

// GoogleAuth handles authentication with Google
func GoogleAuth(c *gin.Context) {
	var req GoogleAuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify the token with Google
	resp, err := http.Get("https://oauth2.googleapis.com/tokeninfo?id_token=" + req.Token)
	if err != nil || resp.StatusCode != http.StatusOK {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Google token"})
		return
	}
	defer resp.Body.Close()

	// Look for existing user
	var user models.User
	result := database.DB.Where("email = ?", req.Email).First(&user)

	// If user doesn't exist, create a new one
	if result.Error != nil {
		// Find the default hostel
		var defaultHostel models.Hostel
		if err := database.DB.First(&defaultHostel).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Default hostel not found"})
			return
		}

		// Generate a random password since Google auth doesn't provide one
		randomPassword := fmt.Sprintf("%d", time.Now().UnixNano())
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(randomPassword), bcrypt.DefaultCost)

		user = models.User{
			Name:           req.Name,
			Email:          req.Email,
			Password:       string(hashedPassword),
			ContactDetails: req.Email, // Use email as contact details initially
			HostelID:       defaultHostel.ID,
		}

		if err := database.DB.Create(&user).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
			return
		}
	}

	// Generate a JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"exp":     time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"user": gin.H{
			"id":    user.ID,
			"name":  user.Name,
			"email": user.Email,
			"role":  user.Role,
		},
	})
}
