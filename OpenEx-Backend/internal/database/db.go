package database

import (
	"log"

	"OpenEx-Backend/internal/models"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

// Initialize sets up the database connection
func Initialize(dsn string) error {
	var err error
	DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	// AutoMigrate models
	err = DB.AutoMigrate(
		&models.User{},
		&models.Hostel{},
		&models.Item{},
		&models.TransactionRequest{},
		&models.RequestedItem{}, 
	)
	if err != nil {
		return err
	}

	// Check if any hostels exist, if not, create FRF hostel
	var hostelCount int64
	DB.Model(&models.Hostel{}).Count(&hostelCount)
	if hostelCount == 0 {
		defaultHostel := models.Hostel{
			Name: "FRF",
		}
		DB.Create(&defaultHostel)
		log.Println("Created default hostel: FRF")
	}

	return nil
}
