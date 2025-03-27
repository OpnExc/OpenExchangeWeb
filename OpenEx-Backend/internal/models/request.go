package models

import (
    "time"
)

type TransactionRequest struct {
    ID            uint `gorm:"primaryKey"`
    BuyerID       uint `gorm:"not null"`
    Buyer         User `gorm:"foreignKey:BuyerID"`
    SellerID      uint `gorm:"not null"`
    Seller        User `gorm:"foreignKey:SellerID"`
    ItemID        uint `gorm:"not null"`
    Item          Item `gorm:"foreignKey:ItemID"`
    OfferedItemID *uint
    OfferedItem   Item   `gorm:"foreignKey:OfferedItemID"`
    Status        string `gorm:"default:'pending'"`
    Type          string `gorm:"not null"`
    CreatedAt     time.Time
    UpdatedAt     time.Time
}