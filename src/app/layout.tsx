import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";

import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer";

const virgil = localFont({
  src: "../../public/fonts/Virgil.woff2",
  variable: "--font-virgil",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Split Rent",
  description: "Split your rental expenses easily.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} ${virgil.variable} relative min-h-screen`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          {children}
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
