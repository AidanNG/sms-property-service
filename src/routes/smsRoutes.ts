import express from "express";
import Twilio from "twilio";
import { geocodeAddress } from "../services/geocode.js";
import { getPropertyData } from "../services/property.js";
import { sendPropertyEmail } from "../services/email.js";
import { formatPropertyMessage } from "../utils/format.js";

const router = express.Router();

router.post("/incoming", async (req, res) => {
  const body = req.body.Body?.trim();
  const from = req.body.From;
  const twiml = new Twilio.twiml.MessagingResponse();

  try {
    const geo = await geocodeAddress(body);
    if (!geo) throw new Error("Address not found");

    const property = await getPropertyData(geo.lat, geo.lon);
    if (!property) {
      await sendPropertyEmail({
        subject: `Property Lookup Failed`,
        text: `Could not find property for "${body}". Try a full address like "123 Main St, Dallas TX".`,
      });
      twiml.message("Your request was received. Check your email for the property info.");
    } else {
      const reply = formatPropertyMessage(geo.display_name, property);
      await sendPropertyEmail({
        subject: `Property Info for ${geo.display_name}`,
        text: reply,
      });
      twiml.message("Your property info has been sent to your email.");
    }
  } catch (err) {
    console.error("Error processing SMS:", err);
    twiml.message("Sorry, something went wrong. Please try again later.");
  }

  res.type("text/xml").send(twiml.toString());
});

export default router;
