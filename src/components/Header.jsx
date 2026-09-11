import { LuArrowUpRight, LuRotateCcw } from "react-icons/lu";
import { Logo, Wordmark } from "./Brand";
import { COMPANY } from "../data/company";

export default function Header({ onReset, canReset }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/90 text-white backdrop-blur supports-[backdrop-filter]:bg-ink/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
        <a href="/" className="flex items-center gap-3" aria-label="AiTechies Social Image Sizes home">
          <Logo className="h-9 sm:h-10" />
          <span className="hidden h-6 w-px bg-white/15 sm:block" aria-hidden />
          <span className="hidden sm:block">
            <span className="block font-sub text-sm font-bold leading-4 tracking-wide">
              Social <span className="text-cyan">Sizes</span>
            </span>
            <span className="block text-[11px] text-white/50">Every social media size in one click</span>
          </span>
        </a>
        <nav className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            disabled={!canReset}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white/90 transition hover:border-neon/60 hover:text-neon disabled:opacity-40 disabled:hover:border-white/15 disabled:hover:text-white/90"
          >
            <LuRotateCcw className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Start over</span>
          </button>
          <a
            href={COMPANY.site}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full border border-neon/70 px-3.5 py-2 text-sm font-bold text-neon shadow-[0_0_10px_rgba(0,255,136,0.2)] transition hover:bg-neon/10 sm:inline-flex"
          >
            <Wordmark className="text-sm" /> <LuArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </nav>
      </div>
    </header>
  );
}
