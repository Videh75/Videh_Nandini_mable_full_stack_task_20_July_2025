package services

import (
	"context"
	"log"
	"time"

	"github.com/videh75/mable-task-backend/database"
	"github.com/videh75/mable-task-backend/models"
)

func InsertEvent(e models.Event) error {
	ctx := context.Background()

	batch, err := database.ClickHouseConn.PrepareBatch(ctx, "INSERT INTO analytics.events")
	if err != nil {
		log.Println("Failed to prepare ClickHouse batch:", err)
		return err
	}

	if e.Timestamp.IsZero() {
		e.Timestamp = time.Now()
	}

	err = batch.Append(
		e.EventType,
		e.Timestamp,
		e.UserEmail,
		e.UserAgent,
		e.IPAddress,
		e.CartData,
		e.Location,
		e.Timezone,
		e.SessionData,
	)

	if err != nil {
		log.Println("Failed to append event to batch:", err)
		return err
	}

	err = batch.Send()
	if err != nil {
		log.Println("Failed to send batch to ClickHouse:", err)
		return err
	}

	return nil
}
