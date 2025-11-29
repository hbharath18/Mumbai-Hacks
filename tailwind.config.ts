import type { Config } from "tailwindcss"
import defaultTheme from "tailwindcss/defaultTheme"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./components/**/*.{js,ts,jsx,tsx,html}",
  ],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#14B8A6",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F3F4F6",
          foreground: "#111827",
        },
        muted: "#F3F4F6",
        "muted-foreground": "#6B7280",
        border: "#E6E7EA",
        background: "#FFFFFF",
        foreground: "#111827",
        card: "#FFFFFF",
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#FFFFFF",
        },
        warning: "#FBBF24",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #14B8A6 0%, #06B6D4 100%)",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        serif: ["'Playfair Display'", ...defaultTheme.fontFamily.serif],
      },
      boxShadow: {
        card: "0 6px 18px rgba(16,24,40,0.04)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config