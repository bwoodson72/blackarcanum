import type { APIRoute } from "astro";
import { handleNewsletterRequest } from "../../lib/kit-newsletter.mjs";

export const prerender = false;

export const GET: APIRoute = ({ request }) => handleNewsletterRequest(request);
export const POST: APIRoute = ({ request }) => handleNewsletterRequest(request);
