import type { Metadata, Viewport } from "next";
import { Geist_Mono, Zen_Kaku_Gothic_New } from "next/font/google";
import ComingSoon from "./components/coming-soon";
import SceneShell from "./components/scene-shell";
import { comingSoon } from "./lib/site";
import "./globals.css";

const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku-gothic-new",
  weight: "400",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Declaring the page dark makes the browser's default canvas dark too, which is
// what shows before the stylesheet arrives (a body colour can't cover that).
export const viewport: Viewport = comingSoon
  ? { colorScheme: "dark", themeColor: "#1c150e" }
  : {};

export const metadata: Metadata = {
  robots: comingSoon ? { index: false, follow: false } : undefined,
  title: {
    default: "Kevin Nathan",
    template: "%s | Kevin Nathan",
  },
  description: "Product, payments, and the quiet hours in between.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${zenKakuGothicNew.variable} ${geistMono.variable} h-full antialiased`}
      style={comingSoon ? { background: "#1c150e" } : undefined}
    >
      <body
        className="min-h-full flex flex-col"
        // Coming soon is all dark room: match it so nothing white shows before the scene paints.
        style={comingSoon ? { background: "#1c150e" } : undefined}
      >
        {comingSoon ? (
          <ComingSoon />
        ) : (
          <SceneShell>{children}</SceneShell>
        )}
      </body>
    </html>
  );
}
