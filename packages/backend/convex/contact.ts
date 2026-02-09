import { v } from "convex/values";
import { action } from "./_generated/server";

/**
 * Public action to send a contact form email via Resend
 *
 * Requires RESEND_API_KEY environment variable
 */
export const sendContactEmail = action({
  args: {
    name: v.optional(v.string()),
    email: v.string(),
    message: v.string(),
  },
  handler: async (_ctx, args) => {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const CONTACT_EMAIL = process.env.CONTACT_EMAIL || "contact@example.com";

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    // Basic validation
    if (!args.email || !args.email.includes("@")) {
      throw new Error("Valid email is required");
    }

    if (!args.message || args.message.trim().length === 0) {
      throw new Error("Message is required");
    }

    if (args.message.trim().length < 10) {
      throw new Error("Message must be at least 10 characters");
    }

    // Prepare email content
    const emailSubject = args.name
      ? `Contact form: Message from ${args.name}`
      : "Contact form: New message";

    const emailHtml = `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${args.name || "Anonymous"}</p>
      <p><strong>Email:</strong> ${args.email}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${args.message}</p>
    `;

    const emailText = `
New Contact Form Submission

From: ${args.name || "Anonymous"}
Email: ${args.email}

Message:
${args.message}
    `.trim();

    try {
      // Send email via Resend API
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "Portfolio Contact Form <onboarding@resend.dev>", // Use verified domain in production
          to: CONTACT_EMAIL,
          reply_to: args.email,
          subject: emailSubject,
          html: emailHtml,
          text: emailText,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Resend API error:", error);
        throw new Error("Failed to send email. Please try again later.");
      }

      const data = await response.json();
      console.log("Email sent successfully:", data);

      return { success: true };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to send email"
      );
    }
  },
});
