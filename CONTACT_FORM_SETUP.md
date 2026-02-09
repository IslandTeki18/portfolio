# Contact Form Setup Guide

The contact form is now implemented and ready to use. Follow these steps to configure it:

## 1. Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day)
3. Verify your email address

## 2. Get Your API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Give it a name (e.g., "Portfolio Contact Form")
4. Copy the API key (starts with `re_`)

## 3. Configure Environment Variables

### For Local Development

Create/update `.env.local` in the `packages/backend` directory:

```bash
# In packages/backend/.env.local
RESEND_API_KEY=re_your_api_key_here
CONTACT_EMAIL=your-email@example.com
```

### For Production (Convex Dashboard)

1. Go to [dashboard.convex.dev](https://dashboard.convex.dev)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add both variables:
   - `RESEND_API_KEY`: Your Resend API key
   - `CONTACT_EMAIL`: Email address where contact form submissions should be sent

## 4. Verify Domain (Production)

### For Testing
Resend provides a default sending domain (`onboarding@resend.dev`) that works immediately. This is fine for testing but has limitations.

### For Production
To remove the "via resend.dev" tag and use your own domain:

1. In Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `yourdomain.com`)
4. Add the DNS records shown (takes 24-48 hours to verify)
5. Once verified, update the `from` field in `contact.ts`:

```typescript
from: "Portfolio Contact Form <contact@yourdomain.com>", // Replace onboarding@resend.dev
```

## 5. Test the Contact Form

### Local Testing

1. Start the Convex dev server:
   ```bash
   cd packages/backend
   npx convex dev
   ```

2. Start the portfolio app:
   ```bash
   cd apps/portfolio
   pnpm dev
   ```

3. Open `http://localhost:5173`
4. Scroll to the contact form
5. Fill out:
   - Name (optional)
   - Email (required, valid format)
   - Message (required, min 10 characters)
6. Click "Send Message"
7. You should see:
   - Success toast: "Message sent successfully!"
   - Form clears automatically
   - Email arrives at your configured CONTACT_EMAIL

### Error Testing

Try these to verify error handling:

1. **Invalid email**: Enter "notanemail" → See validation error
2. **Short message**: Enter "hi" → See "Message must be at least 10 characters"
3. **Missing API key**: Remove `RESEND_API_KEY` env var → See error toast

## 6. Production Deployment

When deploying to Vercel:

1. Set environment variables in Vercel project settings
2. Ensure they're set for **Production** environment
3. Redeploy the app
4. Test the contact form on your live site

## 7. Email Template Customization

The email template is in `packages/backend/convex/contact.ts`. Customize the HTML/text templates to match your branding:

```typescript
const emailHtml = `
  <h2>New Contact Form Submission</h2>
  <p><strong>From:</strong> ${args.name || "Anonymous"}</p>
  <p><strong>Email:</strong> ${args.email}</p>
  <p><strong>Message:</strong></p>
  <p style="white-space: pre-wrap;">${args.message}</p>
`;
```

## Troubleshooting

### "RESEND_API_KEY environment variable is not set"
- Make sure `.env.local` exists in `packages/backend`
- Restart Convex dev server after adding env vars

### "Failed to send email"
- Check Resend API key is valid
- Check Resend dashboard for error logs
- Verify you haven't exceeded free tier limits (100/day)

### Email not arriving
- Check spam folder
- Verify CONTACT_EMAIL is correct
- Check Resend dashboard for delivery status

### Form validation not working
- Check browser console for errors
- Ensure react-hook-form is installed: `pnpm list react-hook-form`

## Rate Limiting (Optional Enhancement)

For production, consider adding rate limiting to prevent spam:

1. Use Convex scheduled functions to track submissions
2. Limit to X submissions per email per day
3. Add reCAPTCHA or similar bot protection

This is not implemented in v1 but recommended for high-traffic sites.
