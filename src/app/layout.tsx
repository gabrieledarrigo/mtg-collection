import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MTG collection",
  description: "Track the collection of my MTG cards",
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
