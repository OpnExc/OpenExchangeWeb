package config

import (
    "fmt"
    "os"

    "github.com/joho/godotenv"
)

type Config struct {
    DBUser     string
    DBPassword string
    DBHost     string
    DBPort     string
    DBName     string
    JWTSecret  string
    ServerPort string
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
    if err := godotenv.Load(); err != nil {
        fmt.Println("Warning: Error loading .env file:", err)
        // Continue anyway, we might have environment variables set elsewhere
    }

    config := &Config{
        DBUser:     getEnv("DB_USER", ""),
        DBPassword: getEnv("DB_PASSWORD", ""),
        DBHost:     getEnv("DB_HOST", "localhost"),
        DBPort:     getEnv("DB_PORT", "3306"),
        DBName:     getEnv("DB_NAME", ""),
        JWTSecret:  getEnv("JWT_SECRET", "your-secret-key"),
        ServerPort: getEnv("SERVER_PORT", "8080"),
    }

    return config, nil
}

// GetDSN returns the database connection string
func (c *Config) GetDSN() string {
    return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
        c.DBUser, c.DBPassword, c.DBHost, c.DBPort, c.DBName)
}

// Helper function to get environment variable with fallback
func getEnv(key, fallback string) string {
    if value, exists := os.LookupEnv(key); exists {
        return value
    }
    return fallback
}