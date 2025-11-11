import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Exo 2", "Rajdhani", "system-ui", "sans-serif"],
        display: ["Orbitron", "Exo 2", "sans-serif"],
        sport: ["Rajdhani", "Exo 2", "sans-serif"],
        athletic: ["Exo 2", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideInLeft: {
          "0%": {
            opacity: "0",
            transform: "translateX(-30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        countUp: {
          "0%": {
            transform: "scale(0.5)",
            opacity: "0",
          },
          "50%": {
            transform: "scale(1.1)",
            opacity: "0.8",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
        "bounce-basketball": {
          "0%": {
            transform: "translateY(0) scale(1, 1)",
          },
          "25%": {
            transform: "translateY(-40px) scale(1.1, 0.9)",
          },
          "50%": {
            transform: "translateY(0) scale(1, 1)",
          },
          "60%": {
            transform: "translateY(-20px) scale(1.05, 0.95)",
          },
          "75%": {
            transform: "translateY(0) scale(1, 1)",
          },
          "85%": {
            transform: "translateY(-10px) scale(1.02, 0.98)",
          },
          "100%": {
            transform: "translateY(0) scale(1, 1)",
          },
        },
        "bounce-slow": {
          "0%, 100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(-10px)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-in-left": "slideInLeft 0.5s ease-out",
        "count-up": "countUp 0.8s ease-out",
        "bounce-basketball": "bounce-basketball 1.5s ease-in-out infinite",
        "bounce-slow": "bounce-slow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
