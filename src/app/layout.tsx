import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { ThemeProvider } from "@/lib/theme-context";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DemoBanner } from "@/components/DemoBanner";

export const metadata: Metadata = {
  title: "ECOGEN AI — Keyingi Avlod Ekologik Intellekt Platformasi",
  description:
    "Bugungi innovatsiya — ertangi yashil kelajak. Sun'iy intellekt, yashil iqtisodiyot, iqlim o'zgarishi va zamonaviy interaktiv ta'lim yagona ekotizimda.",
  keywords: [
    "ECOGEN AI",
    "ekologiya",
    "yashil iqtisodiyot",
    "sun'iy intellekt",
    "iqlim o'zgarishi",
    "Orol dengizi",
    "saksovul",
    "quyosh energiyasi",
    "uglerod kalkulyatori",
  ],
  authors: [{ name: "ECOGEN AI Team" }],
  openGraph: {
    title: "ECOGEN AI — Ecological Intelligence Platform",
    description: "Today's innovation — tomorrow's green future.",
    url: "https://ecogen.uz",
    siteName: "ECOGEN AI",
    locale: "uz_UZ",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className="dark scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
        <ThemeProvider>
          <LanguageProvider>
            <DemoBanner />
            <Navbar />
            <main className="flex-1 w-full">{children}</main>
            <Footer />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
