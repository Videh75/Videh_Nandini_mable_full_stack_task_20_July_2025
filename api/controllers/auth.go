package controllers

import (
	"github.com/gin-gonic/gin"
	"github.com/videh75/mable-task-backend/services"
)

func SignUpController(c *gin.Context) {
	services.SignUp(c)
}

func LoginController(c *gin.Context) {
	services.Login(c)
}

func LogoutController(c *gin.Context) {
	services.Logout(c)
}

func ValidateController(c *gin.Context) {
	services.Validate(c)
}
