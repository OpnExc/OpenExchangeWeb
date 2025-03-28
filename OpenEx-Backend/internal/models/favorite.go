package models

import (
	"time"
)

type Favorite struct {
	ID        uint `gorm:"primaryKey"`
	UserID    uint `gorm:"not null"`
	User      User `gorm:"foreignKey:UserID"`
	ItemID    uint `gorm:"not null"`
	Item      Item `gorm:"foreignKey:ItemID"`
	CreatedAt time.Time
}
