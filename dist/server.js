import express from "express";
import Twilio from "twilio";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";
import { geocodeAddress } from "./services/geocode.js";
import { getPropertyData } from "./services/property.js";
import { formatPropertyMessage } from "./utils/format.js";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const app = express();
app.use(express.urlencoded({ extended: true }));
app.post("/sms/incoming", async (req, res) => {
    const body = req.body.Body?.trim();
    const from = req.body.From;
    console.log(`Incoming SMS from ${from}: "${body}"`);
    const twiml = new Twilio.twiml.MessagingResponse();
    try {
        // Geocode the address from SMS
        const geo = await geocodeAddress(body);
        if (!geo)
            throw new Error("Address not found");
        console.log(`Fetching property for: ${geo.lat} - ${geo.lon}`);
        // Fetch property data using ATTOM snapshot endpoint
        const property = await getPropertyData(geo.lat, geo.lon);
        // Handle case where ATTOM returns no data
        if (!property) {
            console.warn("No property found, sending fallback email.");
            await sgMail.send({
                to: process.env.SENDGRID_TO_EMAIL, // Sending to the SMS sender’s number as email if mapped to email
                from: process.env.SENDGRID_FROM_EMAIL,
                subject: `Property Lookup Failed`,
                text: `Sorry, we could not find the property for "${body}". Try a full address like "123 Main St, Dallas TX".`,
            });
            twiml.message("Your request was received. Check your email for the property info.");
        }
        else {
            // Format property info
            const reply = formatPropertyMessage(geo.display_name, property);
            console.log("Formatted email message:", reply);
            // Send the property info via SendGrid email
            await sgMail.send({
                to: process.env.SENDGRID_TO_EMAIL, // Replace with the recipient's email address
                from: process.env.SENDGRID_FROM_EMAIL,
                subject: `Property Info for ${geo.display_name}`,
                text: reply,
            });
            // Respond to SMS to confirm email was sent
            twiml.message("Your property info has been sent to your email.");
        }
    }
    catch (err) {
        console.error("Error processing SMS:", err);
        twiml.message("Sorry, something went wrong. Please try again later.");
    }
    // Send Twilio response
    res.type("text/xml").send(twiml.toString());
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
