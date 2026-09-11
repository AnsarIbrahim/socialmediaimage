import { LuMaximize, LuCircleDot, LuFileImage, LuRefreshCw, LuCircleHelp } from "react-icons/lu";
import { SiX } from "react-icons/si";
import { FaLinkedin, FaGithub } from "react-icons/fa6";
import { Logo } from "./Brand";
import { COMPANY } from "../data/company";

const TIPS = [
  {
    icon: LuMaximize,
    title: "Start from the biggest file you have",
    body: "Upload the original export from your designer (or the SVG). We only ever shrink, so a small JPG will look soft on a 2560 px YouTube banner.",
  },
  {
    icon: LuCircleDot,
    title: "Logos: fit inside, 8–12% padding",
    body: "Profile pictures are shown as circles on most apps. Padding keeps the corners of your logo from being clipped.",
  },
  {
    icon: LuFileImage,
    title: "PNG for logos, JPG for photos",
    body: "PNG keeps transparency and crisp edges. Photos and banners compress far smaller as JPG at 85–92% quality.",
  },
  {
    icon: LuRefreshCw,
    title: "Banners: check the safe area",
    body: "YouTube only shows the centre 1546×423 of the banner on phones, and Facebook trims the sides. Use Fill & crop with the focus on your logo.",
  },
];

const FAQ = [
  ["Is my logo uploaded to a server?", "No. Resizing happens on a canvas inside your browser. Close the tab and nothing remains anywhere."],
  ["Why are some sizes bigger than what the platform shows?", "Platforms display a scaled-down version but store the upload. Uploading at the recommended size (for example 720 px for a 170 px Facebook profile picture) keeps it sharp on retina screens."],
  ["Can I convert many logos at once?", "Yes — add several images in step 1. The ZIP gets one folder per image, and inside it one folder per platform."],
  ["Will a small image be enlarged?", "Yes, when a size is larger than your source it is scaled up smoothly, but it will look soft. Start from a high-resolution PNG or an SVG for best results."],
  ["Does it work on my phone?", "Yes. It works in Safari and Chrome on phones; very large batches are faster on a laptop."],
  ["Are these the official sizes?", "They follow each platform's current help pages (2026). Platforms change specs occasionally — add a custom size in step 2 if you need something new."],
];

export default function Guide() {
  return (
    <section className="mt-12 space-y-10" id="guide">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Tips for marketers</h2>
        <p className="text-sm text-slate-500">Small things that keep a brand looking sharp on every feed.</p>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {TIPS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-card">
              <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-neon">
                <Icon className="h-4.5 w-4.5" aria-hidden />
              </span>
              <h3 className="text-sm font-bold text-slate-800">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{body}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <LuCircleHelp className="h-5 w-5 text-slate-400" aria-hidden /> Questions people ask
        </h2>
        <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200/80 bg-white shadow-card">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group px-5 py-3">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-slate-800">
                {q}
                <span className="ml-3 text-slate-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="pb-2 pt-2 text-sm leading-relaxed text-slate-500">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const year = new Date().getFullYear();
  const socialIcon = { x: SiX, linkedin: FaLinkedin, github: FaGithub };
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 pb-6 pt-12 sm:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="h-12" />
            <p className="mt-3 font-sub text-xs font-medium uppercase tracking-[0.25em] text-white/50">{COMPANY.tagline}</p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              {COMPANY.legalName} is a tech studio from {COMPANY.location}. Social Sizes is one of our free tools for digital
              marketers and small businesses.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {COMPANY.socials.map((s) => {
                const Icon = socialIcon[s.id];
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-neon"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-sub text-sm font-bold">This tool</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li><a href="#guide" className="transition hover:text-neon">Tips for marketers</a></li>
              <li><a href="#preview" className="transition hover:text-neon">Download your ZIP</a></li>
              <li><a href={COMPANY.site} target="_blank" rel="noopener noreferrer" className="transition hover:text-neon">About {COMPANY.name}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-sub text-sm font-bold">More from {COMPANY.name}</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              {COMPANY.products.map((p) => (
                <li key={p.name}>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className="transition hover:text-neon">
                      {p.name} <span className="text-white/35">— {p.desc}</span>
                    </a>
                  ) : (
                    <span>
                      {p.name} <span className="text-white/35">— {p.desc}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="my-8 h-px w-full bg-neon/20" />

        <div className="flex flex-col items-center justify-between gap-2 text-center text-xs text-white/40 md:flex-row md:text-left">
          <p>© {year} {COMPANY.legalName}. All rights reserved. Brand names and logos belong to their respective owners.</p>
          <p>
            Made with <span className="text-rose-500">❤️</span> in {COMPANY.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
