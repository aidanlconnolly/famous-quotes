import { useState } from "react";
import { Quote } from "../data/types";
import { ERAS } from "../data/eras";
import { quotesByEra } from "../data/quotes";
import QuoteCard from "./QuoteCard";

type Props = {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onDeepDive: (q: Quote) => void;
};

export default function EraRoadmap({ isFavorite, onToggleFavorite, onDeepDive }: Props) {
  const [expandedEra, setExpandedEra] = useState<string | null>("modern");

  return (
    <div className="max-w-5xl mx-auto space-y-0">
      {ERAS.map((era, idx) => {
        const quotes = quotesByEra(era.id);
        const isOpen = expandedEra === era.id;
        const isLast = idx === ERAS.length - 1;

        return (
          <div key={era.id} className="flex gap-4 md:gap-6">
            {/* Spine + node */}
            <div className="flex flex-col items-center flex-shrink-0 pt-1">
              <button
                onClick={() => setExpandedEra(isOpen ? null : era.id)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-200 border-2 hover:scale-110 active:scale-95 flex-shrink-0"
                style={
                  isOpen
                    ? {
                        background: era.color,
                        borderColor: era.color,
                        boxShadow: `0 0 16px ${era.color}88`,
                      }
                    : {
                        background: "transparent",
                        borderColor: "#475569",
                        color: era.color,
                      }
                }
                aria-expanded={isOpen}
              >
                {era.icon}
              </button>
              {!isLast && (
                <div
                  className="w-0.5 flex-1 my-1 min-h-[2rem] transition-colors duration-300"
                  style={{ background: isOpen ? era.color + "88" : "#334155" }}
                />
              )}
            </div>

            {/* Era content */}
            <div className="flex-1 pb-6">
              <button
                onClick={() => setExpandedEra(isOpen ? null : era.id)}
                className="text-left w-full group pt-1"
              >
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="text-xl font-bold text-white group-hover:text-slate-100 transition-colors">
                    {era.name}
                  </h2>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${era.color}20`, color: era.color }}
                  >
                    {era.range}
                  </span>
                  <span className="text-slate-500 text-xs ml-auto">
                    {quotes.length} quote{quotes.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-1 leading-relaxed line-clamp-2">
                  {era.blurb}
                </p>
              </button>

              {isOpen && (
                <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
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
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
