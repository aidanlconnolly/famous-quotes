import { useParams, useNavigate } from "react-router-dom";
import { Quote } from "../data/types";
import { ALL_QUOTES, authorFromSlug } from "../data/quotes";
import { ERAS } from "../data/eras";
import QuoteCard from "../components/QuoteCard";

type Props = {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onDeepDive: (q: Quote) => void;
};

export default function AuthorPage({ isFavorite, onToggleFavorite, onDeepDive }: Props) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const authorName = authorFromSlug(slug ?? "");
  const quotes = authorName ? ALL_QUOTES.filter((q) => q.author === authorName) : [];
  const sample = quotes[0];
  const era = ERAS.find((e) => e.id === sample?.eraId);

  if (!authorName || quotes.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-[#6b6358] text-lg">Author not found.</p>
        <button
          onClick={() => navigate("/authors")}
          className="mt-4 text-[#6b6358] hover:text-white underline text-sm"
        >
          ← Back to authors
        </button>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-6xl mx-auto space-y-8">
      {/* Back */}
      <button
        onClick={() => navigate("/authors")}
        className="text-[#6b6358] hover:text-[#2d2820] text-sm flex items-center gap-1 transition-colors"
      >
        ← All Authors
      </button>

      {/* Author header */}
      <div
        className="rounded-3xl p-8 md:p-10"
        style={{
          background: `linear-gradient(135deg, ${era?.color ?? "#334155"}22 0%, #ebe6dc 60%)`,
          border: `1px solid ${era?.color ?? "#334155"}44`,
        }}
      >
        <div className="flex items-start gap-6 flex-wrap">
          {/* Avatar */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
            style={{ background: `${era?.color ?? "#334155"}33` }}
          >
            {sample.emoji ?? authorName[0]}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">{authorName}</h1>
            {sample.authorTitle && (
              <p className="text-[#2d2820] mt-1">{sample.authorTitle}</p>
            )}
            {sample.authorLived && (
              <p className="text-[#6b6358] text-sm mt-1">{sample.authorLived}</p>
            )}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              {era && (
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${era.color}20`, color: era.color }}
                >
                  {era.icon} {era.name}
                </span>
              )}
              <span className="text-xs text-[#6b6358]">
                {quotes.length} quote{quotes.length !== 1 ? "s" : ""} in the vault
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quotes */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          Words of {authorName.split(" ").slice(-1)[0]}
        </h2>
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
    </div>
  );
}
