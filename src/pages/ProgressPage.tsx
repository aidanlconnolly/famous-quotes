import { Link } from "react-router-dom";
import { ALL_QUOTES, quotesByEra, quotesByTheme } from "../data/quotes";
import { ERAS } from "../data/eras";
import { THEMES } from "../data/themes";
import { Quote } from "../data/types";

type Props = {
  explored: Set<string>;
  onDeepDive: (q: Quote) => void;
};

export default function ProgressPage({ explored, onDeepDive }: Props) {
  const total = ALL_QUOTES.length;
  const done = explored.size;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Your Progress</h1>
        <p className="text-slate-400 mt-2">
          Track which quotes you've deep-dived. Double-click any quote to explore it — it'll count toward your progress.
        </p>
      </div>

      {/* Overall ring */}
      <div className="flex items-center gap-8 flex-wrap">
        <ProgressRing pct={pct} done={done} total={total} />
        <div className="space-y-2 flex-1 min-w-48">
          <h2 className="text-xl font-bold text-white">
            {done === 0
              ? "Start exploring!"
              : done === total
              ? "Complete — every quote explored! 🏆"
              : `${total - done} quote${total - done !== 1 ? "s" : ""} left to explore`}
          </h2>
          <p className="text-slate-400 text-sm">
            {done === 0
              ? "Double-click any quote anywhere in the vault to open its deep dive and track your progress."
              : `You've explored ${done} of ${total} quotes across all eras and themes.`}
          </p>
          {done === 0 && (
            <Link
              to="/"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-slate-700 text-slate-200 hover:bg-slate-600 transition-colors text-sm font-medium"
            >
              Start Exploring →
            </Link>
          )}
        </div>
      </div>

      {/* By Era */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">Progress by Era</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ERAS.map((era) => {
            const eraQuotes = quotesByEra(era.id);
            const eraDone = eraQuotes.filter((q) => explored.has(q.id)).length;
            const eraPct = Math.round((eraDone / eraQuotes.length) * 100);
            return (
              <div
                key={era.id}
                className="rounded-xl p-4"
                style={{ background: "#1e293b", border: `1px solid ${era.color}33` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{era.icon}</span>
                    <span className="font-semibold text-slate-200 text-sm">{era.name}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: era.color }}>
                    {eraDone}/{eraQuotes.length}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${eraPct}%`, background: era.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* By Theme */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-white">Progress by Theme</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {THEMES.map((theme) => {
            const themeQuotes = quotesByTheme(theme.id);
            const themeDone = themeQuotes.filter((q) => explored.has(q.id)).length;
            const themePct = Math.round((themeDone / themeQuotes.length) * 100);
            return (
              <div
                key={theme.id}
                className="rounded-xl p-4"
                style={{ background: "#1e293b", border: `1px solid ${theme.color}33` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{theme.icon}</span>
                    <span className="font-semibold text-slate-200 text-sm">{theme.name}</span>
                  </div>
                  <span className="text-xs font-bold" style={{ color: theme.color }}>
                    {themeDone}/{themeQuotes.length}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${themePct}%`, background: theme.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* All quotes checklist */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">All Quotes</h2>
          <div className="flex gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Explored</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-slate-700 inline-block" /> Not yet</span>
          </div>
        </div>

        {ERAS.map((era) => {
          const eraQuotes = quotesByEra(era.id);
          return (
            <div key={era.id} className="space-y-2">
              <div className="flex items-center gap-2">
                <span>{era.icon}</span>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{era.name}</h3>
                <div className="flex-1 h-px bg-slate-800" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {eraQuotes.map((q) => {
                  const isDone = explored.has(q.id);
                  return (
                    <button
                      key={q.id}
                      onClick={() => onDeepDive(q)}
                      className="flex items-start gap-3 text-left rounded-xl p-3 transition-all group"
                      style={{
                        background: isDone ? `${era.color}12` : "#1e293b",
                        border: `1px solid ${isDone ? era.color + "44" : "#334155"}`,
                      }}
                    >
                      {/* Status dot */}
                      <span
                        className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs"
                        style={{
                          background: isDone ? "#10b981" : "#334155",
                          color: isDone ? "white" : "transparent",
                        }}
                      >
                        {isDone ? "✓" : ""}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-xs italic line-clamp-2 leading-relaxed"
                          style={{ color: isDone ? "#e2e8f0" : "#64748b" }}
                        >
                          "{q.text}"
                        </p>
                        <p className="text-xs mt-1" style={{ color: isDone ? era.color : "#475569" }}>
                          — {q.author}
                        </p>
                      </div>
                      <span className="text-xs text-slate-600 group-hover:text-slate-400 flex-shrink-0 mt-0.5 transition-colors">
                        {isDone ? "re-explore" : "explore →"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function ProgressRing({ pct, done, total }: { pct: number; done: number; total: number }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div className="relative flex-shrink-0 w-36 h-36">
      <svg width="144" height="144" className="-rotate-90">
        {/* Track */}
        <circle cx="72" cy="72" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
        {/* Progress */}
        <circle
          cx="72"
          cy="72"
          r={r}
          fill="none"
          stroke="url(#progressGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)" }}
        />
        <defs>
          <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
      </svg>
      {/* Centre text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{pct}%</span>
        <span className="text-xs text-slate-500">{done}/{total}</span>
      </div>
    </div>
  );
}
