import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LUMEN Studio",
  description: "Premium digital presence for ambitious brands.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

