import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import { KaggleIcon, InstagramIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Profolio",
  description:
    "A modern and professional portfolio website to showcase my work and skills.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark !scroll-smooth">
      <head>
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
        <main className="container mx-auto px-4 py-8 pt-24 md:px-6 lg:px-8">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
