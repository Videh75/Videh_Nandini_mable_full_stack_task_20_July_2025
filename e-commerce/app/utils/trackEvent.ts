import api from "~/api/axios";

export interface EventPayload {
  event_type: string;
  user_email: string;
  cart_data?: string;
  source_page?: string;
  session_data?: string;
  sent_at?: string;
  location?: string;
  timezone?: string;
  payment_method?: string;
}

export const trackEvent = async (event: EventPayload): Promise<void> => {
  try {
    const [geoRes] = await Promise.all([
      fetch("https://ipinfo.io/json"),
    ]);
    const geoData = await geoRes.json();
    const location = `${geoData.city || "Unknown City"}, ${geoData.country || "Unknown Country"}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const sentAt = new Date().toISOString()

    const payload = {
      location,
      timezone,
      sentAt,
      cart_data: "null",
      source_page: "unknown",
      payment_method: "NA",
      ...event,
    };

    await api.post("/track", payload);
    console.log("Event tracked:", payload.event_type);
  } catch (error) {
    console.error("Failed to track event:", error);
  }
};
