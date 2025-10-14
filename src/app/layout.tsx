import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ScrollToTop from "@/components/scroll-to-top";

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
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <Header />
        <main className="container mx-auto py-8 pt-24 data-[is-homepage=true]:p-0 data-[is-homepage=true]:pt-20">
          {children}
        </main>
        <Toaster />
        <Analytics />
        <SpeedInsights />
        <ScrollToTop />
      </body>
    </html>
  );
}
