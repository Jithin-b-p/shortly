/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cyan: "hsl(var(--clr-cyan))",
        darkViolet: "hsl(var(--clr-dark-violet))",
        red: "hsl(var(--clr-red))",
        clrNeutral: {
          100: "hsl(var(--clr-neutral-100))",
          200: "hsl(var(--clr-neutral-200))",
          300: "hsl(var(--clr-neutral-300))",
          400: "hsl(var(--clr-neutral-400))",
        },
      },
      spacing: {
        180: "32rem",
      },
    },
  },
  plugins: [],
};
