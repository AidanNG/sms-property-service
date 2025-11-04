import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
export async function sendPropertyEmail({ subject, text, }) {
    await sgMail.send({
        to: process.env.SENDGRID_TO_EMAIL,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject,
        text,
    });
}
