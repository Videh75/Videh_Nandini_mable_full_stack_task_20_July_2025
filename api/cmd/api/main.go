package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/videh75/mable-task-backend/config"
	"github.com/videh75/mable-task-backend/database"
	"github.com/videh75/mable-task-backend/routes"
)

func init() {
	config.LoadEnv()
}

func main() {
	database.ConnectToDB()
	database.ConnectClickHouse()

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOriginFunc: func(origin string) bool {
			return true
		},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))
	routes.RegisterRoutes(r)
	r.Run()
}
