# Archival Image Masters — Not Public Website Assets

Keep high-resolution originals **separate** from `src/assets/media/` and `public/`. Filenames must use lowercase-kebab-case paths, e.g. `greek-art/relief-01.tif`. Reference them through a reviewed media registry record's optional `originalFile` path. Never reference or import originals from an Astro component or page.

Masters are preserved only when ownership/retention **and redistribution through the repository** are permitted. A public GitHub repository exposes committed masters to the public even if the website does not serve them. Keep confidential or redistribution-restricted originals in private external storage instead, and omit `originalFile` from the public registry. Large originals may require a separately approved Git LFS policy; do not add or publish large binary files without review. The image renderer is intentionally restricted to `src/assets/media/` web-source files.

See [docs/MEDIA_REGISTRY.md](../docs/MEDIA_REGISTRY.md).
