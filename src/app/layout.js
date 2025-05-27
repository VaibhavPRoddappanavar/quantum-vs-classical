import { Inter, Poppins, Orbitron, Roboto_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-orbitron",
  display: "swap",
});

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-roboto-mono",
  display: "swap",
});

export const metadata = {
  title: "Quantum vs Classical",
  description: "Explore and compare quantum and classical algorithms through interactive simulations and 3D visualizations",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${poppins.variable} ${orbitron.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
