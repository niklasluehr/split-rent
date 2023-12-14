import { Nav } from "@/components/Nav";
import { ThemeProvider } from "@/components/theme-provider";
import "@/styles/globals.css";
import { Analytics } from "@vercel/analytics/react";

import { Inter } from "next/font/google";

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
        className={`font-sans ${inter.variable} flex flex-col items-center`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
