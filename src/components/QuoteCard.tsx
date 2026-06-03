import { Quote } from "../data/types";
import { ERAS } from "../data/eras";
import { THEMES } from "../data/themes";
import { copyQuote } from "../lib/share";

type Props = {
  quote: Quote;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onDeepDive: (q: Quote) => void;
  compact?: boolean;
};

export default function QuoteCard({
  quote,
  isFavorite,
  onToggleFavorite,
  onDeepDive,
  compact = false,
}: Props) {
  const era = ERAS.find((e) => e.id === quote.eraId);
  const themes = THEMES.filter((t) => quote.themeIds.includes(t.id));

  return (
    <div
      className="group relative rounded-2xl p-5 transition-all duration-200 cursor-default no-select"
      style={{
        background: "rgba(30, 41, 59, 0.6)",
        border: `1px solid rgba(71, 85, 105, 0.4)`,
        backdropFilter: "blur(4px)",
      }}
      onDoubleClick={() => onDeepDive(quote)}
    >
      {/* Era accent bar */}
      <div
        className="absolute top-0 left-0 w-full h-[2px] rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${era?.color ?? "#475569"}, transparent)` }}
      />

      {/* Top row: emoji + author */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {quote.emoji && <span className="text-xl flex-shrink-0">{quote.emoji}</span>}
          <div className="min-w-0">
            <p className="font-semibold text-[#1a1a1a] text-sm truncate">{quote.author}</p>
            {!compact && quote.authorTitle && (
              <p className="text-[#6b6358] text-xs truncate">{quote.authorTitle}</p>
            )}
          </div>
        </div>
        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(quote.id);
          }}
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all"
          style={
            isFavorite
              ? { color: "#f472b6", background: "#be185d22" }
              : { color: "#475569", background: "transparent" }
          }
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? "♥" : "♡"}
        </button>
      </div>

      {/* Quote text */}
      <blockquote
        className="quote-serif italic leading-relaxed mb-3"
        style={{
          color: "#e2e8f0",
          fontSize: quote.text.length > 200 ? "0.85rem" : quote.text.length > 100 ? "0.95rem" : "1.05rem",
        }}
      >
        "{quote.text}"
      </blockquote>

      {/* Source */}
      {!compact && (quote.source || quote.year) && (
        <p className="text-[#6b6358] text-xs italic mb-3">
          {[quote.source, quote.year].filter(Boolean).join(" · ")}
        </p>
      )}

      {/* Theme chips */}
      {!compact && themes.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {themes.slice(0, 2).map((t) => (
            <span
              key={t.id}
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: `${t.color}18`, color: t.color }}
            >
              {t.icon} {t.name}
            </span>
          ))}
        </div>
      )}

      {/* Bottom actions + double-click hint */}
      <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-[#d6cfc1]/40">
        <p className="text-[#6b6358] text-xs select-none opacity-0 group-hover:opacity-100 transition-opacity">
          Double-click to explore ↗
        </p>
        <div className="flex gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyQuote(quote);
            }}
            className="px-2.5 py-1 rounded text-xs text-[#6b6358] hover:text-[#1a1a1a] hover:bg-[#d6cfc1] transition-colors"
            title="Copy quote"
          >
            ⧉
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeepDive(quote);
            }}
            className="px-2.5 py-1 rounded text-xs font-medium transition-all hover:text-white"
            style={{ color: era?.color ?? "#94a3b8", background: `${era?.color ?? "#334155"}18` }}
          >
            Deep Dive →
          </button>
        </div>
      </div>
    </div>
  );
}
