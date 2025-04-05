package routes

import (
	"OpenEx-Backend/internal/handlers"
	"OpenEx-Backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

// SetupRouter configures all the routes for the application
func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Add CORS middleware
	r.Use(middleware.CorsMiddleware())

	// Public routes
	r.POST("/signup", handlers.Signup)
	r.POST("/login", handlers.Login)
	r.POST("/google-auth", handlers.GoogleAuth)
	r.GET("/hostels", handlers.ListHostels)
	r.GET("/items/all", handlers.ListAllItems)
	r.GET("/hostels/:id/items", handlers.ListItemsByHostel)
	r.GET("/requested-items", handlers.ListRequestedItems)
	r.GET("/services", handlers.ListServices)
	r.GET("/service-requests", handlers.ListServiceRequests)
	r.POST("/forgot-password", handlers.ForgotPassword)
	r.GET("/validate-reset-token", handlers.ValidateResetToken)
	r.POST("/reset-password", handlers.ResetPassword)
	r.POST("/feedback", handlers.GetFeedback)

	// Authenticated routes
	auth := r.Group("/")
	auth.Use(middleware.Auth())
	{
		auth.POST("/items", handlers.CreateItem)
		auth.GET("/items/:id", handlers.GetItem)
		auth.POST("/requests", handlers.CreateRequest)
		auth.GET("/requests", handlers.ListRequests)
		auth.PATCH("/requests/:id/approve", handlers.ApproveRequest)
		auth.GET("/my-items", handlers.GetUserItems)
		auth.GET("/user", handlers.GetUserDetails)
		auth.PATCH("/user", handlers.EditUserDetails)
		auth.POST("/requested-items", handlers.CreateRequestedItem)
		auth.POST("/requested-items/fulfill", handlers.FulfillRequestedItem)
		auth.GET("/my-requested-items", handlers.GetMyRequestedItems)
		auth.PATCH("/requested-items/:id/close", handlers.CloseRequestedItem)

		// Service provider routes
		auth.POST("/services", handlers.CreateService)
		auth.GET("/my-services", handlers.GetMyServices)

		// Service requester routes
		auth.POST("/service-requests", handlers.CreateServiceRequest)
		auth.GET("/my-service-requests", handlers.GetMyServiceRequests)
		auth.PATCH("/service-requests/:id/complete", handlers.CompleteServiceRequest)
		auth.PATCH("/service-requests/:id/cancel", handlers.CancelServiceRequest)

		// Service fulfillment route
		auth.PATCH("/service-requests/:id/accept", handlers.AcceptServiceRequest)
		auth.GET("/service-requests/taken", handlers.GetServiceRequestsITook)

		// Favorites routes
		auth.POST("/favorites", handlers.AddToFavorites)
		auth.DELETE("/favorites/:id", handlers.RemoveFromFavorites)
		auth.GET("/favorites", handlers.ListFavorites)
		auth.GET("/favorites/check/:id", handlers.CheckFavoriteStatus)

		// Orders history route
		auth.GET("/orders/history", handlers.GetBuyerOrderHistory)

		// Contact check route
		auth.GET("/check-contact", handlers.CheckContactDetails)
	}

	// Admin routes
	admin := auth.Group("/admin")
	admin.Use(middleware.Admin())
	{
		admin.GET("/items", handlers.ListPendingItems)
		admin.PATCH("/items/:id/approve", handlers.ApproveItem)
		admin.PATCH("/items/:id/reject", handlers.RejectItem)
		admin.POST("/hostels", handlers.CreateHostel)

		admin.GET("/services", handlers.ListPendingServices)
		admin.PATCH("/services/:id/approve", handlers.ApproveService)
		admin.PATCH("/services/:id/reject", handlers.RejectService)
	}

	return r
}
