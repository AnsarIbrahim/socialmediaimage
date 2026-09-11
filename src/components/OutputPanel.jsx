import { LuMaximize, LuCrop, LuBan, LuPalette, LuDroplets, LuInfo } from "react-icons/lu";
import { Card, StepHeading, Label, ColorInput, Chip, Input } from "./ui";
import { FORMATS, formatById } from "../lib/image";

const SWATCHES = ["#FFFFFF", "#000000", "#050505", "#0F172A", "#F8FAFC", "#00FF88", "#00D4FF", "#1877F2", "#E1306C", "#FF0000"];

const FITS = [
  { id: "contain", name: "Fit inside", desc: "Whole image visible, padded to the frame. Best for logos.", icon: LuMaximize },
  { id: "cover", name: "Fill & crop", desc: "Fills the frame, trims the edges. Best for photos & banners.", icon: LuCrop },
];

const BACKGROUNDS = [
  { id: "transparent", name: "Transparent", icon: LuBan },
  { id: "color", name: "Colour", icon: LuPalette },
  { id: "blur", name: "Blurred image", icon: LuDroplets },
];

export default function OutputPanel({ opts, onChange, prefix, onPrefixChange }) {
  const set = (k, v) => onChange({ ...opts, [k]: v });
  const fmt = formatById(opts.format);
  const transparentUnsupported = !fmt.alpha && opts.background === "transparent";

  return (
    <Card className="p-5 sm:p-6">
      <StepHeading step={3} title="How should it fit?" subtitle="Applies to every size — the preview on the right updates live." />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Fit */}
        <div className="sm:col-span-2">
          <Label>Fit</Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {FITS.map((f) => {
              const Icon = f.icon;
              const active = opts.fit === f.id;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => set("fit", f.id)}
                  className={`flex items-start gap-3 rounded-2xl border p-3 text-left transition ${
                    active ? "border-ink bg-slate-50 ring-2 ring-neon/60" : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                  aria-pressed={active}
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${active ? "bg-ink text-neon" : "bg-slate-100 text-slate-600"}`}>
                    <Icon className="h-4.5 w-4.5" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-slate-900">{f.name}</span>
                    <span className="block text-[11px] leading-snug text-slate-500">{f.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Padding (contain) or focus (cover) */}
        {opts.fit === "contain" ? (
          <div>
            <Label htmlFor="padding" hint={`— ${opts.padding}% of the shorter side`}>
              Breathing room
            </Label>
            <input
              id="padding"
              type="range"
              min={0}
              max={30}
              step={1}
              value={opts.padding}
              onChange={(e) => set("padding", Number(e.target.value))}
              className="w-full accent-ink"
            />
            <p className="mt-1 text-[11px] text-slate-500">Profile pictures are cropped to circles — 8–12% keeps the logo clear of the edge.</p>
          </div>
        ) : (
          <div>
            <Label hint="— which part to keep when cropping">Focus point</Label>
            <div className="grid w-fit grid-cols-3 gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm" role="radiogroup" aria-label="Focus point">
              {[0, 0.5, 1].flatMap((y) =>
                [0, 0.5, 1].map((x) => {
                  const active = opts.focus.x === x && opts.focus.y === y;
                  return (
                    <button
                      key={`${x}-${y}`}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      aria-label={`Focus ${["left", "centre", "right"][x * 2]} ${["top", "middle", "bottom"][y * 2]}`}
                      onClick={() => set("focus", { x, y })}
                      className={`h-8 w-8 rounded-lg transition ${active ? "bg-ink" : "bg-slate-100 hover:bg-slate-200"}`}
                    >
                      <span className={`mx-auto block h-2 w-2 rounded-full ${active ? "bg-neon" : "bg-slate-400"}`} />
                    </button>
                  );
                }),
              )}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Wide banners crop the sides for square sizes; tall stories crop the top and bottom.</p>
          </div>
        )}

        {/* Background */}
        <div>
          <Label>Background</Label>
          <div className="flex flex-wrap gap-1.5">
            {BACKGROUNDS.map((b) => {
              const Icon = b.icon;
              return (
                <Chip key={b.id} active={opts.background === b.id} onClick={() => set("background", b.id)} className="inline-flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5" aria-hidden /> {b.name}
                </Chip>
              );
            })}
          </div>
          {opts.background === "color" && (
            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {SWATCHES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("color", c)}
                    className={`h-7 w-7 rounded-full border-2 transition ${opts.color === c ? "scale-110 border-neon ring-1 ring-ink" : "border-white shadow"}`}
                    style={{ background: c }}
                    aria-label={`Background ${c}`}
                  />
                ))}
              </div>
              <ColorInput id="bg-color" label="Custom colour" value={opts.color} onChange={(v) => set("color", v)} />
            </div>
          )}
          {opts.fit === "cover" && (
            <p className="mt-2 flex items-start gap-1.5 text-[11px] text-slate-500">
              <LuInfo className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> Fill &amp; crop covers the whole frame, so the background only shows with “Fit inside”.
            </p>
          )}
          {transparentUnsupported && (
            <p className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-700">
              <LuInfo className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden /> JPG has no transparency — transparent areas will be white. Choose PNG or WebP to keep them.
            </p>
          )}
        </div>

        {/* Format */}
        <div>
          <Label>File format</Label>
          <div className="flex flex-wrap gap-1.5">
            {FORMATS.map((f) => (
              <Chip key={f.id} active={opts.format === f.id} onClick={() => set("format", f.id)} title={f.hint}>
                {f.name} <span className="opacity-70">· {f.hint}</span>
              </Chip>
            ))}
          </div>
          {fmt.id !== "png" && (
            <div className="mt-3">
              <Label htmlFor="quality" hint={`— ${Math.round(opts.quality * 100)}%`}>
                Quality
              </Label>
              <input
                id="quality"
                type="range"
                min={0.5}
                max={1}
                step={0.01}
                value={opts.quality}
                onChange={(e) => set("quality", Number(e.target.value))}
                className="w-full accent-ink"
              />
            </div>
          )}
        </div>

        {/* File name */}
        <div>
          <Label htmlFor="prefix" hint="— optional">
            File name prefix
          </Label>
          <Input id="prefix" value={prefix} onChange={(e) => onPrefixChange(e.target.value)} placeholder="e.g. mybrand" maxLength={40} spellCheck={false} />
          <p className="mt-1 truncate font-mono text-[11px] text-slate-500">
            {(prefix.trim() || "your-image").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-instagram-profile-320x320.{fmt.ext}
          </p>
        </div>
      </div>
    </Card>
  );
}
