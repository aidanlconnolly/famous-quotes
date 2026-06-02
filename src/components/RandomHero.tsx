import { Quote } from "../data/types";
import { ERAS } from "../data/eras";
import { useRandomQuote } from "../hooks/useRandomQuote";

type Props = {
  onDeepDive: (q: Quote) => void;
};

export default function RandomHero({ onDeepDive }: Props) {
  const { quote, shuffle } = useRandomQuote();
  const era = ERAS.find((e) => e.id === quote.eraId);

  return (
    <div
      className="relative rounded-3xl overflow-hidden p-8 md:p-12 cursor-pointer group no-select"
      style={{
        background: `radial-gradient(ellipse at top left, ${era?.color ?? "#334155"}33 0%, #0f172a 60%)`,
        border: `1px solid ${era?.color ?? "#334155"}44`,
      }}
      onDoubleClick={() => onDeepDive(quote)}
      title="Double-click to explore this quote"
    >
      {/* Big decorative quote mark */}
      <div
        className="absolute top-4 left-6 text-[8rem] leading-none font-serif opacity-10 select-none pointer-events-none"
        style={{ color: era?.color }}
      >
        "
      </div>

      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-lg">{era?.icon}</span>
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: era?.color }}
          >
            Random Quote
          </span>
        </div>

        <blockquote
          className="quote-serif text-2xl md:text-3xl text-white leading-relaxed italic mb-6"
          style={{ textShadow: `0 0 40px ${era?.color ?? "transparent"}44` }}
        >
          "{quote.text}"
        </blockquote>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-bold text-slate-100 text-lg">{quote.author}</p>
            {quote.authorTitle && (
              <p className="text-slate-400 text-sm mt-0.5">{quote.authorTitle}</p>
            )}
            {quote.authorLived && (
              <p className="text-slate-500 text-xs mt-0.5">{quote.authorLived}</p>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeepDive(quote);
              }}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                background: era?.color ?? "#475569",
                color: "#fff",
                boxShadow: `0 0 20px ${era?.color ?? "#475569"}66`,
              }}
            >
              Explore ↗
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                shuffle();
              }}
              className="px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white transition-all"
            >
              ↻ Another
            </button>
          </div>
        </div>

        <p className="mt-5 text-slate-600 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          Double-click the card to explore this quote in depth
        </p>
      </div>
    </div>
  );
}
