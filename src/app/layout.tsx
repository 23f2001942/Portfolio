import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Readex_Pro } from "next/font/google";

// Initialize the font
const readexPro = Readex_Pro({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Shamanthak Reddy Mallu",
  description:
    "A modern and professional portfolio website to showcase my work and skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="dark !scroll-smooth"
      suppressHydrationWarning
    >
      <body className={cn("min-h-screen bg-background font-sans antialiased", readexPro.variable)}>
        <main>{children}</main>
        <Toaster />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
