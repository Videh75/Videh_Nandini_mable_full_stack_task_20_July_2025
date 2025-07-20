package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/videh75/mable-task-backend/database"
	"github.com/videh75/mable-task-backend/models"
	"github.com/videh75/mable-task-backend/services"
)

func HealthCheck(c *gin.Context) {
	s := []models.ServiceStatus{}

	s = append(s, models.ServiceStatus{
		Name:   "Backend API",
		Status: "healthy",
	})

	s = append(s, services.CheckURLHealth("http://localhost:5173"))

	s = append(s, services.CheckURLHealth("http://localhost:3000"))

	s = append(s, services.CheckMongoHealth(database.Client))

	s = append(s, services.CheckClickHouseHealth(database.ClickHouseConn))

	c.JSON(http.StatusOK, gin.H{
		"status":   "ok",
		"services": s,
	})
}
