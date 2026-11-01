import type { Metadata } from "next";
import ContentPage from "../components/content-page";

export const metadata: Metadata = {
  title: "About",
};

export default function UaboutPage() {
  return <ContentPage id="about" />;
}
