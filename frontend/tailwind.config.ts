import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#14120F",
        surface: "#1E1B17",
        "text-primary": "#F2EFE9",
        "text-muted": "#9C9488",
        "accent-amber": "#E8A33D",
        "accent-teal": "#2F6E62",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Fraunces", "serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
