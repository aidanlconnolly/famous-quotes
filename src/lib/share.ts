import { Quote } from "../data/types";

/** Copy the quote text + attribution to clipboard. Returns true on success. */
export async function copyQuote(quote: Quote): Promise<boolean> {
  const text = `"${quote.text}"\n— ${quote.author}${quote.source ? `, ${quote.source}` : ""}`;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Build a deep-link URL that opens the app with this quote's deep-dive pre-opened. */
export function shareUrl(quote: Quote): string {
  const base = window.location.origin;
  return `${base}/?q=${encodeURIComponent(quote.id)}`;
}
