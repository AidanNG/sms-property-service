import express from "express";
import Twilio from "twilio";
import { geocodeAddress } from "../services/geocode.js";
import { getPropertyData } from "../services/property.js";
import { sendPropertyEmail } from "../services/email.js";
import { formatPropertyMessage } from "../utils/format.js";
import { z } from "zod";
const router = express.Router();
// Zod schema for incoming SMS
const smsSchema = z.object({
    Body: z.string().min(1, "Message body is required"),
    From: z.string().min(1, "Sender phone number is required"),
});
// Test route to verify error handling
router.get("/test-error", (req, res, next) => {
    try {
        throw new Error("This is a test error for the centralized error handler");
    }
    catch (err) {
        next(err); // Forward to errorHandler
    }
});
router.post("/incoming", async (req, res, next) => {
    const twiml = new Twilio.twiml.MessagingResponse();
    const parseResult = smsSchema.safeParse(req.body);
    //if the sms payload is invalid, respond with error message
    if (!parseResult.success) {
        console.error("Invalid SMS payload:", parseResult.error.format());
        twiml.message("Invalid request. Make sure your message is not empty.");
        await sendPropertyEmail({
            subject: `Property Info Failed - Invalid SMS Payload`,
            text: `Received invalid SMS payload: ${JSON.stringify(req.body)}`,
        });
        throw { message: "No SMS body provided", statusCode: 400 };
        //return res.type("text/xml").send(twiml.toString());
    }
    const { Body: body, From: from } = parseResult.data;
    console.log(`Incoming SMS from ${from}: "${body}"`);
    try {
        const geo = await geocodeAddress(body);
        if (!geo)
            throw { message: "Address not found", statusCode: 404 };
        const property = await getPropertyData(geo.lat, geo.lon);
        if (!property) {
            await sendPropertyEmail({
                subject: `Property Lookup Failed`,
                text: `Could not find property for "${body}". Try a full address like "123 Main St, Dallas TX".`,
            });
            twiml.message("Your request was received. Check your email for the property info.");
        }
        else {
            const reply = formatPropertyMessage(geo.display_name, property);
            await sendPropertyEmail({
                subject: `Property Info for ${geo.display_name}`,
                text: reply,
            });
            twiml.message("Your property info has been sent to your email.");
        }
    }
    catch (err) {
        //console.error("Error processing SMS:", err);
        //twiml.message("Sorry, something went wrong. Please try again later.");
        next(err);
    }
    res.type("text/xml").send(twiml.toString());
});
export default router;
