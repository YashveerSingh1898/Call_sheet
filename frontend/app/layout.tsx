import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import AccountSidebar from "@/components/AccountSidebar";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FrameZero — Autonomous AI Commercial Studio",
  description: "FrameZero synthesizes high-converting, broadcast-grade video advertisements in seconds with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${ibmPlexMono.variable}`}
    >
      <body className="bg-bg text-text-primary font-body antialiased min-h-screen relative selection:bg-accent-amber/30 selection:text-text-primary">
        {/* Fixed full-viewport film grain texture (CSS feTurbulence, ~0.03 opacity) */}
        <div className="grain-overlay" aria-hidden="true" />
        <AuthProvider>
          <div className="relative z-10">{children}</div>
          <AccountSidebar />
        </AuthProvider>
      </body>
    </html>
  );
}
