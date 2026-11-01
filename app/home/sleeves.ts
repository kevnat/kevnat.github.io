export type Sleeve = {
  id: string;
  index: string;
  title: string;
  caption: string;
  href: string;
  // Horizontal position (0..1) the ambient light drifts toward on hover.
  glowX: number;
};

export const intro = {
  name: "Kevin Nathan",
  line: "Product, payments, and the quiet hours in between.",
};

export const sleeves: Sleeve[] = [
  {
    id: "focus",
    index: "A1",
    title: "Focus",
    caption: "My current role and prototypes",
    href: "/focus",
    glowX: 0.2,
  },
  {
    id: "side-projects",
    index: "A2",
    title: "Side projects",
    caption: "What I build when the laptop closes",
    href: "/side-projects",
    glowX: 0.4,
  },
  {
    id: "about",
    index: "B1",
    title: "About me",
    caption: "The person behind the roadmap",
    href: "/about",
    glowX: 0.6,
  },
  {
    id: "resume",
    index: "B2",
    title: "Resume",
    caption: "Ten years, on one page",
    href: "/resume",
    glowX: 0.8,
  },
];
