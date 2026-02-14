import type { Metadata } from "next";
import { Open_Sans as OpenSans } from "next/font/google";
import Header from "@app/components/Header/Header";
import Navigation, {
  NavigationProps,
} from "@app/components/Navigation/Navigation";
import "./globals.css";
import "../../public/styles/mtg-font.css";

const openSans = OpenSans({
  weight: ["300", "400", "600", "700", "800"],
  style: ["normal", "italic"],
});

export const title = "MTG collection";

export const description = "Track the collection of my MTG cards";

export const navigationItems: NavigationProps["items"] = [
  { label: "Collection", href: "/collection" },
  { label: "Components", href: "/components" },
];

export const metadata: Metadata = {
  title,
  description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={openSans.className}>
      <body>
        <Header title={title}>
          <Navigation items={navigationItems} />
        </Header>

        <main>{children}</main>
      </body>
    </html>
  );
}
