module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      spacing: {
        192: "48rem",
      },
      gridTemplateColumns: {
        allTransactionsTable: "10rem auto 10rem",
        withdrawalTable: "2rem auto 10rem",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
