package routes

import (
    "github.com/gin-gonic/gin"
    "OpenEx-Backend/internal/handlers"
    "OpenEx-Backend/internal/middleware"
)

// SetupRouter configures all the routes for the application
func SetupRouter() *gin.Engine {
    r := gin.Default()

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
    r.POST("/signup", handlers.Signup)
    r.POST("/login", handlers.Login)
    r.POST("/google-auth", handlers.GoogleAuth)
    r.GET("/hostels", handlers.ListHostels)
    r.GET("/hostels/:id/items", handlers.ListItemsByHostel)

    // Authenticated routes
    auth := r.Group("/")
    auth.Use(middleware.Auth())
    {
        auth.POST("/items", handlers.CreateItem)
        auth.GET("/items/:id", handlers.GetItem)
        auth.POST("/requests", handlers.CreateRequest)
        auth.GET("/requests", handlers.ListRequests)
        auth.PATCH("/requests/:id/approve", handlers.ApproveRequest)
        auth.GET("/my-items", handlers.GetUserItems)
        auth.GET("/user", handlers.GetUserDetails)
        auth.PATCH("/user", handlers.EditUserDetails)
    }

    // Admin routes
    admin := auth.Group("/admin")
    admin.Use(middleware.Admin())
    {
        admin.GET("/items", handlers.ListPendingItems)
        admin.PATCH("/items/:id/approve", handlers.ApproveItem)
        admin.PATCH("/items/:id/reject", handlers.RejectItem)
        admin.POST("/hostels", handlers.CreateHostel)
    }

    return r
}