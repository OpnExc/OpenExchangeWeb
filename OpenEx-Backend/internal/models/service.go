package models

import (
	"time"
)

type Service struct {
	ID          uint   `gorm:"primaryKey"`
	UserID      uint   `gorm:"not null"`
	User        User   `gorm:"foreignKey:UserID"`
	HostelID    uint   `gorm:"not null"`
	Hostel      Hostel `gorm:"foreignKey:HostelID"`
	Title       string `gorm:"not null"`
	Description string `gorm:"not null"`
	Price       float64
	Category    string `gorm:"not null"` // e.g., "notes", "tutoring", "project"
	Status      string `gorm:"default:'pending'"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
