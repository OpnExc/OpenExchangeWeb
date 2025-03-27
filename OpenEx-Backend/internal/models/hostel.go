package models

import (
    "time"
)

type Hostel struct {
    ID        uint   `gorm:"primaryKey"`
    Name      string `gorm:"unique;not null"`
    CreatedAt time.Time
    UpdatedAt time.Time
}