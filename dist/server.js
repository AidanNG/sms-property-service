import express from "express";
import Twilio from "twilio";
import dotenv from "dotenv";
import { geocodeAddress } from "./services/geocode.js";
import { getPropertyData } from "./services/property.js";
import { formatPropertyMessage } from "./utils/format.js";
dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.post("/sms/incoming", async (req, res) => {
    const body = req.body.Body?.trim();
    const from = req.body.From;
    console.log(`Incoming SMS from ${from}: "${body}"`);
    const twiml = new Twilio.twiml.MessagingResponse();
    try {
        //Geocode the address from SMS
        const geo = await geocodeAddress(body);
        if (!geo)
            throw new Error("Address not found");
        console.log(`Fetching property for: ${geo.lat} - ${geo.lon}`);
        //Fetch property data using ATTOM snapshot endpoint
        const property = await getPropertyData(geo.lat, geo.lon);
        //Handle case where ATTOM returns no data
        if (!property) {
            console.warn("No property found, sending fallback message.");
            twiml.message("Sorry, I couldn’t find that property. Try a full address like '123 Main St, Dallas TX'.");
        }
        else {
            //Format and send property info
            console.log("preparing to send the message");
            const reply = formatPropertyMessage(geo.display_name, property);
            console.log("Formatted SMS message:", reply);
            twiml.message(reply);
        }
    }
    catch (err) {
        console.error("Error processing SMS:", err);
        twiml.message("Sorry, something went wrong. Please try again later.");
    }
    console.log("the code will send the message");
    res.type("text/xml").send(twiml.toString());
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
