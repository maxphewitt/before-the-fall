import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Cinzel } from "next/font/google";
import "./globals.css";
import CrisisExitRamp from "./components/CrisisExitRamp";

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
  openGraph: {
    title: "Before the Fall",
    description: "Built for the moment before the fall.",
    url: "https://beforethefall.app",
    siteName: "Before the Fall",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${cinzel.variable}`}>
      <body className="min-h-screen antialiased">
        {children}
        <CrisisExitRamp />
      </body>
    </html>
  );
}