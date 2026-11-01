import type { Metadata } from "next";
import SectionPage from "../components/section-page";
import { content } from "./data";

export const metadata: Metadata = {
  title: "Side projects",
};

export default function SideProjectsPage() {
  return <SectionPage content={content} />;
}
