import { memo, useEffect, useRef, useState } from "react";
import { LuDownload, LuFolderArchive, LuLoader, LuX, LuImage } from "react-icons/lu";
import { Button } from "./ui";
import { renderTo, renderBlob, formatById, formatBytes } from "../lib/image";
import { buildZip, downloadBlob, fileNameFor, zipNameFor } from "../lib/export";

const THUMB = 200; // px, long side of each preview tile

export default function PreviewPanel({ sources, activeId, onSelectSource, sizes, opts, prefix }) {
  const active = sources.find((s) => s.id === activeId) || sources[0];
  const ready = !!active && sizes.length > 0;
  const total = sources.length * sizes.length;
  const [busy, setBusy] = useState(""); // "" | "zip" | size.key
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState("");
  const abortRef = useRef(null);
  const fmt = formatById(opts.format);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2600);
  };

  const downloadOne = async (size) => {
    if (!ready || busy) return;
    setBusy(size.key);
    try {
      const blob = await renderBlob(active, size, opts);
      downloadBlob(blob, fileNameFor(active, size, opts, prefix));
      flash(`Saved ${size.w}×${size.h} ${fmt.name} · ${formatBytes(blob.size)}`);
    } catch (e) {
      flash(e.message || "Export failed.");
    } finally {
      setBusy("");
    }
  };

  const downloadZip = async () => {
    if (!ready || busy) return;
    setBusy("zip");
    setProgress(0);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const blob = await buildZip({
        sources,
        sizes,
        opts,
        prefix,
        signal: controller.signal,
        onProgress: (done, n) => setProgress(done / n),
      });
      downloadBlob(blob, zipNameFor(sources, prefix));
      flash(`ZIP ready · ${total} files · ${formatBytes(blob.size)}`);
    } catch (e) {
      if (e.name !== "AbortError") flash(e.message || "Could not build the ZIP.");
    } finally {
      abortRef.current = null;
      setBusy("");
      setProgress(0);
    }
  };

  return (
    <div className="lg:sticky lg:top-20">
      <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-card lg:max-h-[calc(100vh-6rem)]">
        {/* Header row */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900">Live preview</h2>
            <p className="truncate text-[11px] text-slate-500">
              {ready
                ? `${sizes.length} size${sizes.length === 1 ? "" : "s"} · ${fmt.name} · ${opts.fit === "cover" ? "fill & crop" : `fit inside, ${opts.padding}% padding`}`
                : "Upload an image and pick sizes to see previews"}
            </p>
          </div>
          {sources.length > 1 && (
            <select
              value={active?.id}
              onChange={(e) => onSelectSource(e.target.value)}
              className="max-w-[40%] shrink-0 truncate rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-semibold text-slate-700"
              aria-label="Preview which image"
            >
              {sources.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.fileName}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Grid */}
        <div className="relative min-h-[16rem] flex-1 overflow-y-auto bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] p-3 sm:p-4">
          {ready ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2">
              {sizes.map((size) => (
                <PreviewTile key={size.key} source={active} size={size} opts={opts} busy={busy === size.key} disabled={!!busy} onDownload={() => downloadOne(size)} />
              ))}
            </ul>
          ) : (
            <div className="flex h-full min-h-[14rem] flex-col items-center justify-center gap-2 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-400 shadow ring-1 ring-slate-200">
                <LuImage className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-sm font-semibold text-slate-600">{sources.length ? "Pick at least one size in step 2" : "Your previews will appear here"}</p>
              <p className="max-w-xs text-xs text-slate-500">Every tile is rendered with the exact settings used for the download.</p>
            </div>
          )}
          {toast && (
            <div className="pointer-events-none sticky bottom-2 left-0 right-0 z-10 flex justify-center">
              <span className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-lg">{toast}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2 border-t border-slate-100 p-4">
          {busy === "zip" ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="inline-flex items-center gap-2">
                  <LuLoader className="h-4 w-4 animate-spin" aria-hidden /> Rendering {Math.round(progress * total)} / {total}
                </span>
                <button type="button" onClick={() => abortRef.current?.abort()} className="inline-flex items-center gap-1 text-rose-600 hover:underline">
                  <LuX className="h-3.5 w-3.5" aria-hidden /> Cancel
                </button>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-neon transition-[width]" style={{ width: `${Math.max(3, progress * 100)}%` }} />
              </div>
            </div>
          ) : (
            <Button variant="primary" size="lg" className="w-full" disabled={!ready || !!busy} icon={LuFolderArchive} onClick={downloadZip}>
              Download ZIP · {total} file{total === 1 ? "" : "s"}
            </Button>
          )}
          <p className="text-center text-[11px] text-slate-400">
            {sources.length > 1 ? `${sources.length} images × ${sizes.length} sizes, one folder per image and platform.` : "One folder per platform, plus a sizes.txt with the notes."}{" "}
            Nothing leaves your browser.
          </p>
        </div>
      </div>
    </div>
  );
}

/** One preview tile: a scaled render + single-file download. */
const PreviewTile = memo(function PreviewTile({ source, size, opts, busy, disabled, onDownload }) {
  const ref = useRef(null);
  const scale = Math.min(1, THUMB / Math.max(size.w, size.h));
  const w = Math.max(1, Math.round(size.w * scale));
  const h = Math.max(1, Math.round(size.h * scale));
  const Icon = size.platform.icon;
  const transparent = opts.background === "transparent" && formatById(opts.format).alpha;

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let cancelled = false;
    // Defer a frame so many tiles don't block the slider interaction
    const id = requestAnimationFrame(() => {
      if (!cancelled) renderTo(el, source, w, h, opts, source.preview);
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(id);
    };
  }, [source, w, h, opts]);

  return (
    <li className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className={`flex aspect-square items-center justify-center p-2 ${transparent ? "bg-checker" : "bg-slate-100"}`}>
        <canvas ref={ref} width={w} height={h} className="max-h-full max-w-full shadow ring-1 ring-black/5" style={{ width: w, height: h }} aria-label={`${size.platform.name} ${size.name} preview`} />
      </div>
      <div className="flex items-center gap-2 border-t border-slate-100 px-2.5 py-2">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-white" style={{ background: size.platform.color, color: size.platform.onColor || "#fff" }} title={size.platform.name}>
          <Icon size={12} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11px] font-semibold text-slate-800">{size.name}</span>
          <span className="block font-mono text-[10px] text-slate-500">
            {size.w}×{size.h}
          </span>
        </span>
        <button
          type="button"
          onClick={onDownload}
          disabled={disabled}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-ink hover:text-neon disabled:opacity-40"
          aria-label={`Download ${size.platform.name} ${size.name}`}
          title="Download this size"
        >
          {busy ? <LuLoader className="h-3.5 w-3.5 animate-spin" aria-hidden /> : <LuDownload className="h-3.5 w-3.5" aria-hidden />}
        </button>
      </div>
    </li>
  );
});
