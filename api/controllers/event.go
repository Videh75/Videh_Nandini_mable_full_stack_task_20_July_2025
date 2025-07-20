package controllers

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/videh75/mable-task-backend/database"
	"github.com/videh75/mable-task-backend/models"
)

func TrackEvent(c *gin.Context) {
	var event models.Event

	if err := c.ShouldBindJSON(&event); err != nil || event.EventType == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid event payload"})
		return
	}

	event.Timestamp = time.Now()
	event.ReceivedAt = time.Now()
	event.IPAddress = c.ClientIP()
	event.UserAgent = c.Request.UserAgent()

	query := `
		INSERT INTO events (
			event_type, user_email, cart_data, source_page, session_data, timestamp, sent_at, received_at, user_agent, ip_address, location, timezone, payment_method
		) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`

	err := database.ClickHouseConn.Exec(context.Background(), query,
		event.EventType,
		event.UserEmail,
		event.CartData,
		event.SourcePage,
		event.SessionData,
		event.Timestamp,
		event.SentAt,
		event.ReceivedAt,
		event.UserAgent,
		event.IPAddress,
		event.Location,
		event.Timezone,
		event.PaymentMethod,
	)

	if err != nil {
		log.Println("ClickHouse insert error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to track event"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Event tracked successfully"})
}
