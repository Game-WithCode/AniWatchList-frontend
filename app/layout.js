import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./components/Provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AniWatchList - Save Anime in Watchlist",
  description: "Anime Watch List",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
     <head>
     <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-bgprimary text-white `}
      >


        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>

        <script src="https://cdn.lordicon.com/lordicon.js"></script>
      </body>

    </html>
  );
}
