import { Link } from "react-router-dom";
import { ERAS } from "../data/eras";
import { THEMES } from "../data/themes";
import { ALL_QUOTES, allAuthors } from "../data/quotes";

export default function BrowseCards({ exploredCount }: { exploredCount: number }) {
  const totalQuotes = ALL_QUOTES.length;
  const pct = Math.round((exploredCount / totalQuotes) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* By Era */}
      <BrowseCard
        to="/eras"
        icon="🏛️"
        title="By Era"
        accent="#d97706"
        stats={`${ERAS.length} eras · ${totalQuotes} quotes`}
        description="Journey from Ancient philosophers to contemporary champions, following wisdom through the ages."
        chips={ERAS.map((e) => ({ icon: e.icon, label: e.name, color: e.color }))}
      />

      {/* By Theme */}
      <BrowseCard
        to="/themes"
        icon="✨"
        title="By Theme"
        accent="#7c3aed"
        stats={`${THEMES.length} themes`}
        description="Find exactly what you need — motivation, Stoic wisdom, resilience, or the competitive edge."
        chips={THEMES.map((t) => ({ icon: t.icon, label: t.name, color: t.color }))}
      />

      {/* By Author */}
      <BrowseCard
        to="/authors"
        icon="👤"
        title="By Author"
        accent="#059669"
        stats={`${allAuthors().length} thinkers`}
        description="Explore every word from each great mind — their quotes, their era, their lasting legacy."
        chips={allAuthors().slice(0, 5).map((name) => {
          const q = ALL_QUOTES.find((x) => x.author === name);
          return { icon: q?.emoji ?? "💬", label: name, color: "#64748b" };
        })}
        extra={
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Explored</span>
              <span className="text-xs font-bold text-slate-300">{exploredCount}/{totalQuotes} · {pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-slate-700/60 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${pct}%`, background: "linear-gradient(90deg, #059669, #34d399)" }}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}

function BrowseCard({
  to,
  icon,
  title,
  accent,
  stats,
  description,
  chips,
  extra,
}: {
  to: string;
  icon: string;
  title: string;
  accent: string;
  stats: string;
  description: string;
  chips: { icon: string; label: string; color: string }[];
  extra?: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="relative block rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:scale-[1.02] group"
      style={{
        background: "rgba(15, 23, 42, 0.6)",
        border: `1px solid ${accent}30`,
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      {/* Faded corner glow (the "personal rankings" fade effect) */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle at top right, ${accent}, transparent 70%)` }}
      />
      <div
        className="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none"
        style={{ background: `radial-gradient(circle at bottom left, ${accent}, transparent 70%)` }}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
              style={{ background: `${accent}22`, border: `1px solid ${accent}44` }}
            >
              {icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">{title}</h3>
              <p className="text-xs" style={{ color: accent }}>{stats}</p>
            </div>
          </div>
          <span className="text-slate-500 group-hover:text-slate-300 transition-colors text-lg">→</span>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-3">{description}</p>

        <div className="flex flex-wrap gap-1.5">
          {chips.slice(0, 4).map((c) => (
            <span
              key={c.label}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: `${c.color}18`, color: c.color, border: `1px solid ${c.color}22` }}
            >
              {c.icon} {c.label}
            </span>
          ))}
          {chips.length > 4 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-500">
              +{chips.length - 4} more
            </span>
          )}
        </div>

        {extra}
      </div>
    </Link>
  );
}
