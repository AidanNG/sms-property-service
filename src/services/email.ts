import sgMail from "@sendgrid/mail";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

// Initialize SendGrid with validated API key
sgMail.setApiKey(env.SENDGRID_API_KEY);

/**
 * Sends a property-related email using SendGrid
 * @param subject - Email subject line
 * @param text - Plain text content of the email
 */
export async function sendPropertyEmail({
  subject,
  text,
}: {
  subject: string;
  text: string;
}): Promise<void> {
  try {
    const msg = {
      to: env.SENDGRID_TO_EMAIL,
      from: env.SENDGRID_FROM_EMAIL,
      subject,
      text,
    };

    await sgMail.send(msg);

    logger.info("Email sent successfully", {
      to: env.SENDGRID_TO_EMAIL,
      subject,
    });
  } catch (error: any) {
    logger.error("Failed to send email", {
      error: error.response?.body || error.message,
    });
    throw error;
  }
}
