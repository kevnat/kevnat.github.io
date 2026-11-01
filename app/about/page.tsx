import type { Metadata } from "next";
import SectionPage from "../components/section-page";
import { content } from "./data";

export const metadata: Metadata = {
  title: "About",
};

export default function AboutPage() {
  return <SectionPage content={content} />;
}
