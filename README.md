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
├── docs/
│   └── index.html                 # Front-end landing & registration page
│
├── prisma/
│   ├── schema.prisma              # Prisma schema
│   └── migrations/                # Database migrations
│
├── src/
│   ├── automation/
│   │   └── neweggAgent.ts         # Automation / scraping logic
│   │
│   ├── config/
│   │   ├── env.ts                 # Environment variable loader
│   │   └── db/
│   │       ├── prisma.ts          # Prisma client (main)
│   │       └── testPrisma.ts      # Test connection script
│   │
│   ├── middleware/
│   │   └── errorHandler.ts        # Global error middleware
│   │
│   ├── models/
│   │   └── user.ts                # User model/schema logic (if any)
│   │
│   ├── routes/
│   │   ├── register.ts            # Registration endpoint
│   │   └── smsRoutes.ts           # SMS-related endpoints
│   │
│   ├── scripts/                   # Utility scripts
│   │
│   ├── services/                  # External service integrations
│   │   ├── email.ts               # Email handling
│   │   ├── geocode.ts             # Geocoding logic
│   │   ├── property.ts            # Property data logic
│   │   ├── sendgridService.ts     # SendGrid integration
│   │   ├── sms.ts                 # SMS sending logic
│   │   └── twilioService.ts       # Twilio verification logic
│   │
│   ├── types/
│   │   └── propertyTypes.ts       # Shared property-related types
│   │
│   ├── utils/
│   │   ├── format.ts              # Formatting helpers
│   │   └── logger.ts              # Centralized logger (winston/pino)
│   │
│   ├── app.ts                     # Express app initialization
│   └── server.ts                  # Server entry point
│
├── logs/                          # Runtime logs
│
├── .env                           # Environment variables
├── .env.example                   # Example env template
├── package.json
└── tsconfig.json
```
