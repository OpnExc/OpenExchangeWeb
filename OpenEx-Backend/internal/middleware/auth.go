package middleware

import (
    "fmt"
    "net/http"
    "os"

    "github.com/gin-gonic/gin"
    "github.com/golang-jwt/jwt/v5"
    "OpenEx-Backend/internal/database"
    "OpenEx-Backend/internal/models"
)

// Auth middleware for authenticating requests
func Auth() gin.HandlerFunc {
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

        var user models.User
        database.DB.First(&user, uint(claims["user_id"].(float64)))
        c.Set("user", user)
        c.Next()
    }
}

// Admin middleware for admin-only routes
func Admin() gin.HandlerFunc {
    return func(c *gin.Context) {
        user := c.MustGet("user").(models.User)
        if user.Role != "admin" {
            c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Admin access required"})
            return
        }
        c.Next()
    }
}