import type { Metadata } from "next";
import { DM_Sans, Outfit, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { StoreProvider } from "@/store/StoreProvider";
import { AppToaster } from "@/components/ui/Toaster";
import { GlobalDataLoader } from "@/components/layout/GlobalDataLoader";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoTube — AI YouTube Growth Platform",
  description:
    "Find untapped content gaps, generate complete video packages, and grow your YouTube channel with AI-powered tools.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${outfit.variable} ${jetBrainsMono.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          storageKey="at-theme"
          disableTransitionOnChange
        >
          <StoreProvider>
            <GlobalDataLoader />
            {children}
            <AppToaster />
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
