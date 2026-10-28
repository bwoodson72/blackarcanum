/**
 * Server-only Kit v4 integration. Never import this module into client JS.
 * This endpoint needs a configured confirmation email in the chosen Kit form.
 */
export function getNewsletterConfig(env = process.env) {
  const key = env.KIT_V4_API_KEY?.trim();
  const id = env.KIT_NEWSLETTER_FORM_ID?.trim();
  const confirmed = env.KIT_FORM_CONFIRMATION_VERIFIED === "true";
  if (!key || !id || !confirmed || !/^[1-9]\d{0,15}$/.test(id)) return null;
  return { key, formId: id };
}
const genericHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
const json = (status, obj, headers = {}) =>
  new Response(JSON.stringify(obj), { status, headers: { ...genericHeaders, ...headers } });
const recentAttempts = new Map();
const WINDOW_MS = 15 * 60_000;
const MAX_ATTEMPTS = 5;
function limited(key, now) {
  if (recentAttempts.size > 2500) {
    for (const [k, arr] of recentAttempts) {
      if (!arr.length || now - arr[arr.length - 1] > WINDOW_MS) recentAttempts.delete(k);
    }
    // This in-instance limiter is best-effort. A distributed edge limiter
    // must be configured before a high-volume public campaign.
    if (recentAttempts.size > 2500) recentAttempts.clear();
  }
  const window = (recentAttempts.get(key) || []).filter(t => now - t < WINDOW_MS);
  if (window.length >= MAX_ATTEMPTS) { recentAttempts.set(key, window); return true; }
  window.push(now);
  recentAttempts.set(key, window);
  return false;
}
function isValidEmail(value) {
  return typeof value === "string" && value.length <= 254 &&
    /^[^\s@<>]+@[^\s@<>]+\.[a-z]{2,}$/i.test(value);
}
async function kitRequest(url, apiKey, body, fetchImpl) {
  const response = await fetchImpl(url, {
    method: "POST",
    headers: {
      "X-Kit-Api-Key": apiKey,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) return false;
  // Do not forward provider status, errors, subscriber data or account IDs.
  return true;
}
/** Injectable dependencies keep all provider calls in deterministic local tests. */
export async function handleNewsletterRequest(request, {
  env = process.env, fetchImpl = fetch, now = Date.now(),
  rateLimit = limited,
} = {}) {
  const config = getNewsletterConfig(env);
  if (request.method === "GET") {
    return json(200, { available: Boolean(config) });
  }
  if (request.method !== "POST") {
    return json(405, { code: "method_not_allowed" }, { Allow: "GET, POST" });
  }
  if (!config) return json(503, { code: "unavailable", message: "Newsletter signup is not available yet." });
  // Stop cross-origin form submissions. Origin is supplied by browsers for POST;
  // compare against the platform's actual request URL, not untrusted host headers.
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return json(403, { code: "forbidden" });
  }
  if (!(request.headers.get("content-type") || "").startsWith("application/json")) {
    return json(415, { code: "unsupported_content_type" });
  }
  if (Number(request.headers.get("content-length") || 0) > 2048) {
    return json(413, { code: "too_large" });
  }
  let body;
  try {
    const text = await request.text();
    if (text.length > 2048) return json(413, { code: "too_large" });
    body = JSON.parse(text);
  } catch {
    return json(400, { code: "invalid_request" });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return json(400, { code: "invalid_request" });
  }
  // Honeypot submissions receive no provider calls.
  if (body.website) return json(202, { code: "received" });
  if (body.consent !== true) {
    return json(400, { code: "consent_required", message: "Please agree to receive email before subscribing." });
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!isValidEmail(email)) {
    return json(400, { code: "invalid_email", message: "Enter a valid email address." });
  }
  // Per-instance throttling is one layer, not a distributed guarantee.
  const ip = request.headers.get("x-real-ip") || request.headers.get("x-vercel-forwarded-for") ||
    request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (rateLimit(ip, now)) {
    return json(429, { code: "too_many_requests", message: "Please try again later." },
      { "Retry-After": "900" });
  }
  try {
    // Kit's v4 form endpoint requires a subscriber that already exists.
    // Creating with inactive avoids the v4 default of immediately active.
    const created = await kitRequest("https://api.kit.com/v4/subscribers",
      config.key, { email_address: email, state: "inactive" }, fetchImpl);
    if (!created) return json(502, { code: "provider_unavailable", message: "Signup could not be completed. Please try again." });
    const added = await kitRequest(
      "https://api.kit.com/v4/forms/" + config.formId + "/subscribers",
      config.key, { email_address: email }, fetchImpl);
    if (!added) return json(502, { code: "provider_unavailable", message: "Signup could not be completed. Please try again." });
    // A successful API response means the request was accepted, not that the
    // email was delivered or that the subscriber confirmed their opt-in.
    return json(202, {
      code: "received",
      message: "Your signup request was received. Please check your inbox for a confirmation email.",
    });
  } catch {
    return json(502, { code: "provider_unavailable", message: "Signup could not be completed. Please try again." });
  }
}
