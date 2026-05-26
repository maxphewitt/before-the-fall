import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans, Cinzel } from "next/font/google";
import "./globals.css";
import CrisisExitRamp from "./components/CrisisExitRamp";
import PWARegister from "./components/PWARegister";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-dmsans",
  display: "swap",
});

// Cinzel — used by the Logo wordmark + monogram + uppercase brand labels.
// Brand Identity v2.
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-cinzel-google",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Before the Fall",
  description:
    "Built for the moment before the fall. A faith-rooted, anonymous prevention platform for people standing in the moment before harm.",
  metadataBase: new URL("https://beforethefall.app"),
  applicationName: "Before the Fall",
  appleWebApp: {
    capable: true,
    title: "Before the Fall",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Before the Fall",
    description: "Built for the moment before the fall.",
    url: "https://beforethefall.app",
    siteName: "Before the Fall",
    type: "website",
    // app/opengraph-image.tsx is auto-discovered by Next.js — no need
    // to set images here.
  },
  twitter: {
    card: "summary_large_image",
    title: "Before the Fall",
    description: "Built for the moment before the fall.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#0e2a47",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  // Matches the standalone display mode of the PWA so the iOS status
  // bar tinting is consistent.
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${cinzel.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <CrisisExitRamp />
        <PWARegister />
      </body>
    </html>
  );
}