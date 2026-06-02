import { useEffect, useRef } from "react";
import { Quote } from "../data/types";
import { ERAS } from "../data/eras";
import { THEMES } from "../data/themes";
import { relatedQuotes } from "../data/quotes";
import { copyQuote, shareUrl } from "../lib/share";

type Props = {
  quote: Quote;
  onClose: () => void;
  onOpen: (q: Quote) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isExplored?: boolean;
};

export default function DeepDiveModal({
  quote,
  onClose,
  onOpen,
  isFavorite,
  isExplored,
  onToggleFavorite,
}: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const era = ERAS.find((e) => e.id === quote.eraId);
  const themes = THEMES.filter((t) => quote.themeIds.includes(t.id));
  const related = relatedQuotes(quote, 3);

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleCopy = async () => {
    const ok = await copyQuote(quote);
    if (ok) {
      // Brief visual feedback handled by button state
    }
  };

  const handleShare = () => {
    const url = shareUrl(quote);
    navigator.clipboard.writeText(url).catch(() => {});
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade"
      style={{ background: "rgba(2, 6, 23, 0.88)" }}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl animate-pop"
        style={{ background: "#0f172a", border: `1.5px solid ${era?.color ?? "#475569"}` }}
      >
        {/* ── Header bar ── */}
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${era?.color ?? "#334155"}22, #0f172a88)`,
            borderBottom: `1px solid ${era?.color ?? "#475569"}44`,
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex items-center gap-3 text-sm" style={{ color: era?.color }}>
            <span className="text-lg">{era?.icon}</span>
            <span className="font-semibold tracking-wide uppercase text-xs">Deep Dive</span>
            {isExplored && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-900/50 text-emerald-400 border border-emerald-700/40">
                ✓ Explored
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pb-8 pt-5 space-y-7">
          {/* ── Quote ── */}
          <div
            className="rounded-xl p-5"
            style={{ background: `${era?.color ?? "#475569"}14`, borderLeft: `4px solid ${era?.color ?? "#475569"}` }}
          >
            <blockquote className="quote-serif text-lg text-white leading-relaxed italic">
              "{quote.text}"
            </blockquote>
            <footer className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-bold text-slate-200">{quote.author}</span>
              {quote.authorTitle && (
                <span className="text-slate-400 text-sm">· {quote.authorTitle}</span>
              )}
              {quote.authorLived && (
                <span className="text-slate-500 text-sm">({quote.authorLived})</span>
              )}
            </footer>
            {(quote.source || quote.year) && (
              <p className="mt-1.5 text-slate-500 text-xs italic">
                {[quote.source, quote.year].filter(Boolean).join(" · ")}
              </p>
            )}
          </div>

          {/* ── Context ── */}
          {quote.deepDive.context && (
            <section className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Background & Context
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm">{quote.deepDive.context}</p>
            </section>
          )}

          {/* ── Meaning ── */}
          <section className="space-y-2">
            <h3
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: era?.color ?? "#94a3b8" }}
            >
              What It Means
            </h3>
            <p className="text-slate-200 leading-relaxed">{quote.deepDive.meaning}</p>
          </section>

          {/* ── Significance ── */}
          <section
            className="rounded-xl p-5 space-y-2"
            style={{ background: "#1e293b", border: `1px solid ${era?.color ?? "#334155"}44` }}
          >
            <h3
              className="text-xs font-bold uppercase tracking-widest"
              style={{ color: era?.color ?? "#94a3b8" }}
            >
              ✦ What It Means For You
            </h3>
            <p className="text-slate-200 leading-relaxed">{quote.deepDive.significance}</p>
          </section>

          {/* ── Themes ── */}
          {themes.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {themes.map((t) => (
                <span
                  key={t.id}
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}44` }}
                >
                  {t.icon} {t.name}
                </span>
              ))}
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onToggleFavorite(quote.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={
                isFavorite
                  ? { background: "#be185d22", color: "#f472b6", border: "1px solid #be185d44" }
                  : { background: "#1e293b", color: "#94a3b8", border: "1px solid #334155" }
              }
            >
              {isFavorite ? "♥ Saved" : "♡ Save"}
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition-colors"
            >
              ⧉ Copy Quote
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:text-white transition-colors"
            >
              🔗 Copy Link
            </button>
          </div>

          {/* ── Related quotes ── */}
          {related.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Related Quotes
              </h3>
              <div className="space-y-2">
                {related.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => onOpen(r)}
                    className="w-full text-left rounded-lg px-4 py-3 bg-slate-800/60 border border-slate-700/50 hover:border-slate-500 transition-colors group"
                  >
                    <p className="quote-serif text-sm text-slate-300 italic group-hover:text-white transition-colors line-clamp-2">
                      "{r.text}"
                    </p>
                    <p className="mt-1 text-xs text-slate-500 group-hover:text-slate-400">
                      — {r.author}
                    </p>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
