import JSZip from "jszip";
import { renderBlob, formatById } from "./image";
import { CUSTOM_PLATFORM_ID } from "../data/sizes";

export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
};

const slug = (s = "") =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/** `mybrand-facebook-page-cover-1640x624.png` */
export const fileNameFor = (source, size, opts, prefix) => {
  const fmt = formatById(opts.format);
  const name = slug(prefix) || source.name;
  const platform = size.platform.id === CUSTOM_PLATFORM_ID ? "" : `${size.platform.id}-`;
  return `${name}-${platform}${slug(size.id)}-${size.w}x${size.h}.${fmt.ext}`;
};

const folderFor = (size) => (size.platform.id === CUSTOM_PLATFORM_ID ? "custom-sizes" : size.platform.id);

const manifest = (sources, sizes, opts) => {
  const fmt = formatById(opts.format);
  const lines = [
    "AiTechies Social Image Sizes — https://aitechiessocialimagesize.netlify.app/",
    `Generated ${new Date().toLocaleString()} · ${sources.length} source image${sources.length === 1 ? "" : "s"} · ${sizes.length} size${sizes.length === 1 ? "" : "s"} · ${fmt.name}`,
    `Fit: ${opts.fit === "cover" ? "fill & crop" : `fit inside, ${opts.padding}% padding`} · Background: ${opts.background === "color" ? opts.color : opts.background}`,
    "",
  ];
  const byPlatform = new Map();
  sizes.forEach((s) => {
    const list = byPlatform.get(s.platform.name) || [];
    list.push(s);
    byPlatform.set(s.platform.name, list);
  });
  byPlatform.forEach((list, platform) => {
    lines.push(platform);
    list.forEach((s) => lines.push(`  - ${s.name}: ${s.w}×${s.h} px${s.note ? ` — ${s.note}` : ""}`));
    lines.push("");
  });
  lines.push("All images were generated in your browser. Brand names belong to their respective owners.");
  return lines.join("\n");
};

/**
 * Renders every (source × size) pair into a ZIP.
 * Layout: one folder per platform; with several sources, one folder per source first.
 * `onProgress(done, total)` is called after every file.
 */
export const buildZip = async ({ sources, sizes, opts, prefix, onProgress, signal }) => {
  const zip = new JSZip();
  const total = sources.length * sizes.length;
  let done = 0;
  for (const source of sources) {
    const root = sources.length > 1 ? zip.folder(slug(prefix) ? `${slug(prefix)}-${source.name}` : source.name) : zip;
    for (const size of sizes) {
      if (signal?.aborted) throw new DOMException("Cancelled", "AbortError");
      const blob = await renderBlob(source, size, opts);
      root.folder(folderFor(size)).file(fileNameFor(source, size, opts, prefix), blob);
      done += 1;
      onProgress?.(done, total);
      // Yield to the UI between files so the progress bar can paint
      await new Promise((r) => setTimeout(r, 0));
    }
  }
  zip.file("sizes.txt", manifest(sources, sizes, opts));
  return zip.generateAsync({ type: "blob", compression: "STORE" });
};

export const zipNameFor = (sources, prefix) => {
  const base = slug(prefix) || (sources.length === 1 ? sources[0].name : "images");
  return `${base}-social-media-sizes.zip`;
};
