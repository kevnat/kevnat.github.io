import type { Metadata } from "next";
import ContentPage from "../components/content-page";

export const metadata: Metadata = {
  title: "Focus",
};

export default function UfocusPage() {
  return <ContentPage id="focus" />;
}
