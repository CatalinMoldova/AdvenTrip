/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        // iOS System Colors
        "ios-blue": "var(--ios-blue)",
        "ios-green": "var(--ios-green)",
        "ios-indigo": "var(--ios-indigo)",
        "ios-orange": "var(--ios-orange)",
        "ios-pink": "var(--ios-pink)",
        "ios-purple": "var(--ios-purple)",
        "ios-red": "var(--ios-red)",
        "ios-teal": "var(--ios-teal)",
        "ios-yellow": "var(--ios-yellow)",
        "ios-gray": "var(--ios-gray)",
        "ios-gray2": "var(--ios-gray2)",
        "ios-gray3": "var(--ios-gray3)",
        "ios-gray4": "var(--ios-gray4)",
        "ios-gray5": "var(--ios-gray5)",
        "ios-gray6": "var(--ios-gray6)",
        // iOS Label Colors
        "ios-label": "var(--ios-label)",
        "ios-label-secondary": "var(--ios-label-secondary)",
        "ios-label-tertiary": "var(--ios-label-tertiary)",
        "ios-separator": "var(--ios-separator)",
        // Chart colors
        "chart-1": "var(--chart-1)",
        "chart-2": "var(--chart-2)",
        "chart-3": "var(--chart-3)",
        "chart-4": "var(--chart-4)",
        "chart-5": "var(--chart-5)",
        // NOMADIQ Brand Colors
        "nomadiq-purple": "var(--nomadiq-purple)",
        "nomadiq-blue": "var(--nomadiq-blue)",
        "nomadiq-cyan": "var(--nomadiq-cyan)",
        "nomadiq-pink": "var(--nomadiq-pink)",
        "nomadiq-orange": "var(--nomadiq-orange)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'system-ui',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },
      backdropBlur: {
        'ios': '20px',
      },
      boxShadow: {
        'ios-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
        'ios': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'ios-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'ios-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
