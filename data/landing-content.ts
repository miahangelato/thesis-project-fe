import { LucideIcon } from "lucide-react";

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle?: string;
  content: string[];
  icon?: LucideIcon;
  imagePath?: string;
  singleImageLayout?: boolean;
  bgGradient: string;
}

export const landingCarouselSlides: CarouselSlide[] = [
  {
    id: "hero",
    title: "Your fingerprints are more than identity.",
    subtitle: "Simple insights from dermatoglyphic patterns.",
    content: [
      "Fingerprints form early and remain unchanged.",
      "We translate ridge patterns into easy-to-understand health signals.",
      "Use the results to guide simple, practical next steps.",
    ],
    imagePath: "/landing-page/hero.png",
    bgGradient: "from-teal-50 to-cyan-50",
  },
  {
    id: "blood-group",
    title: "Quick blood-type prediction.",
    subtitle: "Non-invasive and fast.",
    content: [
      "Patterns in fingerprints can suggest ABO type likelihoods.",
      "This gives a quick, needle-free indication for everyday use.",
      "Follow up with clinical tests for confirmation.",
    ],
    imagePath: "/landing-page/blood-group.png",
    bgGradient: "from-red-50 to-rose-50",
  },
  {
    id: "diabetes",
    title: "Early, gentle screening.",
    subtitle: "No needles required.",
    content: [
      "This tool highlights signals that may merit further checks.",
      "It is designed to encourage timely follow-up, not replace care.",
      "Small actions can make a big difference over time.",
    ],
    imagePath: "/landing-page/diab.png",
    bgGradient: "from-blue-50 to-indigo-50",
  },
  {
    id: "ethics",
    title: "Privacy-first, educational tool.",
    subtitle: "Supportive insight, not diagnosis.",
    content: [
      "We focus on clear guidance while protecting your data.",
      "Use the tool to learn and take practical next steps.",
      "Consult professionals for clinical decisions.",
    ],
    imagePath: "/landing-page/ethics.png",
    bgGradient: "from-yellow-50 to-amber-50",
  },
];
