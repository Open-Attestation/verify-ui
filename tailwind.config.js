module.exports = {
  theme: {
    textColor: theme => ({
      ...theme("colors"),
    }),
    extend: {
      colors: {
        primary: {
          default: "#4e73b6",
        }
      }
    },
  },
  variants: {},
  plugins: [],
  purge: ["./src/**/*.tsx"],
};
