import { readPage } from "../lib/content";
import { comingSoon } from "../lib/site";
import SectionPage from "./section-page";

// One call per route: reads content/<id>/ and renders it.
export default function ContentPage({ id }: { id: string }) {
  // In coming-soon mode, don't even read the draft copy into the build.
  if (comingSoon) return null;
  return <SectionPage content={readPage(id)} />;
}
