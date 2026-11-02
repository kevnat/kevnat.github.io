import { readPage } from "../lib/content";
import SectionPage from "./section-page";

// One call per route: reads content/<id>/ and renders it.
export default function ContentPage({ id }: { id: string }) {
  return <SectionPage content={readPage(id)} />;
}
