import sgClient from "@sendgrid/client";
import { env } from "../config/env.js";

sgClient.setApiKey(env.SENDGRID_API_KEY);

/**
 * Adds a user to SendGrid's marketing contacts list.
 */
export async function addSendGridContact(name: string, email: string) {
  return sgClient.request({
    method: "PUT",
    url: "/v3/marketing/contacts",
    body: {
      contacts: [
        {
          email,
          first_name: name
        }
      ]
    }
  });
}