package models

import (
    "time"
)

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