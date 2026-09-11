import { useRef, useState } from "react";
import { LuUpload, LuX, LuImagePlus, LuLoader, LuTriangleAlert, LuCheck } from "react-icons/lu";
import { Card, StepHeading } from "./ui";
import { ACCEPT_ATTR, formatBytes } from "../lib/image";
import { guessMode } from "../data/sizes";

export default function UploadZone({ sources, activeId, onAdd, onRemove, onSelect, busy, error }) {
  const inputRef = useRef(null);
  const [over, setOver] = useState(false);

  const pick = (files) => {
    const list = Array.from(files || []).filter((f) => f.type.startsWith("image/") || /\.(png|jpe?g|webp|gif|svg|bmp|avif)$/i.test(f.name));
    if (list.length) onAdd(list);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setOver(false);
    pick(e.dataTransfer.files);
  };

  const onPaste = (e) => {
    const files = Array.from(e.clipboardData?.files || []);
    if (files.length) pick(files);
  };

  return (
    <Card className="p-5 sm:p-6" onPaste={onPaste}>
      <StepHeading
        step={1}
        title="Upload your logo or banner"
        subtitle="PNG, JPG, WebP or SVG. Add several files to convert them all at once."
        right={
          sources.length > 0 && (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {sources.length} image{sources.length === 1 ? "" : "s"}
            </span>
          )
        }
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={`group flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition sm:py-10 ${
          over ? "border-neon bg-neon/5" : "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100/70"
        }`}
        aria-label="Upload images"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-neon shadow-sm transition group-hover:shadow-neon">
          {busy ? <LuLoader className="h-5 w-5 animate-spin" aria-hidden /> : <LuUpload className="h-5 w-5" aria-hidden />}
        </span>
        <span className="text-sm font-semibold text-slate-800">
          {busy ? "Reading your images…" : sources.length ? "Add more images" : "Drop images here, or click to browse"}
        </span>
        <span className="text-xs text-slate-500">You can also paste a copied image. Up to 40 MB each. Nothing is uploaded.</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        className="hidden"
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <LuTriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> {error}
        </p>
      )}

      {sources.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4" aria-label="Uploaded images">
          {sources.map((s) => {
            const active = s.id === activeId;
            const mode = guessMode(s.width, s.height);
            return (
              <li key={s.id} className="relative">
                <button
                  type="button"
                  onClick={() => onSelect(s.id)}
                  className={`flex w-full flex-col overflow-hidden rounded-2xl border text-left transition ${
                    active ? "border-ink ring-2 ring-neon/60" : "border-slate-200 hover:border-slate-300"
                  }`}
                  aria-pressed={active}
                  title={`${s.fileName} · ${s.width}×${s.height}`}
                >
                  <span className="bg-checker flex aspect-[4/3] items-center justify-center overflow-hidden p-2">
                    <Thumb source={s} />
                  </span>
                  <span className="border-t border-slate-100 bg-white px-2.5 py-2">
                    <span className="block truncate text-xs font-semibold text-slate-800">{s.fileName}</span>
                    <span className="block text-[11px] text-slate-500">
                      {s.width}×{s.height} · {formatBytes(s.bytes)} ·{" "}
                      <span className={mode === "logo" ? "text-brand-600" : "text-violet-600"}>{mode === "logo" ? "looks like a logo" : "looks like a banner"}</span>
                    </span>
                  </span>
                </button>
                {active && (
                  <span className="absolute left-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-neon text-ink shadow">
                    <LuCheck size={11} strokeWidth={3} />
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(s.id)}
                  className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-slate-500 shadow ring-1 ring-slate-200 transition hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Remove ${s.fileName}`}
                >
                  <LuX size={12} strokeWidth={2.5} />
                </button>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-full min-h-[7rem] w-full flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-slate-300 text-xs font-semibold text-slate-500 transition hover:border-slate-400 hover:text-slate-700"
            >
              <LuImagePlus className="h-5 w-5" aria-hidden /> Add another
            </button>
          </li>
        </ul>
      )}
    </Card>
  );
}

/** Tiny <canvas> thumbnail drawn from the source's preview copy. */
function Thumb({ source }) {
  const ref = (el) => {
    if (!el) return;
    const p = source.preview;
    const scale = Math.min(1, 160 / Math.max(p.width, p.height));
    el.width = Math.max(1, Math.round(p.width * scale));
    el.height = Math.max(1, Math.round(p.height * scale));
    const ctx = el.getContext("2d");
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(p, 0, 0, el.width, el.height);
  };
  return <canvas ref={ref} className="max-h-full max-w-full object-contain" aria-hidden />;
}
