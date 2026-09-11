import { useCallback, useEffect, useMemo, useState } from "react";
import { LuArrowDown } from "react-icons/lu";
import Header from "./components/Header";
import Hero from "./components/Hero";
import UploadZone from "./components/UploadZone";
import SizePicker from "./components/SizePicker";
import OutputPanel from "./components/OutputPanel";
import PreviewPanel from "./components/PreviewPanel";
import Guide, { Footer } from "./components/Guide";
import { PACKS, keysForKinds, sizeByKey, customToSizes, guessMode } from "./data/sizes";
import { DEFAULT_OPTIONS, loadSource, releaseSource } from "./lib/image";
import { loadSettings, saveSettings, clearSettings } from "./lib/storage";

const packKeys = (id) => keysForKinds(PACKS.find((p) => p.id === id).kinds);

const initialState = () => {
  const s = loadSettings();
  return {
    selected: Array.isArray(s?.selected) ? s.selected : packKeys("logo"),
    customSizes: Array.isArray(s?.customSizes) ? s.customSizes : [],
    opts: { ...DEFAULT_OPTIONS, ...(s?.opts || {}), focus: { ...DEFAULT_OPTIONS.focus, ...(s?.opts?.focus || {}) } },
    prefix: typeof s?.prefix === "string" ? s.prefix : "",
    touched: !!s,
  };
};

export default function App() {
  const [init] = useState(initialState);
  const [sources, setSources] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(init.selected);
  const [customSizes, setCustomSizes] = useState(init.customSizes);
  const [opts, setOpts] = useState(init.opts);
  const [prefix, setPrefix] = useState(init.prefix);
  const [touched, setTouched] = useState(init.touched);

  const customList = useMemo(() => customToSizes(customSizes), [customSizes]);
  const sizes = useMemo(
    () => selected.map((k) => sizeByKey(k) || customList.find((c) => c.key === k)).filter(Boolean),
    [selected, customList],
  );

  const addFiles = useCallback(
    async (files) => {
      setLoading(true);
      setError("");
      const loaded = [];
      const problems = [];
      for (const file of files) {
        try {
          loaded.push(await loadSource(file));
        } catch (e) {
          problems.push(e.message);
        }
      }
      if (loaded.length) {
        // First upload: pick the pack that matches the image, unless the user already changed things.
        if (sources.length === 0 && !touched) {
          const mode = guessMode(loaded[0].width, loaded[0].height);
          setSelected(packKeys(mode));
          // Logos: transparent, padded. Banners: keep everything visible, fill the rest with a blurred copy.
          setOpts((o) => ({ ...o, fit: "contain", background: mode === "logo" ? "transparent" : "blur", format: mode === "logo" || loaded[0].hasAlpha ? "png" : "jpg" }));
        }
        setSources((prev) => [...prev, ...loaded]);
        setActiveId((cur) => cur ?? loaded[0].id);
      }
      if (problems.length) setError(problems.join(" "));
      setLoading(false);
    },
    [sources.length, touched],
  );

  const removeSource = (id) => {
    setSources((prev) => {
      const gone = prev.find((s) => s.id === id);
      if (gone) releaseSource(gone);
      const next = prev.filter((s) => s.id !== id);
      setActiveId((cur) => (cur === id ? next[0]?.id ?? null : cur));
      return next;
    });
  };

  const reset = () => {
    sources.forEach(releaseSource);
    setSources([]);
    setActiveId(null);
    setError("");
    setSelected(packKeys("logo"));
    setCustomSizes([]);
    setOpts(DEFAULT_OPTIONS);
    setPrefix("");
    setTouched(false);
    clearSettings();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Remember settings (not images) between visits, once the user changes anything.
  useEffect(() => {
    if (!touched) return undefined;
    const t = setTimeout(() => saveSettings({ selected, customSizes, opts, prefix }), 300);
    return () => clearTimeout(t);
  }, [touched, selected, customSizes, opts, prefix]);

  const touch = (setter) => (v) => {
    setTouched(true);
    setter(v);
  };

  const canReset = sources.length > 0 || touched;
  const ready = sources.length > 0 && sizes.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onReset={reset} canReset={canReset} />
      <Hero />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_400px] xl:grid-cols-[minmax(0,1fr)_460px]">
          <div className="space-y-6">
            <UploadZone sources={sources} activeId={activeId} onAdd={addFiles} onRemove={removeSource} onSelect={setActiveId} busy={loading} error={error} />
            <SizePicker selected={selected} onChange={touch(setSelected)} customSizes={customSizes} onCustomChange={touch(setCustomSizes)} />
            <OutputPanel opts={opts} onChange={touch(setOpts)} prefix={prefix} onPrefixChange={touch(setPrefix)} />
          </div>
          <div id="preview">
            <PreviewPanel sources={sources} activeId={activeId} onSelectSource={setActiveId} sizes={sizes} opts={opts} prefix={prefix} />
          </div>
        </div>

        <Guide />
      </main>

      <Footer />

      {/* Mobile: jump to the previews once there is something to see */}
      {ready && (
        <a
          href="#preview"
          className="fixed bottom-4 left-1/2 z-30 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-neon px-4 py-2.5 text-sm font-bold text-ink shadow-neon lg:hidden"
        >
          <LuArrowDown className="h-4 w-4" aria-hidden /> See previews & download
        </a>
      )}
    </div>
  );
}
