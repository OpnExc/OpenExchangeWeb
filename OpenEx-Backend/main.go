package main

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

// Models
type User struct {
	ID             uint   `gorm:"primaryKey"`
	Name           string `gorm:"not null"`
	Email          string `gorm:"unique;not null"`
	Password       string `gorm:"not null"`
	ContactDetails string `gorm:"not null"`
	Role           string `gorm:"default:'user'"`
	HostelID       uint
	Hostel         Hostel `gorm:"foreignKey:HostelID"`
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

type Hostel struct {
	ID        uint   `gorm:"primaryKey"`
	Name      string `gorm:"unique;not null"`
	CreatedAt time.Time
	UpdatedAt time.Time
}

type Item struct {
	ID          uint   `gorm:"primaryKey"`
	UserID      uint   `gorm:"not null"`
	User        User   `gorm:"foreignKey:UserID"`
	HostelID    uint   `gorm:"not null"`
	Hostel      Hostel `gorm:"foreignKey:HostelID"`
	Title       string `gorm:"not null"`
	Description string `gorm:"not null"`
	Price       float64
	Image       string
	Status      string `gorm:"default:'pending'"`
	Type        string `gorm:"not null"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type TransactionRequest struct {
	ID            uint `gorm:"primaryKey"`
	BuyerID       uint `gorm:"not null"`
	Buyer         User `gorm:"foreignKey:BuyerID"`
	SellerID      uint `gorm:"not null"`
	Seller        User `gorm:"foreignKey:SellerID"`
	ItemID        uint `gorm:"not null"`
	Item          Item `gorm:"foreignKey:ItemID"`
	OfferedItemID *uint
	OfferedItem   Item   `gorm:"foreignKey:OfferedItemID"`
	Status        string `gorm:"default:'pending'"`
	Type          string `gorm:"not null"`
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		fmt.Println("Warning: Error loading .env file:", err)
	}

	// Initialize database
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)

	var err error
	db, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&User{}, &Hostel{}, &Item{}, &TransactionRequest{})

	// Check if any hostels exist, if not, create FRF hostel
	var hostelCount int64
	db.Model(&Hostel{}).Count(&hostelCount)
	if hostelCount == 0 {
		defaultHostel := Hostel{
			Name: "FRF",
		}
		db.Create(&defaultHostel)
		fmt.Println("Created default hostel: FRF")
	}

	// Set up router
	r := gin.Default()

	// Add CORS middleware
	// In your main.go, replace the existing CORS middleware:
	// Add CORS middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400") // 24 hours

		// Handle preflight requests
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})
	// Public routes
	// Public routes
	r.POST("/signup", signup)
	r.POST("/login", login)
	r.POST("/google-auth", googleAuth)
	r.GET("/hostels", listHostels)
	r.GET("/hostels/:id/items", listItemsByHostel)

	// Authenticated routes
	auth := r.Group("/")
	auth.Use(AuthMiddleware())
	{
		auth.POST("/items", createItem)
		auth.GET("/items/:id", getItem)
		auth.POST("/requests", createRequest)
		auth.GET("/requests", listRequests)
		auth.PATCH("/requests/:id/approve", approveRequest)
		auth.GET("/my-items", getUserItems)
		auth.GET("/user", getUserDetails)
		auth.PATCH("/user", editUserDetails)

	}

	// Admin routes
	admin := auth.Group("/admin")
	admin.Use(AdminMiddleware())
	{
		admin.GET("/items", listPendingItems)
		admin.PATCH("/items/:id/approve", approveItem)
		admin.PATCH("/items/:id/reject", rejectItem)
		admin.POST("/hostels", createHostel)
	}

	r.Run(":8080")
}

// Middleware
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenString := c.GetHeader("Authorization")
		if tokenString == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Authorization header required"})
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return []byte(os.Getenv("JWT_SECRET")), nil
		})

		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			return
		}

		var user User
		db.First(&user, uint(claims["user_id"].(float64)))
		c.Set("user", user)
		c.Next()
	}
}
func getUserDetails(c *gin.Context) {
    user := c.MustGet("user").(User) // Retrieve the authenticated user from the context

    // Fetch the user details from the database
    var userDetails User
    if err := db.Preload("Hostel").First(&userDetails, user.ID).Error; err != nil {
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

func editUserDetails(c *gin.Context) {
    user := c.MustGet("user").(User) // Retrieve the authenticated user from the context

    // Define the request structure
    type EditUserRequest struct {
        Name           string `json:"name" binding:"required"`
        ContactDetails string `json:"contact_details" binding:"required"`
    }

    var req EditUserRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    // Update the user details
    user.Name = req.Name
    user.ContactDetails = req.ContactDetails

    if err := db.Save(&user).Error; err != nil {
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

func AdminMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		user := c.MustGet("user").(User)
		if user.Role != "admin" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
			return
		}
		c.Next()
	}
}

// Handlers
func signup(c *gin.Context) {
	type SignupRequest struct {
		Name           string `json:"name" binding:"required"`
		Email          string `json:"email" binding:"required,email"`
		Password       string `json:"password" binding:"required,min=6"`
		ContactDetails string `json:"contact_details" binding:"required"`
		HostelID       uint   `json:"hostel_id" binding:"required"`
	}

	var req SignupRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var hostel Hostel
	if err := db.First(&hostel, req.HostelID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Hostel not found"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	user := User{
		Name:           req.Name,
		Email:          req.Email,
		Password:       string(hashedPassword),
		ContactDetails: req.ContactDetails,
		HostelID:       req.HostelID,
	}
	fmt.Printf("Attempting to create user: %+v\n", user)
	if err := db.Create(&user).Error; err != nil {
		c.JSON(http.StatusConflict, gin.H{"error": "Email already exists"})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func login(c *gin.Context) {
	type LoginRequest struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user User
	if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
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
func googleAuth(c *gin.Context) {
	type GoogleAuthRequest struct {
		Token   string `json:"token" binding:"required"`
		Email   string `json:"email" binding:"required"`
		Name    string `json:"name" binding:"required"`
		Picture string `json:"picture"`
	}

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
	var user User
	result := db.Where("email = ?", req.Email).First(&user)

	// If user doesn't exist, create a new one
	if result.Error != nil {
		// Find the default hostel
		var defaultHostel Hostel
		if err := db.First(&defaultHostel).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Default hostel not found"})
			return
		}

		// Generate a random password since Google auth doesn't provide one
		randomPassword := fmt.Sprintf("%d", time.Now().UnixNano())
		hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(randomPassword), bcrypt.DefaultCost)

		user = User{
			Name:           req.Name,
			Email:          req.Email,
			Password:       string(hashedPassword),
			ContactDetails: req.Email, // Use email as contact details initially
			HostelID:       defaultHostel.ID,
		}

		if err := db.Create(&user).Error; err != nil {
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

func listHostels(c *gin.Context) {
	var hostels []Hostel
	db.Find(&hostels)
	c.JSON(http.StatusOK, hostels)
}

// Line 551 in main.go should be updated to:
func listItemsByHostel(c *gin.Context) {
	var items []Item

	// Get all approved items without filtering by hostel
	db.Where("status = ?", "approved").
		Preload("User").
		Preload("Hostel").
		Find(&items)

	// Map the data to include seller and hostel names
	var enrichedItems []gin.H
	for _, item := range items {
		enrichedItems = append(enrichedItems, gin.H{
			"ID":          item.ID,
			"Title":       item.Title,
			"Description": item.Description,
			"Price":       item.Price,
			"Image":       item.Image,
			"Type":        item.Type,
			"Status":      item.Status,
			"CreatedAt":   item.CreatedAt,
			"seller":      item.User.Name,
			"hostel":      item.Hostel.Name,
			"UserId":      item.UserID,
			"HostelId":    item.HostelID,
		})
	}

	c.JSON(http.StatusOK, enrichedItems)
}
func createItem(c *gin.Context) {
	user := c.MustGet("user").(User)

	type ItemRequest struct {
		Title       string  `json:"title" binding:"required"`
		Description string  `json:"description" binding:"required"`
		Price       float64 `json:"price"`
		Image       string  `json:"image"`
		Type        string  `json:"type" binding:"required,oneof=sell exchange"`
	}

	var req ItemRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	item := Item{
		UserID:      user.ID,
		HostelID:    user.HostelID,
		Title:       req.Title,
		Description: req.Description,
		Price:       req.Price,
		Image:       req.Image,
		Type:        req.Type,
	}

	db.Create(&item)
	c.JSON(http.StatusCreated, item)
}

func listPendingItems(c *gin.Context) {
	var items []Item
	db.Where("status = 'pending'").Find(&items)
	c.JSON(http.StatusOK, items)
}

func approveItem(c *gin.Context) {
	var item Item
	db.First(&item, c.Param("id"))
	item.Status = "approved"
	db.Save(&item)
	c.JSON(http.StatusOK, item)
}

func rejectItem(c *gin.Context) {
	var item Item
	db.First(&item, c.Param("id"))
	item.Status = "rejected"
	db.Save(&item)
	c.JSON(http.StatusOK, item)
}

func createRequest(c *gin.Context) {
	user := c.MustGet("user").(User)

	type Request struct {
		ItemID        uint   `json:"item_id" binding:"required"`
		OfferedItemID *uint  `json:"offered_item_id"`
		Type          string `json:"type" binding:"required,oneof=buy exchange"`
	}

	var req Request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var item Item
	if err := db.Preload("User").First(&item, req.ItemID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item not found"})
		return
	}

	if item.Status != "approved" || item.UserID == user.ID {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	tr := TransactionRequest{
		BuyerID:       user.ID,
		SellerID:      item.User.ID,
		ItemID:        item.ID,
		OfferedItemID: req.OfferedItemID,
		Type:          req.Type,
	}

	db.Create(&tr)
	c.JSON(http.StatusCreated, tr)
}

func listRequests(c *gin.Context) {
	user := c.MustGet("user").(User)
	var requests []TransactionRequest
	db.Preload("Item").Preload("OfferedItem").
		Where("buyer_id = ? OR seller_id = ?", user.ID, user.ID).
		Find(&requests)
	c.JSON(http.StatusOK, requests)
}

func approveRequest(c *gin.Context) {
	user := c.MustGet("user").(User)
	var tr TransactionRequest
	db.Preload("Seller").Preload("Buyer").First(&tr, c.Param("id"))

	if tr.SellerID != user.ID {
		c.JSON(http.StatusForbidden, gin.H{"error": "Unauthorized"})
		return
	}

	tr.Status = "approved"
	db.Save(&tr)

	c.JSON(http.StatusOK, gin.H{
		"request":        tr,
		"seller_contact": tr.Seller.ContactDetails,
		"buyer_contact":  tr.Buyer.ContactDetails,
	})
}

func getItem(c *gin.Context) {
	var item Item
	db.First(&item, c.Param("id"))
	c.JSON(http.StatusOK, item)
}

func getUserItems(c *gin.Context) {
	user := c.MustGet("user").(User)
	var items []Item
	db.Where("user_id = ?", user.ID).Find(&items)
	c.JSON(http.StatusOK, items)
}

// Add this new handler function
func createHostel(c *gin.Context) {
	type HostelRequest struct {
		Name string `json:"name" binding:"required"`
	}

	var req HostelRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if hostel with same name already exists
	var existingHostel Hostel
	if db.Where("name = ?", req.Name).First(&existingHostel).RowsAffected > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "Hostel with this name already exists"})
		return
	}

	hostel := Hostel{
		Name: req.Name,
	}

	db.Create(&hostel)
	c.JSON(http.StatusCreated, hostel)
}

// In signup function
type SignupRequest struct {
	Name           string `json:"name" binding:"required"`
	Email          string `json:"email" binding:"required,email"`
	Password       string `json:"password" binding:"required,min=6"`
	ContactDetails string `json:"contact_details" binding:"required"`
	HostelID       uint   `json:"hostel_id" binding:"required"`
}

// In login function
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// In googleAuth function
type GoogleAuthRequest struct {
	Token   string `json:"token" binding:"required"`
	Email   string `json:"email" binding:"required"`
	Name    string `json:"name" binding:"required"`
	Picture string `json:"picture"`
}

// In createItem function
type ItemRequest struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description" binding:"required"`
	Price       float64 `json:"price"`
	Image       string  `json:"image"`
	Type        string  `json:"type" binding:"required,oneof=sell exchange"`
}

// In createRequest function
type Request struct {
	ItemID        uint   `json:"item_id" binding:"required"`
	OfferedItemID *uint  `json:"offered_item_id"`
	Type          string `json:"type" binding:"required,oneof=buy exchange"`
}

// In createHostel function
type HostelRequest struct {
	Name string `json:"name" binding:"required"`
}
