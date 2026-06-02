import { useState } from "react";
import { Quote } from "../data/types";
import { THEMES } from "../data/themes";
import { quotesByTheme } from "../data/quotes";
import QuoteCard from "./QuoteCard";

type Props = {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onDeepDive: (q: Quote) => void;
};

export default function ThemeGrid({ isFavorite, onToggleFavorite, onDeepDive }: Props) {
  const [activeTheme, setActiveTheme] = useState<string>(THEMES[0].id);
  const theme = THEMES.find((t) => t.id === activeTheme) ?? THEMES[0];
  const quotes = quotesByTheme(theme.id);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Theme picker */}
      <div className="flex flex-wrap gap-3">
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTheme(t.id)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
            style={
              activeTheme === t.id
                ? {
                    background: t.color,
                    color: "#fff",
                    boxShadow: `0 4px 16px ${t.color}66`,
                  }
                : {
                    background: `${t.color}18`,
                    color: t.color,
                    border: `1px solid ${t.color}33`,
                  }
            }
          >
            <span className="text-base">{t.icon}</span>
            <span>{t.name}</span>
            <span
              className="text-xs px-1.5 py-0.5 rounded-full"
              style={
                activeTheme === t.id
                  ? { background: "rgba(255,255,255,0.25)" }
                  : { background: `${t.color}22` }
              }
            >
              {quotesByTheme(t.id).length}
            </span>
          </button>
        ))}
      </div>

      {/* Theme header */}
      <div
        className="rounded-2xl p-6"
        style={{
          background: `linear-gradient(135deg, ${theme.color}22 0%, transparent 60%)`,
          border: `1px solid ${theme.color}33`,
        }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{theme.icon}</span>
          <h2 className="text-2xl font-bold text-white">{theme.name}</h2>
        </div>
        <p className="text-slate-300 leading-relaxed">{theme.blurb}</p>
      </div>

      {/* Quotes grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quotes.map((q) => (
          <QuoteCard
            key={q.id}
            quote={q}
            isFavorite={isFavorite(q.id)}
            onToggleFavorite={onToggleFavorite}
            onDeepDive={onDeepDive}
          />
        ))}
      </div>
    </div>
  );
}
