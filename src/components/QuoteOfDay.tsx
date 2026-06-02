import { Quote } from "../data/types";
import { ERAS } from "../data/eras";
import { quoteOfDay } from "../lib/daily";

type Props = {
  onDeepDive: (q: Quote) => void;
};

export default function QuoteOfDay({ onDeepDive }: Props) {
  const quote = quoteOfDay();
  const era = ERAS.find((e) => e.id === quote.eraId);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="rounded-2xl p-6 cursor-default group no-select"
      style={{
        background: "#1e293b",
        border: `1px solid ${era?.color ?? "#334155"}55`,
      }}
      onDoubleClick={() => onDeepDive(quote)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: era?.color }}
          />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Quote of the Day
          </span>
        </div>
        <span className="text-xs text-slate-600">{today}</span>
      </div>

      <blockquote className="quote-serif text-lg text-slate-100 italic leading-relaxed mb-4">
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
  );
}
