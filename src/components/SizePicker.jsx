import { useMemo, useState } from "react";
import { LuCheck, LuPlus, LuTrash2, LuSearch, LuChevronDown } from "react-icons/lu";
import { PLATFORMS, KINDS, PACKS, keysForKinds, customToSizes, CUSTOM_PLATFORM } from "../data/sizes";
import { Card, StepHeading, Chip, Input, Button, Label } from "./ui";

const sameSet = (a, b) => a.length === b.length && a.every((k) => b.includes(k));

export default function SizePicker({ selected, onChange, customSizes, onCustomChange }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState("all");
  const [collapsed, setCollapsed] = useState({});
  const [draft, setDraft] = useState({ name: "", w: "", h: "" });

  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const packKeys = useMemo(() => PACKS.map((p) => [p.id, keysForKinds(p.kinds)]), []);
  const activePack = packKeys.find(([, keys]) => sameSet(keys, selected))?.[0];

  const toggle = (key) => onChange(selectedSet.has(key) ? selected.filter((k) => k !== key) : [...selected, key]);
  const setMany = (keys, on) => {
    const next = new Set(selected);
    keys.forEach((k) => (on ? next.add(k) : next.delete(k)));
    onChange([...next]);
  };

  const q = query.trim().toLowerCase();
  const visible = PLATFORMS.map((p) => ({
    ...p,
    sizes: p.sizes.filter(
      (s) =>
        (kind === "all" || s.kind === kind) &&
        (!q || `${p.name} ${s.name} ${s.w}x${s.h} ${s.kind}`.toLowerCase().includes(q)),
    ),
  })).filter((p) => p.sizes.length > 0);

  const custom = customToSizes(customSizes);
  const addCustom = () => {
    const w = parseInt(draft.w, 10);
    const h = parseInt(draft.h, 10);
    if (!(w > 0 && h > 0 && w <= 8192 && h <= 8192)) return;
    const name = draft.name.trim() || `Custom ${w}×${h}`;
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 30) || `${w}x${h}`;
    const taken = new Set(customSizes.map((c) => c.id));
    let id = base;
    let n = 2;
    while (taken.has(id)) id = `${base}-${n++}`;
    const item = { id, name, w, h };
    onCustomChange([...customSizes, item]);
    onChange([...selected, `${CUSTOM_PLATFORM.id}/${id}`]);
    setDraft({ name: "", w: "", h: "" });
  };
  const removeCustom = (id) => {
    onCustomChange(customSizes.filter((c) => c.id !== id));
    onChange(selected.filter((k) => k !== `${CUSTOM_PLATFORM.id}/${id}`));
  };

  return (
    <Card className="p-5 sm:p-6">
      <StepHeading
        step={2}
        title="Choose the sizes you need"
        subtitle="Start from a pack, then tick or untick anything."
        right={
          <span className="rounded-full bg-ink px-2.5 py-1 font-heading text-xs font-bold text-neon">
            {selected.length} selected
          </span>
        }
      />

      {/* Packs */}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {PACKS.map((p) => {
          const active = activePack === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(keysForKinds(p.kinds))}
              className={`relative rounded-2xl border p-3 text-left transition ${
                active ? "border-ink bg-slate-50 ring-2 ring-neon/60" : "border-slate-200 bg-white hover:border-slate-300"
              }`}
              aria-pressed={active}
            >
              <span className="block text-sm font-bold text-slate-900">{p.name}</span>
              <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">{p.desc}</span>
              <span className="mt-1.5 block text-[11px] font-semibold text-slate-400">{keysForKinds(p.kinds).length} sizes</span>
              {active && (
                <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-neon text-ink">
                  <LuCheck size={10} strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <LuSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: cover, story, 1080, YouTube…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            aria-label="Search sizes"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={kind === "all"} onClick={() => setKind("all")}>
            All
          </Chip>
          {KINDS.map((k) => (
            <Chip key={k.id} active={kind === k.id} onClick={() => setKind(k.id)} title={k.desc}>
              {k.name}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-end gap-3 text-xs">
        <button type="button" className="font-semibold text-slate-600 hover:text-ink" onClick={() => setMany(visible.flatMap((p) => p.sizes.map((s) => `${p.id}/${s.id}`)), true)}>
          Select all shown
        </button>
        <span className="text-slate-300">·</span>
        <button type="button" className="font-semibold text-slate-600 hover:text-rose-600" onClick={() => onChange([])}>
          Clear
        </button>
      </div>

      {/* Platforms */}
      <div className="space-y-2" role="group" aria-label="Sizes by platform">
        {visible.map((p) => {
          const Icon = p.icon;
          const keys = p.sizes.map((s) => `${p.id}/${s.id}`);
          const count = keys.filter((k) => selectedSet.has(k)).length;
          const all = count === keys.length;
          const open = !collapsed[p.id];
          return (
            <div key={p.id} className="overflow-hidden rounded-2xl border border-slate-200">
              <div className="flex items-center gap-3 bg-slate-50 px-3 py-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white" style={{ background: p.color, color: p.onColor || "#fff" }}>
                  <Icon size={16} />
                </span>
                <button
                  type="button"
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  onClick={() => setCollapsed((c) => ({ ...c, [p.id]: !c[p.id] }))}
                  aria-expanded={open}
                >
                  <span className="truncate text-sm font-bold text-slate-900">{p.name}</span>
                  <span className="text-[11px] text-slate-500">
                    {count}/{keys.length}
                  </span>
                  <LuChevronDown className={`h-4 w-4 text-slate-400 transition ${open ? "" : "-rotate-90"}`} aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setMany(keys, !all)}
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                    all ? "border-ink bg-ink text-neon" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {all ? "All on" : "Select all"}
                </button>
              </div>
              {open && (
                <ul className="grid grid-cols-1 gap-1.5 p-2 sm:grid-cols-2">
                  {p.sizes.map((s) => {
                    const key = `${p.id}/${s.id}`;
                    const on = selectedSet.has(key);
                    return (
                      <li key={key}>
                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 transition ${
                            on ? "border-ink/80 bg-white shadow-sm" : "border-transparent hover:bg-slate-50"
                          }`}
                          title={s.note}
                        >
                          <input type="checkbox" checked={on} onChange={() => toggle(key)} className="peer sr-only" />
                          <span
                            className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-md border transition ${
                              on ? "border-ink bg-ink text-neon" : "border-slate-300 bg-white"
                            }`}
                            aria-hidden
                          >
                            {on && <LuCheck size={11} strokeWidth={3} />}
                          </span>
                          <Ratio w={s.w} h={s.h} />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs font-semibold text-slate-800">{s.name}</span>
                            <span className="block font-mono text-[11px] text-slate-500">
                              {s.w}×{s.h}
                            </span>
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
        {visible.length === 0 && <p className="py-6 text-center text-sm text-slate-500">Nothing matched — try “story” or “1080”.</p>}
      </div>

      {/* Custom sizes */}
      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 p-4">
        <Label hint="— any width × height in pixels">Custom size</Label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input placeholder="Name (optional)" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="sm:flex-1" />
          <div className="flex gap-2">
            <Input type="number" min={1} max={8192} placeholder="Width" value={draft.w} onChange={(e) => setDraft({ ...draft, w: e.target.value })} className="w-24 sm:w-28" inputMode="numeric" />
            <Input type="number" min={1} max={8192} placeholder="Height" value={draft.h} onChange={(e) => setDraft({ ...draft, h: e.target.value })} className="w-24 sm:w-28" inputMode="numeric" onKeyDown={(e) => e.key === "Enter" && addCustom()} />
            <Button variant="dark" icon={LuPlus} onClick={addCustom} disabled={!(parseInt(draft.w, 10) > 0 && parseInt(draft.h, 10) > 0)}>
              Add
            </Button>
          </div>
        </div>
        {custom.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {custom.map((s) => {
              const on = selectedSet.has(s.key);
              return (
                <li key={s.key} className="inline-flex items-center overflow-hidden rounded-full border border-slate-200 bg-white text-xs">
                  <button type="button" onClick={() => toggle(s.key)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-medium ${on ? "bg-ink text-neon" : "text-slate-600"}`} aria-pressed={on}>
                    {on && <LuCheck size={11} strokeWidth={3} />}
                    {s.name} <span className="font-mono opacity-70">{s.w}×{s.h}</span>
                  </button>
                  <button type="button" onClick={() => removeCustom(s.id)} className="px-2 py-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600" aria-label={`Remove ${s.name}`}>
                    <LuTrash2 size={12} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}

/** A tiny aspect-ratio glyph so you can tell a story from a cover at a glance. */
function Ratio({ w, h }) {
  const max = 18;
  const r = w / h;
  const bw = r >= 1 ? max : Math.max(6, Math.round(max * r));
  const bh = r >= 1 ? Math.max(6, Math.round(max / r)) : max;
  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
      <span className="rounded-[2px] border border-slate-400 bg-slate-100" style={{ width: bw, height: bh }} />
    </span>
  );
}
