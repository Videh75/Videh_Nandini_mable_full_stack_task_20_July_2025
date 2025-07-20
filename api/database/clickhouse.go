package database

import (
	"context"
	"crypto/tls"
	"log"
	"os"
	"time"

	clickhouse "github.com/ClickHouse/clickhouse-go/v2"
)

var ClickHouseConn clickhouse.Conn

func ConnectClickHouse() {
	var err error

	ClickHouseConn, err = clickhouse.Open(&clickhouse.Options{
		Addr: []string{os.Getenv("CLICKHOUSE_HOST")},
		Auth: clickhouse.Auth{
			Database: os.Getenv("CLICKHOUSE_DB"),
			Username: os.Getenv("CLICKHOUSE_USER"),
			Password: os.Getenv("CLICKHOUSE_PASS"),
		},
		TLS: &tls.Config{
			InsecureSkipVerify: false,
		},
		Compression: &clickhouse.Compression{
			Method: clickhouse.CompressionLZ4,
		},
		DialTimeout: 5 * time.Second,
	})

	if err != nil {
		log.Fatal("Failed to connect to ClickHouse:", err)
	}

	if err := ClickHouseConn.Ping(context.Background()); err != nil {
		log.Fatal("Failed to ping ClickHouse:", err)
	}

	log.Println("Connected to ClickHouse")
}
