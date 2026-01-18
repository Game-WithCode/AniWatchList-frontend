import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./components/Provider";
import { Suspense } from 'react';
import Script from 'next/script'; // Add this to your imports
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
          <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
            {children}
          <Footer />
          </Suspense>
        </Providers>

      </body>
      <Script
        src="https://cdn.lordicon.com/lordicon.js"
        strategy="afterInteractive"
      />
    </html >
  );
}
