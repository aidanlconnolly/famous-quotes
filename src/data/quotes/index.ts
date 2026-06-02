import { Quote, EraId, ThemeId } from "../types";
import { ancientQuotes } from "./ancient";
import { enlightenmentQuotes } from "./enlightenment";
import { revolutionaryQuotes } from "./revolutionary";
import { modernQuotes } from "./modern";
import { contemporaryQuotes } from "./contemporary";

export const ALL_QUOTES: Quote[] = [
  ...ancientQuotes,
  ...enlightenmentQuotes,
  ...revolutionaryQuotes,
  ...modernQuotes,
  ...contemporaryQuotes,
];

export function quotesByEra(eraId: EraId): Quote[] {
  return ALL_QUOTES.filter((q) => q.eraId === eraId);
}

export function quotesByTheme(themeId: ThemeId): Quote[] {
  return ALL_QUOTES.filter((q) => q.themeIds.includes(themeId));
}

export function quotesByAuthor(authorName: string): Quote[] {
  return ALL_QUOTES.filter((q) => q.author === authorName);
}

export function quoteById(id: string): Quote | undefined {
  return ALL_QUOTES.find((q) => q.id === id);
}

export function relatedQuotes(quote: Quote, limit = 3): Quote[] {
  return ALL_QUOTES.filter(
    (q) =>
      q.id !== quote.id &&
      (q.author === quote.author ||
        q.themeIds.some((t) => quote.themeIds.includes(t)))
  )
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
}

/** Unique sorted list of author names. */
export function allAuthors(): string[] {
  const set = new Set(ALL_QUOTES.map((q) => q.author));
  return Array.from(set).sort();
}

/** Build a URL-safe slug from an author name. */
export function authorSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Reverse-lookup: author name from slug. */
export function authorFromSlug(slug: string): string | undefined {
  return allAuthors().find((a) => authorSlug(a) === slug);
}
