package models

import (
	"time"
)

type ServiceRequest struct {
	ID          uint   `gorm:"primaryKey"`
	RequesterID uint   `gorm:"not null"`
	Requester   User   `gorm:"foreignKey:RequesterID"`
	HostelID    uint   `gorm:"not null"`
	Hostel      Hostel `gorm:"foreignKey:HostelID"`
	Title       string `gorm:"not null"`
	Description string `gorm:"not null"`
	Budget      float64
	Category    string `gorm:"not null"` // e.g., "notes", "tutoring", "project"
	Status      string `gorm:"default:'open'"`
	ProviderID  *uint
	Provider    User `gorm:"foreignKey:ProviderID"`
	AcceptedAt  *time.Time
	CompletedAt *time.Time
	CreatedAt   time.Time
	UpdatedAt   time.Time
}
