import dotenv from "dotenv";
dotenv.config();
const required = [
    "TWILIO_AUTH_TOKEN",
    "TWILIO_ACCOUNT_SID",
    "SENDGRID_API_KEY",
    "SENDGRID_TO_EMAIL",
    "SENDGRID_FROM_EMAIL",
    "ATTOM_API_KEY",
];
for (const key of required) {
    if (!process.env[key]) {
        console.warn(`Missing environment variable: ${key}`);
    }
}
export default process.env;
