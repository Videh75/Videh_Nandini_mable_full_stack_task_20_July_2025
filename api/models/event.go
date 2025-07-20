package models

import "time"

type Event struct {
	EventType     string    `json:"event_type"`
	UserEmail     string    `json:"user_email"`
	CartData      string    `json:"cart_data"`
	SourcePage    string    `json:"source_page"`
	SessionData   string    `json:"session_data"`
	Timestamp     time.Time `json:"timestamp"`
	SentAt        time.Time `json:"sent_at"`
	ReceivedAt    time.Time `json:"received_at"`
	UserAgent     string    `json:"user_agent"`
	IPAddress     string    `json:"ip_address"`
	Location      string    `json:"location"`
	Timezone      string    `json:"timezone"`
	PaymentMethod string    `json:"payment_method"`
}
