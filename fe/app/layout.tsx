import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
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
        className={`${montserrat.variable} antialiased bg-white text-gray-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
