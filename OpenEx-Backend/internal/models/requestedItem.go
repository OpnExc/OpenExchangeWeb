package models

import (
	"time"
)

type RequestedItem struct {
	ID          uint   `gorm:"primaryKey"`
	BuyerID     uint   `gorm:"not null"`
	Buyer       User   `gorm:"foreignKey:BuyerID"`
	HostelID    uint   `gorm:"not null"`
	Hostel      Hostel `gorm:"foreignKey:HostelID"`
	Title       string `gorm:"not null"`
	Description string `gorm:"not null"`
	MaxPrice    float64
	Quantity    int    `gorm:"default:1"`      // Add Quantity field
	Status      string `gorm:"default:'open'"` // open, fulfilled, closed
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
