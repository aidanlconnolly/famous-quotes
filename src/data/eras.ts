import { Era } from "./types";

export const ERAS: Era[] = [
  {
    id: "ancient",
    name: "Ancient Wisdom",
    range: "Before 500 CE",
    startYear: -600,
    icon: "🏛️",
    color: "#d97706",
    blurb:
      "The first philosophers, emperors, and sages who dared to ask what it means to live well. From the Stoics of Rome to the Taoists of China, their words have outlived every empire they knew.",
  },
  {
    id: "enlightenment",
    name: "Renaissance & Enlightenment",
    range: "1400 – 1800",
    startYear: 1400,
    icon: "🎨",
    color: "#7c3aed",
    blurb:
      "An age of reason, art, and revolution. Thinkers broke free from dogma and dared to imagine a world shaped by human intellect, dignity, and curiosity.",
  },
  {
    id: "revolutionary",
    name: "Revolutionary & Industrial Age",
    range: "1800 – 1900",
    startYear: 1800,
    icon: "⚙️",
    color: "#b91c1c",
    blurb:
      "Nations were forged, slavery was challenged, and the machine age began. The voices of this era burned brightest in the face of injustice and radical change.",
  },
  {
    id: "modern",
    name: "Modern Age",
    range: "1900 – 1980",
    startYear: 1900,
    icon: "🌍",
    color: "#0369a1",
    blurb:
      "Two world wars, civil rights movements, moon landings, and the rise of individual freedom. The giants of this era spoke under the weight of history.",
  },
  {
    id: "contemporary",
    name: "Contemporary",
    range: "1980 – Present",
    startYear: 1980,
    icon: "🚀",
    color: "#059669",
    blurb:
      "Athletes, founders, artists, and leaders shaping culture today. Their words carry the hustle, hunger, and clarity of those still in the arena.",
  },
];
