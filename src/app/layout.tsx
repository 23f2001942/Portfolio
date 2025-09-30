import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import { KaggleIcon, InstagramIcon } from "@/components/icons";

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
    <html lang="en" className="dark !scroll-smooth">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><path d=%22M50,10A40,40,0,1,1,10,50,40,40,0,0,1,50,10M50,18A32,32,0,1,0,82,50,32,32,0,0,0,50,18M50,40A15,15,0,1,1,35,55,15,15,0,0,1,50,40M50,71c-12,0-22,6-22,14v3h44v-3C72,77,62,71,50,71Z%22 fill=%22hsl(238 54% 37%)%22/></svg>" />
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
