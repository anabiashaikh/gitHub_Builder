import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b1326",
        surface: "#0b1326",
        "surface-container-lowest": "#060e20",
        "surface-container-low": "#131b2e",
        "surface-container": "#171f33",
        "surface-container-high": "#222a3d",
        "surface-container-highest": "#2d3449",
        "surface-bright": "#31394d",
        "on-surface": "#dae2fd",
        "on-surface-variant": "#c7c4d7",
        primary: "#6366f1",
        "primary-container": "#4f46e5",
        "on-primary": "#ffffff",
        "on-primary-container": "#e0e7ff",
        secondary: "#4fdbc8",
        "secondary-container": "#04b4a2",
        "on-secondary": "#003731",
        "on-secondary-container": "#e6fffa",
        outline: "#464554",
        "outline-variant": "#2d3449",
        accent: "#ff6b00",
        "accent-light": "#ffb693",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
