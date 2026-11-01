import type { Metadata } from "next";
import HomeStage from "./home/home-stage";

export const metadata: Metadata = {
  title: "Kevin Nathan",
  description: "Product, payments, and the quiet hours in between.",
};

export default function Home() {
  return <HomeStage />;
}
