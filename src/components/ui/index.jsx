import { forwardRef, useEffect, useState } from "react";

const cx = (...a) => a.filter(Boolean).join(" ");

export const Button = forwardRef(function Button(
  { variant = "primary", size = "md", className, icon: Icon, children, ...props },
  ref,
) {
  const base =
    "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]";
  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2.5",
    lg: "text-base px-5 py-3",
  };
  const variants = {
    primary: "bg-neon text-ink hover:bg-[#33ffa0] shadow-sm hover:shadow-neon",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "text-rose-600 hover:bg-rose-50",
    dark: "bg-ink text-white hover:bg-slate-800 border border-white/10",
  };
  return (
    <button ref={ref} className={cx(base, sizes[size], variants[variant], className)} {...props}>
      {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden />}
      {children}
    </button>
  );
});

export const Label = ({ children, htmlFor, hint }) => (
  <label htmlFor={htmlFor} className="block text-[13px] font-semibold text-slate-700 mb-1.5">
    {children}
    {hint && <span className="ml-1 font-normal text-slate-400">{hint}</span>}
  </label>
);

const fieldCls =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm transition focus:outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10";

export const Input = forwardRef(function Input({ className, ...props }, ref) {
  return <input ref={ref} className={cx(fieldCls, className)} {...props} />;
});

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return <textarea ref={ref} rows={3} className={cx(fieldCls, "resize-y", className)} {...props} />;
});

export const Select = ({ className, children, ...props }) => (
  <select className={cx(fieldCls, "pr-9 appearance-none bg-no-repeat bg-[right_0.75rem_center] bg-[length:1rem]", className)} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2364748b' stroke-width='1.8'%3E%3Cpath d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")" }} {...props}>
    {children}
  </select>
);

export const Toggle = ({ checked, onChange, label, description }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <span
      role="switch"
      aria-checked={checked}
      tabIndex={0}
      onKeyDown={(e) => (e.key === " " || e.key === "Enter") && (e.preventDefault(), onChange(!checked))}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative mt-0.5 inline-flex h-5 w-9 shrink-0 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        checked ? "bg-ink" : "bg-slate-300",
      )}
    >
      <span
        className={cx(
          "absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </span>
    <span className="text-sm">
      <span className="font-medium text-slate-800">{label}</span>
      {description && <span className="block text-xs text-slate-500">{description}</span>}
    </span>
  </label>
);

export const ColorInput = ({ value, onChange, label, id }) => {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pr-3 shadow-sm">
        <span className="relative h-8 w-8 overflow-hidden rounded-lg border border-slate-200 shrink-0">
          <input
            id={id}
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="absolute -inset-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] cursor-pointer border-0 p-0"
            aria-label={label}
          />
        </span>
        <input
          type="text"
          value={draft}
          onChange={(e) => {
            const v = e.target.value;
            setDraft(v);
            if (/^#[0-9a-f]{6}$/i.test(v.trim())) onChange(v.trim().toUpperCase());
          }}
          onBlur={() => setDraft(value)}
          className="w-full bg-transparent text-xs font-mono uppercase text-slate-600 focus:outline-none"
          aria-label={`${label} hex value`}
          maxLength={7}
          spellCheck={false}
        />
      </div>
    </div>
  );
};

export const Card = ({ className, children, ...props }) => (
  <section className={cx("rounded-2xl border border-slate-200/80 bg-white shadow-card", className)} {...props}>
    {children}
  </section>
);

export const StepHeading = ({ step, title, subtitle, right }) => (
  <div className="flex items-start justify-between gap-3 mb-5">
    <div className="flex items-start gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink font-heading text-xs font-bold text-neon shadow-sm">
        {step}
      </span>
      <div>
        <h2 className="text-base font-bold text-slate-900 leading-7">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
      </div>
    </div>
    {right}
  </div>
);

export const Chip = ({ active, children, onClick, className, title }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={cx(
      "rounded-full border px-3 py-1 text-xs font-medium transition",
      active
        ? "border-ink bg-ink text-neon shadow-sm"
        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50",
      className,
    )}
  >
    {children}
  </button>
);
