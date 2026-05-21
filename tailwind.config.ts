import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette
        brand: {
          50:  "#f0f4ff",
          100: "#e0eaff",
          200: "#c7d7fe",
          300: "#a5bafc",
          400: "#8196f8",
          500: "#6172f3",
          600: "#4f56e8",
          700: "#4144cc",
          800: "#3538a4",
          900: "#303482",
          950: "#1e1f4f",
        },
        // Accent – violet
        accent: {
          50:  "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        // Surface system (dark-first)
        surface: {
          0:   "#08090e",
          50:  "#0d0f17",
          100: "#111420",
          150: "#14182a",
          200: "#181c2e",
          300: "#1e2338",
          400: "#252b42",
          500: "#2d3452",
        },
        // Border system
        border: {
          DEFAULT: "rgba(255,255,255,0.06)",
          subtle:  "rgba(255,255,255,0.04)",
          strong:  "rgba(255,255,255,0.12)",
          focus:   "rgba(97,114,243,0.6)",
        },
        // Text system
        ink: {
          primary:   "#f1f3f9",
          secondary: "#8892aa",
          tertiary:  "#4d5675",
          muted:     "#2e3554",
          inverse:   "#08090e",
        },
        // Semantic colors
        success: {
          DEFAULT: "#10b981",
          bg: "rgba(16,185,129,0.12)",
          border: "rgba(16,185,129,0.25)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          bg: "rgba(245,158,11,0.12)",
          border: "rgba(245,158,11,0.25)",
        },
        danger: {
          DEFAULT: "#ef4444",
          bg: "rgba(239,68,68,0.12)",
          border: "rgba(239,68,68,0.25)",
        },
        info: {
          DEFAULT: "#3b82f6",
          bg: "rgba(59,130,246,0.12)",
          border: "rgba(59,130,246,0.25)",
        },
        // Social platform colors
        social: {
          twitter:   "#1da1f2",
          instagram: "#e1306c",
          facebook:  "#1877f2",
          linkedin:  "#0a66c2",
          tiktok:    "#ff0050",
          youtube:   "#ff0000",
          threads:   "#101010",
          pinterest: "#e60023",
        },
      },
      fontFamily: {
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
        mono:  ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: ["var(--font-cal)", "var(--font-inter)", "sans-serif"],
      },
      fontSize: {
        "2xs":  ["0.625rem", { lineHeight: "0.875rem", letterSpacing: "0.02em" }],
        xs:     ["0.75rem",  { lineHeight: "1rem",     letterSpacing: "0.01em" }],
        sm:     ["0.8125rem",{ lineHeight: "1.25rem",  letterSpacing: "0.005em" }],
        base:   ["0.9375rem",{ lineHeight: "1.5rem" }],
        lg:     ["1.0625rem",{ lineHeight: "1.625rem" }],
        xl:     ["1.25rem",  { lineHeight: "1.75rem",  letterSpacing: "-0.01em" }],
        "2xl":  ["1.5rem",   { lineHeight: "2rem",     letterSpacing: "-0.015em" }],
        "3xl":  ["1.875rem", { lineHeight: "2.25rem",  letterSpacing: "-0.02em" }],
        "4xl":  ["2.25rem",  { lineHeight: "2.5rem",   letterSpacing: "-0.025em" }],
        "5xl":  ["3rem",     { lineHeight: "1",         letterSpacing: "-0.03em" }],
        "6xl":  ["3.75rem",  { lineHeight: "1",         letterSpacing: "-0.04em" }],
      },
      spacing: {
        "4.5":  "1.125rem",
        "5.5":  "1.375rem",
        "13":   "3.25rem",
        "15":   "3.75rem",
        "17":   "4.25rem",
        "18":   "4.5rem",
        "22":   "5.5rem",
        "26":   "6.5rem",
        "30":   "7.5rem",
        "62":   "15.5rem",
        "68":   "17rem",
        "76":   "19rem",
        "84":   "21rem",
        "88":   "22rem",
        "92":   "23rem",
      },
      borderRadius: {
        "2xs": "0.125rem",
        xs:    "0.25rem",
        sm:    "0.375rem",
        DEFAULT: "0.5rem",
        md:    "0.625rem",
        lg:    "0.75rem",
        xl:    "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "2.5rem",
        full:  "9999px",
      },
      boxShadow: {
        "xs":    "0 1px 2px rgba(0,0,0,0.3)",
        "sm":    "0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)",
        DEFAULT: "0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.4)",
        "md":    "0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.4)",
        "lg":    "0 10px 15px -3px rgba(0,0,0,0.6), 0 4px 6px -4px rgba(0,0,0,0.4)",
        "xl":    "0 20px 25px -5px rgba(0,0,0,0.7), 0 8px 10px -6px rgba(0,0,0,0.5)",
        "2xl":   "0 25px 50px -12px rgba(0,0,0,0.8)",
        // Glow shadows
        "glow-brand": "0 0 20px rgba(97,114,243,0.35), 0 0 60px rgba(97,114,243,0.15)",
        "glow-accent":"0 0 20px rgba(168,85,247,0.35), 0 0 60px rgba(168,85,247,0.15)",
        "glow-success":"0 0 20px rgba(16,185,129,0.3)",
        // Glass shadows
        "glass-sm":  "0 2px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        "glass":     "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
        "glass-lg":  "0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
        // Card shadows
        "card":      "0 1px 3px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
        "card-hover":"0 8px 24px rgba(0,0,0,0.6), 0 0 0 1px rgba(97,114,243,0.25)",
        "card-active":"0 0 0 2px rgba(97,114,243,0.5)",
        "none": "none",
      },
      backdropBlur: {
        xs:  "4px",
        sm:  "8px",
        DEFAULT: "12px",
        md:  "16px",
        lg:  "24px",
        xl:  "40px",
        "2xl": "64px",
      },
      animation: {
        "fade-in":        "fadeIn 0.2s ease-out",
        "fade-up":        "fadeUp 0.3s ease-out",
        "fade-down":      "fadeDown 0.3s ease-out",
        "scale-in":       "scaleIn 0.2s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-left":  "slideInLeft 0.3s ease-out",
        "slide-up":       "slideUp 0.4s cubic-bezier(0.16,1,0.3,1)",
        "shimmer":        "shimmer 2s linear infinite",
        "pulse-glow":     "pulseGlow 2s ease-in-out infinite",
        "float":          "float 6s ease-in-out infinite",
        "spin-slow":      "spin 3s linear infinite",
        "bounce-subtle":  "bounceSubtle 1s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(16px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(100%)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to:   { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.8", transform: "scale(1.02)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-3px)" },
        },
      },
      transitionTimingFunction: {
        "spring":     "cubic-bezier(0.16, 1, 0.3, 1)",
        "smooth":     "cubic-bezier(0.4, 0, 0.2, 1)",
        "snappy":     "cubic-bezier(0.2, 0, 0, 1)",
        "overshoot":  "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      backgroundImage: {
        "gradient-radial":    "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "brand-gradient":     "linear-gradient(135deg, #6172f3 0%, #a855f7 100%)",
        "brand-gradient-v":   "linear-gradient(180deg, #6172f3 0%, #a855f7 100%)",
        "dark-gradient":      "linear-gradient(180deg, #0d0f17 0%, #08090e 100%)",
        "shimmer-gradient":   "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)",
        "card-gradient":      "linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "glow-top":           "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(97,114,243,0.15) 0%, transparent 100%)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
