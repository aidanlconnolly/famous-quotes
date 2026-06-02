import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import { ALL_QUOTES } from "../data/quotes";

type Props = {
  children: ReactNode;
  onDeepDive: (quoteId: string) => void;
  favCount: number;
};

export default function Layout({ children, onDeepDive, favCount }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-slate-700 text-white"
        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
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
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 px-4 py-3 border-b border-slate-800/70 bg-[#0f172a]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center gap-2 flex-wrap">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 mr-4">
            <span className="text-2xl">💬</span>
            <span className="font-bold text-white text-base tracking-tight hidden sm:block">
              The Quote Vault
            </span>
          </NavLink>

          {/* Nav links */}
          <nav className="flex items-center gap-1 flex-wrap">
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
          </nav>

          {/* Search */}
          <div className="ml-auto relative">
            <button
              onClick={() => setSearchOpen((o) => !o)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
              aria-label="Search quotes"
            >
              🔍
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-10 w-80 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl z-50 overflow-hidden">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search quotes or authors…"
                  className="w-full px-4 py-3 bg-transparent text-slate-100 placeholder-slate-500 text-sm border-b border-slate-700 outline-none"
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
                          className="w-full text-left px-4 py-3 hover:bg-slate-800 transition-colors border-b border-slate-800/50 last:border-0"
                        >
                          <p className="text-slate-300 text-xs italic line-clamp-1">
                            "{q.text}"
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">— {q.author}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {searchQuery.length > 1 && searchResults.length === 0 && (
                  <p className="px-4 py-3 text-slate-500 text-sm">No quotes found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">{children}</main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 text-center text-slate-600 text-sm">
        <p>
          {ALL_QUOTES.length} quotes from {new Set(ALL_QUOTES.map((q) => q.author)).size} of
          history's greatest minds.
        </p>
        <p className="mt-1 text-slate-700">The Quote Vault · Double-click any quote to explore it deeper</p>
      </footer>
    </div>
  );
}

