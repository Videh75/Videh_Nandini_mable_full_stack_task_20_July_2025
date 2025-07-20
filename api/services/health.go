package services

import (
	"context"
	"net/http"
	"time"

	"github.com/ClickHouse/clickhouse-go/v2"
	"github.com/videh75/mable-task-backend/models"
	"go.mongodb.org/mongo-driver/mongo"
)

func CheckURLHealth(url string) models.ServiceStatus {
	client := http.Client{
		Timeout: 2 * time.Second,
	}
	resp, err := client.Get(url)

	if err != nil {
		return models.ServiceStatus{Name: url, Status: "unhealthy", Message: err.Error()}
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return models.ServiceStatus{Name: url, Status: "unhealthy", Message: "HTTP " + resp.Status}
	}

	return models.ServiceStatus{Name: url, Status: "healthy"}
}

func CheckMongoHealth(client *mongo.Client) models.ServiceStatus {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	err := client.Ping(ctx, nil)
	if err != nil {
		return models.ServiceStatus{Name: "MongoDB", Status: "unhealthy", Message: err.Error()}
	}
	return models.ServiceStatus{Name: "MongoDB", Status: "healthy"}
}

func CheckClickHouseHealth(conn clickhouse.Conn) models.ServiceStatus {
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	err := conn.Ping(ctx)
	if err != nil {
		return models.ServiceStatus{Name: "ClickHouse", Status: "unhealthy", Message: err.Error()}
	}
	return models.ServiceStatus{Name: "ClickHouse", Status: "healthy"}
}
