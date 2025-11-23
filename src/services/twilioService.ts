import Twilio from "twilio";
import { env } from "../config/env.js";

const client = Twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

/**
 * Registers a phone number with Twilio's verified caller ID list.
 */
export async function verifyPhoneNumber(name: string, phone: string) {
  return client.validationRequests.create({
    friendlyName: name,
    phoneNumber: phone
  });
}