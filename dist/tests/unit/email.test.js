import { sendPropertyEmail } from "../../src/services/email.js";
import sgMail from "@sendgrid/mail";
import { env } from "../../src/config/env.js";
import { logger } from "../../src/utils/logger.js";
jest.mock("@sendgrid/mail");
jest.mock("../../src/utils/logger");
describe("sendPropertyEmail", () => {
    const mockEmail = {
        subject: "Test Subject",
        text: "Test Content"
    };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("should send email successfully", async () => {
        await sendPropertyEmail(mockEmail);
        expect(sgMail.send).toHaveBeenCalledWith({
            to: env.SENDGRID_TO_EMAIL,
            from: env.SENDGRID_FROM_EMAIL,
            subject: mockEmail.subject,
            text: mockEmail.text
        });
        expect(logger.info).toHaveBeenCalledWith("Email sent successfully", {
            to: env.SENDGRID_TO_EMAIL,
            subject: mockEmail.subject
        });
    });
    it("should handle email sending failure", async () => {
        const mockError = new Error("Send failed");
        sgMail.send.mockRejectedValueOnce(mockError);
        await expect(sendPropertyEmail(mockEmail)).rejects.toThrow("Send failed");
        expect(logger.error).toHaveBeenCalledWith("Failed to send email", {
            error: mockError.message
        });
    });
    it("should handle SendGrid API errors with response body", async () => {
        const mockSendGridError = {
            response: {
                body: {
                    errors: [{ message: "Invalid API key" }]
                }
            }
        };
        sgMail.send.mockRejectedValueOnce(mockSendGridError);
        await expect(sendPropertyEmail(mockEmail)).rejects.toThrow();
        expect(logger.error).toHaveBeenCalledWith("Failed to send email", {
            error: mockSendGridError.response.body
        });
    });
});
