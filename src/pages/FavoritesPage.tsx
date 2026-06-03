import { Link } from "react-router-dom";
import { Quote } from "../data/types";
import { ALL_QUOTES } from "../data/quotes";
import QuoteCard from "../components/QuoteCard";

type Props = {
  favorites: Set<string>;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onDeepDive: (q: Quote) => void;
};

export default function FavoritesPage({ favorites, isFavorite, onToggleFavorite, onDeepDive }: Props) {
  const favQuotes = ALL_QUOTES.filter((q) => favorites.has(q.id));

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Your Favorites</h1>
        <p className="text-[#6b6358] mt-2">
          {favQuotes.length === 0
            ? "No saved quotes yet — heart any quote to save it here."
            : `${favQuotes.length} quote${favQuotes.length !== 1 ? "s" : ""} you've saved.`}
        </p>
      </div>

      {favQuotes.length === 0 ? (
        <div className="text-center py-20 space-y-4">
          <span className="text-6xl">♡</span>
          <p className="text-[#6b6358]">
            As you explore, click ♡ on any quote to save it here.
          </p>
          <Link
            to="/"
            className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-[#d6cfc1] text-[#1a1a1a] hover:bg-stone-600 transition-colors text-sm font-medium"
          >
            Explore Quotes →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favQuotes.map((q) => (
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
  );
}
