# Prompt 30 — Mystagogia newsletter and Kit integration

The homepage newsletter section now comes from reusable \`NewsletterSection.astro\` and \`NewsletterForm.astro\` components. **No Kit credentials, form ID, sender name, newsletter cadence or lead magnet have been approved for Mystagogia.** The public homepage therefore shows the truthful "Newsletter in preparation" state. The form is hidden by default, and browser-side code checks only a boolean readiness status from the same-origin \`GET /api/newsletter\`. Do not expose a form when provider configuration is missing.

## Vercel runtime environment

Configure the following in the Mystagogia Vercel project's **runtime environment**, not any \`PUBLIC_\` or \`VITE_\` variable, and redeploy. Never put these values into GitHub, .env.example, Astro frontmatter, analytics, or browser JS.

| Variable | Meaning |
| --- | --- |
| \`KIT_V4_API_KEY\` | Kit v4 key from Developer Settings (server-only) |
| \`KIT_NEWSLETTER_FORM_ID\` | Existing, *published* Kit form ID (positive integer) |
| \`KIT_FORM_CONFIRMATION_VERIFIED\` | Set to exact string \`true\` **only after** confirming the selected Kit form sends a confirmation email, has **Auto-confirm new subscribers OFF** (double opt-in), and uses an approved sender and consent/privacy language. |

All three must be valid for the form to open. The readiness endpoint leaks only \`{ "available": boolean }\`, not the key or ID. If a credential is omitted, an invalid form ID is supplied or the confirmation setup has not been verified, \`POST /api/newsletter\` returns 503 without contacting Kit. No live signup or provider delivery has been executed.

## Consent and provider flow

The form uses a required labeled email field and explicit, **unchecked** consent checkbox for newsletter updates; it does not enroll visitors into any unrelated mailing list. A hidden honeypot input and best-effort in-process per-IP rate limit (5 attempts/15 minutes) deter obvious bot traffic; origin/content-type/body-size checks reject cross-site or malformed POSTs. This is not a distributed abuse defense: for sustained traffic, configure platform-level durable rate limits, monitoring and abuse controls before a public campaign.

The server endpoint uses Kit's v4 API in **two calls**: \`POST /v4/subscribers\` with \`state: "inactive"\` (Kit defaults to active otherwise), followed by \`POST /v4/forms/{form_id}/subscribers\`, only if creation/upsert succeeded. The chosen form's verified confirmation settings govern opt-in. A 202 response means both API requests were **accepted**, not that an email was delivered, the address was verified or a subscription became active. The frontend tells the visitor to check for a confirmation email, not "you're subscribed". Provider errors, subscriber IDs, private responses and keys are never returned to browsers.

**Do not enable the form** until the owner has approved the sender identity, Kit form configuration, legal/privacy notice and actual consent wording. Form submissions do not save emails or personal information in site files or analytics. Unsubscribe handling remains within Kit.

## Testing and release

\`npm run test:newsletter\` is now part of the normal unit QA and mocks both Kit requests without using real credentials or emailing anyone. It covers missing configuration, consent, invalid email, honeypot, origin, rate limits, provider failures and accepted requests. \`npm run build\`, \`npm run typecheck\`, and \`npm run test:samples\` check route integration, disabled form markup and secret-safety. Check the deployed \`GET /api/newsletter\` response is \`available: false\` until configured. Test real confirmation email delivery **only after** explicitly authorizing the actual Kit form and using a controlled test address. That live provider test remains **NOT RUN**.

Kit references:
- https://developers.kit.com/api-reference/subscribers/create-a-subscriber
- https://developers.kit.com/api-reference/forms/add-subscriber-to-form-by-email-address
- https://help.kit.com/en/articles/2502655-the-confirmation-email

**Stopped after Prompt 30.**
