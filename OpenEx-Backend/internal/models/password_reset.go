package models

import (
	"time"
)

type PasswordReset struct {
	ID        uint      `gorm:"primaryKey"`
    UserID    uint      `gorm:"not null"`
    User      User      `gorm:"foreignKey:UserID"`
    Token     string    `gorm:"not null;unique"`
    ExpiresAt time.Time `gorm:"not null"`
    Used      bool      `gorm:"default:false"`
    CreatedAt time.Time
    UpdatedAt time.Time
}