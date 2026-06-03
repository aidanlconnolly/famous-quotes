import { Quote } from "../data/types";
import { ERAS } from "../data/eras";
import { quoteOfDay } from "../lib/daily";

type Props = {
  onDeepDive: (q: Quote) => void;
};

export default function QuoteOfDay({ onDeepDive }: Props) {
  const quote = quoteOfDay();
  const era = ERAS.find((e) => e.id === quote.eraId);
  const color = era?.color ?? "#94a3b8";
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className="relative overflow-hidden rounded-3xl cursor-default group no-select"
      style={{
        background: `linear-gradient(135deg, #ebe6dc 0%, #e8e2d8 60%, #e4ddd2 100%)`,
        border: `1px solid ${color}30`,
        boxShadow: `0 0 60px ${color}12, 0 4px 40px rgba(0,0,0,0.5)`,
      }}
      onDoubleClick={() => onDeepDive(quote)}
    >
      {/* Glow orb behind text */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-40%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "70%",
          height: "200%",
          background: `radial-gradient(ellipse at center, ${color}18 0%, transparent 70%)`,
        }}
      />

      {/* Large decorative quote mark */}
      <div
        className="absolute top-4 left-8 font-serif select-none pointer-events-none"
        style={{
          fontSize: "clamp(8rem, 16vw, 14rem)",
          lineHeight: 1,
          color: `${color}12`,
          fontFamily: "Georgia, serif",
        }}
      >
        "
      </div>

      <div className="relative z-10 px-8 py-10 md:px-14 md:py-14">
        {/* Top row: label + date */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: color, boxShadow: `0 0 8px ${color}` }}
            />
            <span
              className="text-xs font-bold uppercase tracking-[0.2em]"
              style={{ color: `${color}cc` }}
            >
              Quote of the Day
            </span>
          </div>
          <span
            className="text-xs font-medium tracking-wide"
            style={{ color: "#6b6358" }}
          >
            {today}
          </span>
        </div>

        {/* Quote text */}
        <blockquote
          className="italic leading-relaxed mb-10"
          style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
            color: "#2d2820",
            textShadow: "none",
            letterSpacing: "0.01em",
          }}
        >
          "{quote.text}"
        </blockquote>

        {/* Bottom row: author + era pill + CTA */}
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p
              className="font-semibold text-lg"
              style={{ color: "#1a1a1a" }}
            >
              {quote.author}
            </p>
            {quote.authorTitle && (
              <p className="text-sm mt-0.5" style={{ color: "rgba(148,163,184,0.6)" }}>
                {quote.authorTitle}
              </p>
            )}
            {era && (
              <span
                className="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: `${color}18`,
                  border: `1px solid ${color}35`,
                  color: `${color}cc`,
                  letterSpacing: "0.05em",
                }}
              >
                {era.icon} {era.name}
              </span>
            )}
          </div>

          <button
            onClick={() => onDeepDive(quote)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95 shrink-0"
            style={{
              background: `${color}22`,
              border: `1px solid ${color}45`,
              color: color,
              boxShadow: `0 0 20px ${color}15`,
            }}
          >
            Explore
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Subtle bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }}
      />
    </div>
  );
}
