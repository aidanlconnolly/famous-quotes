import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { ALL_QUOTES } from "../data/quotes";

type Props = {
  children: ReactNode;
  onDeepDive: (quoteId: string) => void;
  favCount: number;
  exploredCount: number;
};

export default function Layout({ children, onDeepDive, favCount, exploredCount }: Props) {
  const totalQuotes = ALL_QUOTES.length;
  const progressPct = Math.round((exploredCount / totalQuotes) * 100);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-stone-700 text-amber-50"
        : "text-stone-400 hover:text-stone-200 hover:bg-stone-800"
    }`;

  const searchResults =
    searchQuery.length > 1
      ? ALL_QUOTES.filter(
          (q) =>
            q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.author.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 6)
      : [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "transparent" }}>
      {/* Nav — transparent when at top so mountain shows through */}
      <header className="sticky top-0 z-40 px-4 py-3 border-b border-white/5 transition-colors duration-300"
        style={{ background: "rgba(26,21,16,0.72)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center">
          {/* Logo — left */}
          <div className="flex-1">
            <NavLink to="/" className="flex items-center gap-2">
              <span className="text-2xl">💬</span>
              <span className="font-bold text-white text-base tracking-tight hidden sm:block">
                The Quote Vault
              </span>
            </NavLink>
          </div>

          {/* Nav links — center */}
          <nav className="flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/eras" className={navLinkClass}>
              By Era
            </NavLink>
            <NavLink to="/themes" className={navLinkClass}>
              By Theme
            </NavLink>
            <NavLink to="/authors" className={navLinkClass}>
              By Author
            </NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              ♥{favCount > 0 && ` ${favCount}`}
            </NavLink>
            <NavLink to="/progress" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <span className="text-xs">⛰️</span>
                <span>Progress</span>
                {exploredCount > 0 && (
                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-900/60 text-amber-400 font-bold">
                    {progressPct}%
                  </span>
                )}
              </span>
            </NavLink>
          </nav>

          {/* Search — right */}
          <div className="flex-1 flex justify-end relative">
            <button
              onClick={() => setSearchOpen((o) => !o)}
              className="p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors text-sm"
              aria-label="Search quotes"
            >
              🔍
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-10 w-80 rounded-xl shadow-2xl z-50 overflow-hidden" style={{ background: "#f4f1ea", border: "1px solid #d6cfc1" }}>
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search quotes or authors…"
                  className="w-full px-4 py-3 bg-transparent text-sm outline-none"
                  style={{ color: "#1a1a1a", borderBottom: "1px solid #d6cfc1" }}
                />
                {searchResults.length > 0 && (
                  <ul className="max-h-72 overflow-y-auto">
                    {searchResults.map((q) => (
                      <li key={q.id}>
                        <button
                          onClick={() => {
                            onDeepDive(q.id);
                            setSearchOpen(false);
                            setSearchQuery("");
                          }}
                          className="w-full text-left px-4 py-3 transition-colors last:border-0"
                          style={{ borderBottom: "1px solid #d6cfc180" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#ebe6dc")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <p className="text-xs italic line-clamp-1" style={{ color: "#2d2820" }}>
                            "{q.text}"
                          </p>
                          <p className="text-xs mt-0.5" style={{ color: "#6b6358" }}>— {q.author}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {searchQuery.length > 1 && searchResults.length === 0 && (
                  <p className="px-4 py-3 text-sm" style={{ color: "#6b6358" }}>No quotes found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main — pages control their own width/padding */}
      <main className="flex-1 w-full">{children}</main>

      {/* Footer */}
      <footer className="py-8 text-center text-sm" style={{ borderTop: "1px solid #d6cfc1", color: "#6b6358" }}>
        <p>
          {ALL_QUOTES.length} quotes from {new Set(ALL_QUOTES.map((q) => q.author)).size} of
          history's greatest minds.
        </p>
        <p className="mt-1" style={{ color: "#9a9088" }}>The Quote Vault · Double-click any quote to explore it deeper</p>
      </footer>
    </div>
  );
}

