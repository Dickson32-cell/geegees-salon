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
        // Design System Colors from Stitch
        "secondary-container": "#fdc34d",
        "error-container": "#ffdad6",
        "surface": "#fbf9f8",
        "inverse-surface": "#303030",
        "outline": "#78767d",
        "on-tertiary-fixed-variant": "#484743",
        "tertiary": "#010101",
        "on-secondary-fixed-variant": "#5d4200",
        "surface-dim": "#dbd9d9",
        "surface-container-lowest": "#ffffff",
        "on-secondary-fixed": "#271900",
        "tertiary-fixed": "#e6e2dd",
        "surface-container-low": "#f5f3f3",
        "primary-fixed": "#e2e0fc",
        "tertiary-fixed-dim": "#c9c6c1",
        "surface-tint": "#5d5c74",
        "inverse-primary": "#c6c4df",
        "on-surface-variant": "#47464c",
        "primary-container": "#1a1a2e",
        "primary": "#00000b",
        "on-primary-fixed": "#1a1a2e",
        "secondary": "#7b5800",
        "on-secondary-container": "#715000",
        "on-background": "#1b1c1c",
        "on-primary-fixed-variant": "#45455b",
        "on-tertiary-container": "#868480",
        "primary-fixed-dim": "#c6c4df",
        "on-error-container": "#93000a",
        "background": "#fbf9f8",
        "surface-container-highest": "#e4e2e2",
        "on-tertiary-fixed": "#1c1c19",
        "on-primary-container": "#83829b",
        "on-error": "#ffffff",
        "surface-container-high": "#eae8e7",
        "surface-bright": "#fbf9f8",
        "secondary-fixed": "#ffdea6",
        "error": "#ba1a1a",
        "on-primary": "#ffffff",
        "inverse-on-surface": "#f2f0f0",
        "surface-variant": "#e4e2e2",
        "surface-container": "#efeded",
        "on-secondary": "#ffffff",
        "tertiary-container": "#1d1c19",
        "outline-variant": "#c8c5cd",
        "secondary-fixed-dim": "#f7bd48",
        "on-tertiary": "#ffffff",
        "on-surface": "#1b1c1c"
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
