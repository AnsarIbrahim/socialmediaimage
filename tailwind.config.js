/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Orbitron", "Space Grotesk", "Inter", "sans-serif"],
        sub: ["Space Grotesk", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        // AiTechies Studio palette (mirrors the company site)
        ink: "#050505",
        neon: "#00ff88",
        cyan: { DEFAULT: "#00d4ff" },
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          500: "#00d4ff",
          600: "#0891b2",
          700: "#0e7490",
        },
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px -12px rgba(15, 23, 42, 0.12)",
        neon: "0 0 20px rgba(0, 255, 136, 0.35)",
      },
      spacing: { 4.5: "1.125rem" },
      minWidth: { 5: "1.25rem" },
    },
  },
  plugins: [],
};
