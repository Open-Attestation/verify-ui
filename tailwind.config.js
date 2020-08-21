module.exports = {
  theme: {
    textColor: theme => ({
      ...theme("colors"),
    }),
    extend: {
      colors: {
        primary: {
          default: "#4e73b6",
        },
        grey: {
          lighter: "#eeecf1",
          light: "#dddddd",
          default: "#4f4f4f",
        },
        teal: {
          default: "#75c9c8",
        },
        yellow: {
          light: "#fffdfa",
          default: "#fadb93",
        },
        purple: {
          light: "#faf9fb",
          default: "#beb1d7",
        }
      }
    },
  },
  variants: {},
  plugins: [],
  purge: ["./src/**/*.tsx"],
};
