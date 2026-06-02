import { Quote } from "../data/types";
import { ALL_QUOTES } from "../data/quotes";

/** Returns a deterministic quote for today (same quote all day, changes at midnight). */
export function quoteOfDay(): Quote {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % ALL_QUOTES.length;
  return ALL_QUOTES[index];
}
