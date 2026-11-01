import type { Metadata } from "next";
import SectionPage from "../components/section-page";
import { content } from "./data";

export const metadata: Metadata = {
  title: "Focus",
};

export default function FocusPage() {
  return <SectionPage content={content} />;
}
