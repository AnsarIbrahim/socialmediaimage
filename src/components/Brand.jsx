import logo from "../assets/aitechies-logo.png";
import mark from "../assets/aitechies-mark.png";

/** Full logo (brain mark + "Ai Techie" wordmark). Designed for dark backgrounds. */
export function Logo({ className = "h-10", ...props }) {
  // The PNG carries its own dark background; `mix-blend-lighten` hides it on dark surfaces.
  return <img src={logo} alt="AiTechies" className={`${className} w-auto select-none mix-blend-lighten`} draggable={false} {...props} />;
}

/** Square brain mark only — for tight spaces. */
export function Mark({ className = "h-8 w-8", ...props }) {
  return <img src={mark} alt="" aria-hidden className={`${className} rounded-lg select-none`} draggable={false} {...props} />;
}

/** Text wordmark in the company style: neon "AI" + "Techies". */
export function Wordmark({ className = "text-xl", light = true }) {
  return (
    <span className={`font-heading font-bold tracking-tight ${className}`}>
      <span className="text-neon">AI</span>
      <span className={light ? "text-white" : "text-ink"}>Techies</span>
    </span>
  );
}
