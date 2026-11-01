import { sleeves } from "../home/sleeves";
import { readPage } from "../lib/content";
import SectionPage from "./section-page";

// One call per route: reads content/<id>/ and takes the eyebrow from sleeves.ts.
export default function ContentPage({ id }: { id: string }) {
  const sleeve = sleeves.find((s) => s.id === id);
  return (
    <SectionPage content={{ eyebrow: sleeve?.index ?? "", ...readPage(id) }} />
  );
}
