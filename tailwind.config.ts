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
        // Black & Gold Color Scheme
        "secondary-container": "#FFD700",
        "error-container": "#ffdad6",
        "surface": "#ffffff",
        "inverse-surface": "#1a1a1a",
        "outline": "#78767d",
        "on-tertiary-fixed-variant": "#484743",
        "tertiary": "#000000",
        "on-secondary-fixed-variant": "#8B7500",
        "surface-dim": "#f5f5f5",
        "surface-container-lowest": "#ffffff",
        "on-secondary-fixed": "#4D4000",
        "tertiary-fixed": "#f0f0f0",
        "surface-container-low": "#fafafa",
        "primary-fixed": "#e8e8e8",
        "tertiary-fixed-dim": "#d9d9d9",
        "surface-tint": "#000000",
        "inverse-primary": "#FFD700",
        "on-surface-variant": "#3d3d3d",
        "primary-container": "#1a1a1a",
        "primary": "#000000",
        "on-primary-fixed": "#1a1a1a",
        "secondary": "#D4AF37",
        "on-secondary-container": "#6B5500",
        "on-background": "#0a0a0a",
        "on-primary-fixed-variant": "#2d2d2d",
        "on-tertiary-container": "#666666",
        "primary-fixed-dim": "#cccccc",
        "on-error-container": "#93000a",
        "background": "#ffffff",
        "surface-container-highest": "#ebebeb",
        "on-tertiary-fixed": "#0a0a0a",
        "on-primary-container": "#b8b8b8",
        "on-error": "#ffffff",
        "surface-container-high": "#f2f2f2",
        "surface-bright": "#ffffff",
        "secondary-fixed": "#FFE87C",
        "error": "#ba1a1a",
        "on-primary": "#ffffff",
        "inverse-on-surface": "#f5f5f5",
        "surface-variant": "#f0f0f0",
        "surface-container": "#f7f7f7",
        "on-secondary": "#000000",
        "tertiary-container": "#0a0a0a",
        "outline-variant": "#d9d9d9",
        "secondary-fixed-dim": "#F4D03F",
        "on-tertiary": "#ffffff",
        "on-surface": "#0a0a0a"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      spacing: {
        "section-gap": "80px",
        "container-max": "1280px",
        "stack-sm": "8px",
        "margin-desktop": "64px",
        "margin-mobile": "16px",
        "gutter": "24px",
        "stack-md": "16px",
        "stack-lg": "32px"
      },
      fontFamily: {
        "display-lg": ["var(--font-playfair)", "Playfair Display", "serif"],
        "headline-md": ["var(--font-playfair)", "Playfair Display", "serif"],
        "headline-sm": ["var(--font-playfair)", "Playfair Display", "serif"],
        "body-lg": ["var(--font-nunito)", "Nunito Sans", "sans-serif"],
        "body-md": ["var(--font-nunito)", "Nunito Sans", "sans-serif"],
        "label-caps": ["var(--font-nunito)", "Nunito Sans", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["48px", { lineHeight: "56px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-lg-mobile": ["36px", { lineHeight: "44px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-md": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "headline-sm": ["24px", { lineHeight: "32px", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "700" }]
      }
    },
  },
  plugins: [],
} satisfies Config;
