import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { PortfolioProvider } from "@/context/PortfolioContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MochaShield — Pre-Trade Portfolio Risk Intelligence",
  description:
    "Pre-trade portfolio risk-intelligence layer for leveraged stock and crypto traders. Evaluate how proposed orders impact concentration, correlation, leverage, and stress risk before execution.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background text-foreground font-sans selection:bg-ms-softblue selection:text-ms-navy">
        <TooltipProvider>
          <PortfolioProvider>
            {children}
            <Toaster richColors position="bottom-right" />
          </PortfolioProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
