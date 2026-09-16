import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Readex_Pro } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";

// Initialize the font
const readexPro = Readex_Pro({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Shamanthak Reddy Mallu | Aerospace & Mechanical Engineering",
  description:
    "Mechanical Engineering student at BITS Pilani, learning aerospace engineering by building: from drones and robotic arms to CFD. Aiming for a future in reusable launch vehicles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body className={cn("min-h-screen bg-background font-sans antialiased", readexPro.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main>{children}</main>
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </ThemeProvider>
      </body>
    </html>
  );
}
