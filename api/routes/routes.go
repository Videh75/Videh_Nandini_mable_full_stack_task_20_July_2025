package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/videh75/mable-task-backend/controllers"
	"github.com/videh75/mable-task-backend/middleware"
)

func RegisterRoutes(r *gin.Engine) {
	r.POST("/signup",
		controllers.SignUpController)
	r.POST("/login",
		controllers.LoginController)
	r.POST("/logout", middleware.RequireAuth, controllers.LogoutController)
	r.GET("/validate",
		middleware.RequireAuth, controllers.ValidateController)
	r.POST("/track", middleware.RequireAuth, controllers.TrackEvent)
	r.GET("/products", middleware.RequireAuth, controllers.GetProducts)
	r.GET("/product/:id", middleware.RequireAuth, controllers.GetProductByID)
	r.GET("/health", controllers.HealthCheck)
}
