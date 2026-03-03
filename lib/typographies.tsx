import { Cormorant_Garamond, Geist, Inter, Montserrat, Nunito, Rubik } from "next/font/google";

export const headlineFont = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
});

// export const bodyFont = Montserrat({
//   variable: "--font-montserrat",
//   subsets: ["latin"],
// });

export const bodyFont = Rubik({
  variable: "--font-inter",
  subsets: ["latin"],
});