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

```plaintext
sms-property-service/
├── src/
│   ├── app.ts
│   ├── server.ts                # Express app entry point
│   ├── config/
│   │   ├── env.ts          	 # Load and validate environment variables
│   ├── middleware/
│   │   ├── errorHandler.ts      # Centralized error handling
│   ├── routes/
│   │   ├── smsRoutes.ts  
│   ├── services/
│   │   ├── email.ts		 # SendGrid API integration
│   │   ├── sms.ts
│   │   ├── property.ts          # ATTOM API integration 
│   │   ├── geocode.ts           # Geocoding utility 
│   ├── utils/
│   │   ├── format.ts            # Formats property info into readable messages
│   │   ├── logger.ts            # Winston for structured logging
│   └── types/                   # Shared type definitions
│   	└── propertyTypes.ts
├── .env                         # Environment variables (not committed)
├── package.json
└── tsconfig.json
```
