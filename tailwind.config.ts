import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: { min: "300px", max: "600px" },
      sm: "769px",
      xsm: { min: "300px", max: "1023px" },
      md: { min: "600px", max: "1023px" },
      lg: { min: "1024px" },
      lg2: { min: "1092px" },
      xl: { min: "1280px" },
      "2xl": { min: "1536px" },
      "3xl": { min: "1792px" },
    },
    boxShadow: {
      "4xl": "0px 0px 10px 4px rgba(0, 0, 0, 0.35)",
      green: "0px 0px 2px rgba(0, 198, 162, 0.5)",
      dark: "0px 0px 10px rgba(0, 0, 0, 0.15)",
      blue: "0px 0px 20px rgba(0, 255, 209, 0.6)",
      withDrawColor: "0px 0px 20px rgba(0, 255, 240, 0.6)",
    },

    extend: {
      colors: {
        darkBg: "#14162B",
        dark: {
          50: "#31344D",
          100: "#2E3148",
          150: "#31344D",
          200: "#23253A",
          250: "#2E304B",
          300: "#626486",
          350: "#979797",
          400: "#213441",
          450: "#3F4262",
          500:'0b1a1a',
        },
        purple: {
          50: "#C0C4E9",
        },
        grey:{
          50:'#73818b',
        },
        green:{
          50:"#d2ff3a",
        }
      },
    },
    plugins: [],
  },
  plugins: [],
};
export default config;
