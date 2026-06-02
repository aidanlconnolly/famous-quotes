import { Quote } from "../data/types";
import RandomHero from "../components/RandomHero";
import QuoteOfDay from "../components/QuoteOfDay";
import { ALL_QUOTES } from "../data/quotes";
import { ERAS } from "../data/eras";
import { THEMES } from "../data/themes";
import { Link } from "react-router-dom";

type Props = {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onDeepDive: (q: Quote) => void;
};

export default function HomePage({ onDeepDive }: Props) {
  return (
    <div className="space-y-12">
      {/* Hero section */}
      <div className="text-center pt-4 pb-2">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          The Quote Vault
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          {ALL_QUOTES.length} quotes from {new Set(ALL_QUOTES.map((q) => q.author)).size} of
          history's greatest minds. Double-click any quote to explore what it truly means.
        </p>
      </div>

      {/* Random quote hero */}
      <RandomHero onDeepDive={onDeepDive} />

      {/* Quote of the day + stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2">
          <QuoteOfDay onDeepDive={onDeepDive} />
        </div>
        {/* Quick stats */}
        <div className="rounded-2xl p-5 bg-slate-800/40 border border-slate-700/40 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">Vault Stats</h3>
          <div className="space-y-3">
            <StatRow label="Total Quotes" value={ALL_QUOTES.length.toString()} />
            <StatRow label="Thinkers" value={new Set(ALL_QUOTES.map((q) => q.author)).size.toString()} />
            <StatRow label="Eras" value={ERAS.length.toString()} />
            <StatRow label="Themes" value={THEMES.length.toString()} />
          </div>
        </div>
      </div>

      {/* Browse dimensions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <BrowseCard
          to="/eras"
          icon="🏛️"
          title="Browse by Era"
          description="Journey through time — from Ancient philosophers to contemporary champions."
          items={ERAS.map((e) => ({ icon: e.icon, name: e.name, color: e.color }))}
        />
        <BrowseCard
          to="/themes"
          icon="✨"
          title="Browse by Theme"
          description="Find quotes by what you need — motivation, wisdom, resilience, and more."
          items={THEMES.map((t) => ({ icon: t.icon, name: t.name, color: t.color }))}
        />
        <BrowseCard
          to="/authors"
          icon="👤"
          title="Browse by Author"
          description="Explore the complete wisdom of each thinker — all their quotes in one place."
          items={Array.from(new Set(ALL_QUOTES.map((q) => q.author)))
            .slice(0, 5)
            .map((name) => {
              const q = ALL_QUOTES.find((x) => x.author === name);
              return { icon: q?.emoji ?? "💬", name, color: "#64748b" };
            })}
        />
      </div>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}

function BrowseCard({
  to,
  icon,
  title,
  description,
  items,
}: {
  to: string;
  icon: string;
  title: string;
  description: string;
  items: { icon: string; name: string; color: string }[];
}) {
  return (
    <Link
      to={to}
      className="block rounded-2xl p-5 bg-slate-800/40 border border-slate-700/40 hover:border-slate-500/60 transition-all duration-200 hover:scale-[1.02] group"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{icon}</span>
        <h3 className="font-bold text-white">{title}</h3>
      </div>
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item.name}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: `${item.color}18`, color: item.color }}
          >
            {item.icon} {item.name}
          </span>
        ))}
      </div>
      <div className="mt-4 text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
        Explore all →
      </div>
    </Link>
  );
}
