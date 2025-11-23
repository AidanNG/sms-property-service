import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/prisma.js";
import { verifyPhoneNumber } from "../services/twilioService.js";
import { addSendGridContact } from "../services/sendgridService.js";
import { logger } from "../utils/logger.js";

const router = Router();

const RegisterSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(8),
  email: z.string().email()
});

router.post("/", async (req, res) => {
  try {
    // Validate input
    const data = RegisterSchema.parse(req.body);

    const { name, phone, email } = data;

    // Store in DB (if user exists — update)
    const user = await prisma.user.upsert({
      where: { email },
      update: { name, phone },
      create: { name, phone, email }
    });

    // Twilio phone verification
    await verifyPhoneNumber(name, phone);

    // SendGrid contact addition
    await addSendGridContact(name, email);

    logger.info("User registered", { email, phone });

    res.json({
      success: true,
      message: "User registered with Twilio + SendGrid"
    });

  } catch (err: any) {
    logger.error("Registration error", err);

    res.status(400).json({
      success: false,
      error: err.message || "Registration failed"
    });
  }
});

export default router;
