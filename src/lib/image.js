/**
 * Image engine. Everything runs on <canvas> inside the browser — nothing is
 * uploaded. `renderTo()` is used both for the live previews (scaled down)
 * and for the full-size exports, so the preview *is* the download.
 */

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml", "image/bmp", "image/avif"];
export const ACCEPT_ATTR = ACCEPTED.join(",");
export const MAX_SOURCE_BYTES = 40 * 1024 * 1024;

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

export const baseName = (filename = "image") =>
  filename
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "image";

const loadImg = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("This file could not be read as an image."));
    img.src = url;
  });

/**
 * SVGs without width/height have no intrinsic pixel size, so the browser
 * reports 0 or 300×150. We rasterise them large so downscaling stays crisp.
 */
const svgToRaster = async (file) => {
  const text = await file.text();
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(text)}`;
  const img = await loadImg(url);
  let w = img.naturalWidth || 0;
  let h = img.naturalHeight || 0;
  if (!w || !h) {
    const m = /viewBox=["']\s*[\d.-]+[\s,]+[\d.-]+[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(text);
    if (m) [w, h] = [parseFloat(m[1]), parseFloat(m[2])];
  }
  if (!w || !h) [w, h] = [1024, 1024];
  const target = 2048;
  const scale = target / Math.max(w, h);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(w * scale);
  canvas.height = Math.round(h * scale);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
};

/** Reads a File into a source object with a decoded bitmap and a small preview copy. */
export const loadSource = async (file) => {
  if (!file.type.startsWith("image/") || (file.type && !ACCEPTED.includes(file.type) && !/\.(png|jpe?g|webp|gif|svg|bmp|avif)$/i.test(file.name))) {
    throw new Error(`${file.name}: not a supported image (PNG, JPG, WebP, GIF, SVG).`);
  }
  if (file.size > MAX_SOURCE_BYTES) throw new Error(`${file.name}: larger than 40 MB.`);

  let img;
  if (file.type === "image/svg+xml" || /\.svg$/i.test(file.name)) {
    img = await svgToRaster(file);
  } else {
    try {
      img = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      img = await loadImg(URL.createObjectURL(file));
    }
  }
  const width = img.width || img.naturalWidth;
  const height = img.height || img.naturalHeight;
  if (!width || !height) throw new Error(`${file.name}: could not decode this image.`);

  return {
    id: uid(),
    name: baseName(file.name),
    fileName: file.name,
    type: file.type,
    bytes: file.size,
    width,
    height,
    img,
    preview: downscale(img, width, height, 1024),
    hasAlpha: file.type !== "image/jpeg",
  };
};

export const releaseSource = (src) => {
  try {
    src.img?.close?.();
  } catch {
    /* ignore */
  }
};

/** Draws `img` into a canvas no larger than `max` on its long side (stepped halving keeps it sharp). */
export const downscale = (img, sw, sh, max) => {
  const scale = Math.min(1, max / Math.max(sw, sh));
  return scaledCopy(img, sw, sh, Math.round(sw * scale), Math.round(sh * scale));
};

/**
 * Returns a canvas of exactly dw×dh. When shrinking by more than 2×, the
 * image is halved step by step; a single drawImage() would alias badly.
 */
const scaledCopy = (img, sw, sh, dw, dh) => {
  let cur = img;
  let cw = sw;
  let ch = sh;
  while (cw / 2 >= dw && ch / 2 >= dh) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.floor(cw / 2));
    c.height = Math.max(1, Math.floor(ch / 2));
    const ctx = c.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(cur, 0, 0, cw, ch, 0, 0, c.width, c.height);
    cur = c;
    cw = c.width;
    ch = c.height;
  }
  const out = document.createElement("canvas");
  out.width = Math.max(1, dw);
  out.height = Math.max(1, dh);
  const ctx = out.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(cur, 0, 0, cw, ch, 0, 0, out.width, out.height);
  return out;
};

export const DEFAULT_OPTIONS = {
  fit: "contain", // contain | cover
  padding: 8, // % of the shorter side, contain only
  background: "transparent", // transparent | color | blur
  color: "#FFFFFF",
  focus: { x: 0.5, y: 0.5 }, // cover only: which part of the image to keep
  format: "png", // png | jpg | webp
  quality: 0.92,
};

export const FORMATS = [
  { id: "png", name: "PNG", mime: "image/png", ext: "png", alpha: true, hint: "Lossless, transparent" },
  { id: "jpg", name: "JPG", mime: "image/jpeg", ext: "jpg", alpha: false, hint: "Smallest, no transparency" },
  { id: "webp", name: "WebP", mime: "image/webp", ext: "webp", alpha: true, hint: "Small and transparent" },
];
export const formatById = (id) => FORMATS.find((f) => f.id === id) || FORMATS[0];

/** Geometry of the drawn image inside a w×h frame. */
export const layoutFor = (sw, sh, w, h, opts) => {
  if (opts.fit === "cover") {
    const scale = Math.max(w / sw, h / sh);
    const dw = sw * scale;
    const dh = sh * scale;
    const fx = opts.focus?.x ?? 0.5;
    const fy = opts.focus?.y ?? 0.5;
    return { dx: (w - dw) * fx, dy: (h - dh) * fy, dw, dh };
  }
  const pad = (Math.min(w, h) * (opts.padding || 0)) / 100;
  const aw = Math.max(1, w - pad * 2);
  const ah = Math.max(1, h - pad * 2);
  const scale = Math.min(aw / sw, ah / sh);
  const dw = sw * scale;
  const dh = sh * scale;
  return { dx: (w - dw) / 2, dy: (h - dh) / 2, dw, dh };
};

/**
 * Renders `source` into `canvas` at w×h with the given options.
 * `img` may be the full bitmap or the preview copy (for thumbnails).
 */
export const renderTo = (canvas, source, w, h, opts, img = source.img) => {
  const W = Math.max(1, Math.round(w));
  const H = Math.max(1, Math.round(h));
  if (canvas.width !== W) canvas.width = W;
  if (canvas.height !== H) canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, W, H);
  const sw = img.width || img.naturalWidth;
  const sh = img.height || img.naturalHeight;
  const fmt = formatById(opts.format);
  const wantsOpaque = !fmt.alpha;

  // Background
  if (opts.background === "color" || (wantsOpaque && opts.background === "transparent")) {
    ctx.fillStyle = opts.background === "color" ? opts.color : "#FFFFFF";
    ctx.fillRect(0, 0, W, H);
  } else if (opts.background === "blur") {
    const { dx, dy, dw, dh } = layoutFor(sw, sh, W, H, { fit: "cover", focus: { x: 0.5, y: 0.5 } });
    const r = Math.max(8, Math.round(Math.max(W, H) / 40));
    ctx.save();
    ctx.fillStyle = "#111111";
    ctx.fillRect(0, 0, W, H);
    ctx.filter = `blur(${r}px)`;
    // Overdraw slightly so blurred edges don't show the fill colour
    ctx.drawImage(img, dx - r * 2, dy - r * 2, dw + r * 4, dh + r * 4);
    ctx.restore();
    ctx.fillStyle = "rgba(0,0,0,0.18)";
    ctx.fillRect(0, 0, W, H);
  }

  // Subject
  const { dx, dy, dw, dh } = layoutFor(sw, sh, W, H, opts);
  const tw = Math.max(1, Math.round(dw));
  const th = Math.max(1, Math.round(dh));
  const shrink = tw / sw;
  const src = shrink < 0.5 ? scaledCopy(img, sw, sh, tw, th) : img;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (src === img) ctx.drawImage(img, dx, dy, dw, dh);
  else ctx.drawImage(src, dx, dy, tw, th);
  return canvas;
};

export const canvasToBlob = (canvas, opts) => {
  const fmt = formatById(opts.format);
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("The browser could not encode this image."))),
      fmt.mime,
      fmt.alpha && fmt.id === "png" ? undefined : opts.quality,
    ),
  );
};

/** Full-size export of one source at one size. */
export const renderBlob = async (source, size, opts) => {
  const canvas = document.createElement("canvas");
  renderTo(canvas, source, size.w, size.h, opts);
  const blob = await canvasToBlob(canvas, opts);
  canvas.width = canvas.height = 0; // free memory promptly (Safari)
  return blob;
};

export const formatBytes = (n) => (n < 1024 * 1024 ? `${Math.max(1, Math.round(n / 1024))} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);
