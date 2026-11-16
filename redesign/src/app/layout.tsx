import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import "./styles.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ppsanchez.com"),
  title: { default: "Pedro P. Sanchez", template: "%s | Pedro P. Sanchez" },
  description: "An illustrated portfolio of Pedro P. Sanchez’s work in causal machine learning, medical imaging, and computational design.",
  openGraph: {
    type: "website",
    siteName: "Pedro P. Sanchez",
    images: [{ url: "/pedro-sanchez.jpg", width: 1000, height: 1000, alt: "Portrait of Pedro P. Sanchez" }],
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
