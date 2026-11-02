import type { Metadata } from "next";
import { Geist_Mono, Zen_Kaku_Gothic_New } from "next/font/google";
import ComingSoon from "./components/coming-soon";
import SceneShell from "./components/scene-shell";
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

// Holding page instead of the site; flip it in the deploy workflow.
const comingSoon = process.env.NEXT_PUBLIC_COMING_SOON === "true";

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
    >
      <body className="min-h-full flex flex-col">
        {comingSoon ? (
          <ComingSoon />
        ) : (
          <SceneShell>{children}</SceneShell>
        )}
      </body>
    </html>
  );
}
