import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import IbiceriProvider from "@/components/ibiceri-provider";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "yoInfo — Update. Publish. Blast.",
  description:
    "Share updates instantly — everywhere, all at once. Blast to WhatsApp, SMS, and email from one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased min-h-screen`}
        style={{ fontFamily: "'Montserrat', sans-serif", background: '#FBF6F9', color: '#241019' }}
      >
        <IbiceriProvider>
          <SiteNav />
          <main>{children}</main>
          <Footer />
        </IbiceriProvider>
      </body>
    </html>
  );
}
