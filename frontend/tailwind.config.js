/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 'xs' covers the 320–399px phones (iPhone SE, older Androids) that the
      // default sm:640px breakpoint lumps in with everything else.
      screens: {
        xs: '400px',
      },
      colors: {
        "primary": "#3525cd",
        "primary-container": "#4f46e5",
        "on-primary": "#ffffff",
        "on-primary-container": "#dad7ff",
        "primary-fixed": "#e2dfff",
        "primary-fixed-dim": "#c3c0ff",

        "secondary": "#006c49",
        "secondary-container": "#6cf8bb",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#00714d",
        "secondary-fixed": "#6ffbbe",
        "secondary-fixed-dim": "#4edea3",

        "tertiary": "#684000",
        "tertiary-container": "#885500",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#ffd4a4",

        "surface": "#fcf8ff",
        "surface-bright": "#fcf8ff",
        "surface-dim": "#dcd8e5",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f2ff",
        "surface-container": "#f0ecf9",
        "surface-container-high": "#eae6f4",
        "surface-container-highest": "#e4e1ee",
        "surface-variant": "#e4e1ee",

        "background": "#fcf8ff",
        "on-background": "#1b1b24",
        "on-surface": "#1b1b24",
        "on-surface-variant": "#464555",

        "outline": "#777587",
        "outline-variant": "#c7c4d8",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        tamil: ['"Be Vietnam Pro"', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounceShort 1s ease-in-out infinite',
        // These were referenced across the app but never defined, so the
        // elements using them simply appeared with no motion.
        'fade-in': 'fadeIn 0.25s ease-out both',
        'slide-in': 'slideIn 0.3s ease-out both',
        'pop-in': 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'emote-float': 'emoteFloat 2.2s ease-out forwards',
        'shake': 'shake 0.4s ease-in-out both',
        'score-pop': 'scorePop 0.5s ease-out both',
        // Reaction engine. Each particle sets --dx/--dy/--s/--r1/--r2 inline,
        // so one keyframe produces a whole scatter of different arcs.
        'reaction-float': 'reactionFloat var(--dur, 2.4s) cubic-bezier(0.22, 0.61, 0.36, 1) forwards',
        'reaction-pop': 'reactionPop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'reaction-sparkle': 'reactionSparkle var(--dur, 1.6s) ease-out forwards',
        'reaction-chip': 'reactionChip 0.34s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'reaction-bounce': 'reactionBounce 0.6s ease-in-out',
        'sheet-up': 'sheetUp 0.28s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        bounceShort: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(16px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        popIn: {
          '0%': { opacity: '0', transform: 'scale(0.6)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        // Emotes rise, drift and fade so several can overlap without clutter.
        emoteFloat: {
          '0%': { opacity: '0', transform: 'translateY(0) scale(0.5) rotate(0deg)' },
          '15%': { opacity: '1', transform: 'translateY(-14px) scale(1.25) rotate(-8deg)' },
          '55%': { opacity: '1', transform: 'translateY(-52px) scale(1.05) rotate(8deg)' },
          '100%': { opacity: '0', transform: 'translateY(-110px) scale(0.85) rotate(-4deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        scorePop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)' },
        },
        // A reaction leaves the tap point, arcs out along its own --dx/--dy,
        // overshoots in size, then shrinks and fades. Randomising the vars per
        // particle is what stops a burst looking like a single column.
        reactionFloat: {
          '0%': {
            opacity: '0',
            transform: 'translate3d(0, 0, 0) scale(0.3) rotate(0deg)',
          },
          '14%': {
            opacity: '1',
            transform: 'translate3d(calc(var(--dx, 0px) * 0.14), calc(var(--dy, -160px) * 0.10), 0) scale(1.35) rotate(var(--r1, -12deg))',
          },
          '45%': {
            opacity: '1',
            transform: 'translate3d(calc(var(--dx, 0px) * 0.55), calc(var(--dy, -160px) * 0.48), 0) scale(1.05) rotate(var(--r2, 10deg))',
          },
          '100%': {
            opacity: '0',
            transform: 'translate3d(var(--dx, 0px), var(--dy, -160px), 0) scale(var(--s, 0.7)) rotate(var(--r1, -12deg))',
          },
        },
        reactionPop: {
          '0%': { opacity: '0', transform: 'scale(0.2) rotate(-18deg)' },
          '60%': { opacity: '1', transform: 'scale(1.3) rotate(6deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
        },
        reactionSparkle: {
          '0%': { opacity: '0', transform: 'translate3d(0, 0, 0) scale(0)' },
          '25%': { opacity: '1', transform: 'translate3d(calc(var(--dx, 0px) * 0.3), calc(var(--dy, -80px) * 0.3), 0) scale(1)' },
          '100%': { opacity: '0', transform: 'translate3d(var(--dx, 0px), var(--dy, -80px), 0) scale(0.2)' },
        },
        reactionChip: {
          '0%': { opacity: '0', transform: 'scale(0.4) translateY(6px)' },
          '70%': { opacity: '1', transform: 'scale(1.15) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        reactionBounce: {
          '0%, 100%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.4) rotate(-10deg)' },
          '60%': { transform: 'scale(0.92) rotate(6deg)' },
        },
        sheetUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
