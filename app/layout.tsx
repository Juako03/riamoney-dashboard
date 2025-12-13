import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "RiaMoney - Currency Exchange Dashboard",
  description: "Real-time currency exchange rates and conversion tool powered by the European Central Bank",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
