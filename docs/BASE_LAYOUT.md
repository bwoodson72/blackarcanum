# Mystagogia — BaseLayout metadata contract (Prompt 04)

`src/layouts/BaseLayout.astro` is the single page-document shell. It imports `src/styles/global.css` **once**, which owns the Starwind/Tailwind entry point plus the self-hosted typography. Every page receives an English-language document, viewport metadata, a keyboard-focusable skip link to `<main id="main-content" tabindex="-1">`, and consistent Open Graph / Twitter metadata.

## Props

| Prop | Type | Default | Behavior |
| --- | --- | --- | --- |
| `title` | `string?` | `Mystagogia` | Page title; appends `| Mystagogia` for distinct page titles. |
| `description` | `string?` | `Mystagogia is an editorial project exploring esoteric history and practice.` | HTML description, OG and Twitter description. Pages should override with specific truthful copy. |
| `image` | `string?` | omitted | OG/Twitter preview image **only if absolute HTTP(S)**, or if site origin is configured and a root-relative path can be resolved. No invented image fallback. |
| `noindex` | `boolean?` | `false` | When true, emits `robots=noindex, nofollow`. Used on the temporary homepage until real editorial content is approved. |
| `canonical` | `string?` | omitted | Optional absolute HTTP(S) canonical override. If omitted, a canonical is auto-generated from `Astro.site` and the request pathname **only when an approved site origin has been configured**. No preview-domain canonical and no guessed production domain. |

By default, the shell emits `og:type=website`, `og:site_name=Mystagogia`, `og:locale=en_US`, `og:title`, `og:description`, and matching Twitter `summary` title/description metadata. When an image is explicitly valid, it also emits `og:image`, `twitter:image` and `twitter:card=summary_large_image`. When canonical information is available, the shell emits both `<link rel="canonical">` and `og:url`. Do not emit either from `Astro.url.origin`: Vercel previews are not canonical publication addresses.

## Favicon and starter removal

No approved Mystagogia icon or logo exists yet. `<link rel="icon" href="data:,">` is a **neutral blank fallback**, not an attempt to create a visual identity; it prevents the old Astro icon from appearing. Once logo/identity art receives explicit approval, provide real favicon assets and update this link. The unused Astro starter favicon and welcome artwork are removed in Prompt 04, along with its obsolete `Layout.astro` document shell.

## Accessibility and scope

The skip control is first in the body and reveals itself when focused; it targets the one main landmark. The homepage currently consists **only** of a branded heading and a factual in-development statement, deliberately `noindex`; it does **not** represent the approved homepage design. Header, footer, editorial listings, article templates, live signup, imagery, and product listings remain for later authorized prompts.

## Validation

`npm ci`, `npm run typecheck`, `npm run build` and `npm audit --audit-level=high` must pass. Confirm generated HTML has no “Astro Basics,” no old starter branding, correct default metadata, the noindex marker on the temporary homepage, no canonical/OG URL without configured site, and a valid skip anchor/target. For metadata overrides, test an **ephemeral, uncommitted route** with a custom title/description and absolute image; its social metadata should render, without introducing a fictional URL to production content. Verify skip navigation by keyboard in a browser where possible.
