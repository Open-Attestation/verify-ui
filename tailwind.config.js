const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      ...defaultTheme.container,
      center: true,
      padding: {
        DEFAULT: "1rem",
      },
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgba(78, 115, 182, 1)",
          dark: "rgba(54, 81, 130, 1)",
        },
        secondary: {
          DEFAULT: "rgba(117, 201, 200, 1)",
        },
        black: {
          DEFAULT: "rgba(79, 79, 79, 1)",
        },
        background: {
          DEFAULT: "rgba(255, 253, 250, 1)",
          blue: "rgba(250, 249, 251, 1)",
        },
      },
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
        heading: ["Manjari", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

// module.exports = {
//   content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
//   theme: {
//     extend: {
//       colors: {
//         transparent: "transparent",
//         current: "currentColor",
//         primary: { DEFAULT: "rgba(221, 107, 32, 1)" },
//         blue: "rgba(32, 146, 221, 1)",
//         green: "rgba(5, 160, 156, 1)",
//         yellow: "rgba(249, 220, 92, 1)",
//         gray: { DEFAULT: "rgba(247, 247, 247, 1)" },
//         black: { light: "rgba(42, 45, 52, 0.5)", DEFAULT: "rgba(42, 45, 52, 1)" },
//       },
//     },
//     fontFamily: {
//       sans: ["Open Sans", ...fontFamily.sans],
//       serif: fontFamily.serif,
//       mono: fontFamily.mono,
//       heading: ["Poppins", ...fontFamily.sans],
//       branding: ["Lilita One", ...fontFamily.sans],
//     },
//     container: {
//       center: true,
//       screens: {
//         sm: "640px",
//         md: "768px",
//       },
//       padding: {
//         DEFAULT: "1rem",
//         sm: "2rem",
//         lg: "4rem",
//         xl: "5rem",
//         "2xl": "6rem",
//       },
//     },
//   },
//   variants: {
//     extend: {},
//   },
//   plugins: [require("@tailwindcss/line-clamp")],
// };
