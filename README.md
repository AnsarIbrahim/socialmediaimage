# AiTechies Social Image Sizes

An [AiTechies Studio](https://ansaribrahim.me/) product. Upload a logo or banner once and download every social media size as a ZIP — for digital marketing teams, agencies and small businesses.

**Live:** https://aitechiessocialimagesize.netlify.app

**Platforms:** Facebook · Instagram · YouTube · X · LinkedIn · TikTok · WhatsApp · Threads · Pinterest · Snapchat · Telegram · Google Business · Website (OG image, favicons, PWA icons) · App stores (Play Store, App Store).

## Features

- **Logo pack / Banner pack / Everything** — one click selects the right sizes; the pack is picked automatically from the shape of the first image you upload.
- **Every size, every platform** — profile pictures, covers, posts, stories/reels, thumbnails and app icons, with notes on safe areas (YouTube banner, Facebook cover…).
- **Bulk** — add several images; the ZIP has one folder per image and one per platform.
- **Fit inside or Fill & crop** — padding slider for logos, 3×3 focus point for banners.
- **Backgrounds** — transparent, any colour, or a blurred copy of the image.
- **PNG / JPG / WebP** with a quality slider, and a file-name prefix (`mybrand-instagram-profile-320x320.png`).
- **Custom sizes** — add any width × height.
- **Sharp output** — stepped downscaling (halving) instead of a single resample, SVG sources are rasterised at 2048 px first, EXIF orientation is respected.
- **Live preview** — every tile is drawn with the exact settings used for the download; single-size download from each tile.
- **Private** — everything runs on a `<canvas>` in the browser. Nothing is uploaded, no accounts.
- Settings (sizes, fit, format) are remembered in the browser; images are not.

## Development

```bash
npm install
npm start        # http://localhost:3000
npm run build    # production build in ./build
```

Stack: Create React App, React 19, Tailwind CSS 3, `jszip`, `react-icons` — the same stack and brand kit as [QR Studio](https://aitechiesqr.netlify.app/).

## Project layout

```
src/
  App.jsx                    state, auto pack selection, settings persistence
  data/sizes.js              platforms, sizes, kinds, packs, custom sizes
  data/company.js            shared AiTechies identity (keep in sync with the company site)
  lib/image.js               decode, stepped downscale, fit/crop/background rendering, encode
  lib/export.js              file names, ZIP building (JSZip), sizes.txt manifest
  lib/storage.js             remembered settings (localStorage)
  components/UploadZone.jsx  drag & drop / paste / multi-file upload, source list
  components/SizePicker.jsx  packs, kind filter, per-platform checklists, custom sizes
  components/OutputPanel.jsx fit, padding / focus point, background, format, prefix
  components/PreviewPanel.jsx live tiles, single download, ZIP with progress
  components/Brand.jsx, Header.jsx, Hero.jsx, Guide.jsx, ui/   shared brand UI
```

## Deploying

The build is fully static; `netlify.toml` sets the build command, publish folder, SPA redirect and cache headers.

- **Netlify UI:** Add new site → Import from GitHub → this repo. Build command `npm run build`, publish directory `build`. Set the site name to `aitechiessocialimagesize`.
- **CLI:** `npx netlify-cli login`, then `npx netlify-cli init` (link to the site) and `npm run deploy`.

---

© AITechies Studio · Made with ❤️ in Tamil Nadu, India. Brand identity (logo, colours, fonts) is shared with the company site; see `src/data/company.js` and `src/components/Brand.jsx`. Third-party brand names and logos belong to their respective owners.
