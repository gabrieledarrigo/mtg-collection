import type { Metadata } from "next";
import { Open_Sans as OpenSans } from "next/font/google";
import "./globals.css";
import "../../public/styles/mtg-font.css";
import Header from "./components/Header";

const openSans = OpenSans({
  weight: ["300", "400", "600", "700", "800"],
  style: ["normal", "italic"],
});

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
    <html lang="en" className={openSans.className}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
