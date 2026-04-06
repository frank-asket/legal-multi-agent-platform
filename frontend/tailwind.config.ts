import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgb(12 15 20 / 0.15)" },
          "50%": { boxShadow: "0 0 0 8px rgb(12 15 20 / 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.55s var(--ease-out-expo, ease-out) forwards",
        "pulse-ring": "pulse-ring 2.5s ease-in-out infinite",
      },
      transitionTimingFunction: {
        out: "var(--ease-out-expo, cubic-bezier(0.22, 1, 0.36, 1))",
      },
    },
  },
  plugins: [],
} satisfies Config;
