import express from "express";
import { urlencoded } from "express";
import Twilio from "twilio";
import dotenv from "dotenv";
import { geocodeAddress } from "./services/geocode.js";
import { getPropertyData } from "./services/property.js";
import { formatPropertyMessage } from "./utils/format.js";
dotenv.config();
const app = express();
app.use(urlencoded({ extended: false }));
app.post("/sms/incoming", async (req, res) => {
    const body = req.body.Body?.trim();
    const from = req.body.From;
    console.log(`📩 Incoming SMS from ${from}: "${body}"`);
    const twiml = new Twilio.twiml.MessagingResponse();
    try {
        const geo = await geocodeAddress(body);
        if (!geo)
            throw new Error("Address not found");
        const property = await getPropertyData(geo.lat, geo.lon);
        const reply = formatPropertyMessage(geo.display_name, property);
        twiml.message(reply);
    }
    catch (err) {
        console.error("❌ Error:", err);
        twiml.message("Sorry, I couldn’t find that property. Try a full address like '123 Main St, Dallas TX'.");
    }
    res.type("text/xml").send(twiml.toString());
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
