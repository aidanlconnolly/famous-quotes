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
      className="rounded-2xl p-6 cursor-default group no-select relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${era?.color ?? "#334155"}22 0%, #1e293b 60%)`,
        border: `1px solid ${era?.color ?? "#334155"}44`,
      }}
      onDoubleClick={() => onDeepDive(quote)}
    >
      {/* Faded glow */}
      <div
        className="absolute top-0 right-0 w-28 h-28 rounded-bl-full opacity-20 pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${era?.color}, transparent 70%)` }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: era?.color, boxShadow: `0 0 6px ${era?.color}` }}
            />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Random Quote
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); shuffle(); }}
            className="text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors px-2 py-1 rounded-lg hover:bg-slate-700"
          >
            ↻ Another
          </button>
        </div>

        <blockquote className="quote-serif text-base text-slate-100 italic leading-relaxed mb-4 line-clamp-4">
          "{quote.text}"
        </blockquote>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-300 text-sm">{quote.author}</p>
            {quote.authorTitle && (
              <p className="text-slate-500 text-xs">{quote.authorTitle}</p>
            )}
          </div>
          <button
            onClick={() => onDeepDive(quote)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
            style={{ color: era?.color, background: `${era?.color ?? "#334155"}18` }}
          >
            Explore →
          </button>
        </div>

        <p className="mt-3 text-slate-700 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
          Double-click to explore ↗
        </p>
      </div>
    </div>
  );
}
