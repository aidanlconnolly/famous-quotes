// Domain types for The Quote Vault.
// A Quote belongs to exactly one Era and one or more Themes, so the same
// dataset powers the "By Era" and "By Theme" browse tabs simultaneously.

export type EraId =
  | "ancient"
  | "enlightenment"
  | "revolutionary"
  | "modern"
  | "contemporary";

export type ThemeId =
  | "motivation"
  | "philosophy"
  | "leadership"
  | "resilience"
  | "competitive"
  | "life"
  | "creativity";

export type Era = {
  id: EraId;
  name: string;
  range: string; // human-readable span, e.g. "Before 500 CE"
  startYear: number; // negative = BCE; used for chronological sorting
  icon: string;
  color: string; // hex accent injected as inline style
  blurb: string;
};

export type Theme = {
  id: ThemeId;
  name: string;
  icon: string;
  color: string; // hex accent
  blurb: string;
};

// The "deep dive" revealed on double-click.
export type DeepDive = {
  meaning: string; // what the quote actually means
  significance: string; // what it signifies for a person / how to apply it
  context?: string; // origin / background of the line
};

export type Quote = {
  id: string;
  text: string;
  author: string;
  authorTitle?: string; // "Roman Emperor & Stoic philosopher"
  authorLived?: string; // "121–180 CE"
  year?: string; // when it was said / written
  source?: string; // book, speech, interview, film...
  eraId: EraId;
  themeIds: ThemeId[];
  emoji?: string;
  deepDive: DeepDive;
};

// Derived shape for the author gallery.
export type Author = {
  name: string;
  title?: string;
  lived?: string;
  emoji?: string;
  eraId: EraId;
  quoteCount: number;
  slug: string;
};
