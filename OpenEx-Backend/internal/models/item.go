package models

import (
	"time"
)

type Item struct {
	ID          uint   `gorm:"primaryKey"`
	Title       string `gorm:"not null"`
	Description string `gorm:"not null"`
	Price       float64
	Image       string
	Type        string `gorm:"not null"`
	Status      string `gorm:"default:'pending'"`
	Quantity    int    `gorm:"default:1"`
	UserID      uint   `gorm:"not null"`
	User        User
	HostelID    uint   `gorm:"not null"`
	Hostel      Hostel `gorm:"foreignKey:HostelID"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
