import type { Metadata } from "next";
import ContentPage from "../components/content-page";

export const metadata: Metadata = {
  title: "Side projects",
};

export default function UsideUprojectsPage() {
  return <ContentPage id="side-projects" />;
}
