# SMS Property Lookup Service

A TypeScript-based **Express server** that receives **incoming SMS messages**, looks up **real property data** using the **ATTOM Data API**, and replies with a **detailed property report via email** using **SendGrid**.

---

## Features

- **Two-way communication system:**
  - Receives SMS messages via Twilio webhook.
  - Sends formatted property details by email using SendGrid.
- **ATTOM Property Data Integration:**
  - Fetches property snapshot details by geolocation.
  - Retrieves latest sales history using the property’s `attomId`.
- **TypeScript + Node.js:**
  - Fully typed interfaces for ATTOM API responses.
  - Clean async/await structure with robust error handling.
- **Modular Architecture:**
  - Organized into `services/` and `utils/` for scalability.
- **Environment-based configuration:**
  - All keys securely loaded from `.env`.

---

## Project Structure

sms-property-service/
├── src/
│ ├── server.ts # Express app entry point
│ ├── services/
│ │ ├── property.ts # ATTOM API integration (snapshot + sales)
│ │ ├── geocode.ts # Geocoding utility (Nominatim or similar)
│ ├── utils/
│ │ ├── format.ts # Formats property info into readable messages
│ └── types/ # (Optional) Shared type definitions
├── .env # Environment variables (not committed)
├── package.json
└── tsconfig.json