# Astro Image Sources

This directory is the **approved image source library**, not a gallery or public download location. Images do not belong here until the owner approves the specific artwork and its rights/provenance. Every image file must have a corresponding unique `src/data/media.ts` record.

Use:
- `editorial/` for approved article/card/hero artwork;
- `reference/` for historical manuscripts, artifact photography and diagrams whose meaning must remain intact;
- `decorative/` for intentional non-semantic ornaments.

Paths and filenames use lowercase kebab-case, e.g. `reference/greek-art/relief-01.png`. Read [the media registry guidelines](../../../docs/MEDIA_REGISTRY.md) before adding anything.

Do not put high-resolution masters here: preserve those separately under `media-originals/`. The shared renderer is now implemented (Prompt 20). See [docs/MEDIA_RENDERER.md](../../../docs/MEDIA_RENDERER.md) for responsive variants and priority rules.
