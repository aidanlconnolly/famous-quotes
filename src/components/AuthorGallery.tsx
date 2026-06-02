import { useNavigate } from "react-router-dom";
import { ALL_QUOTES, allAuthors, authorSlug } from "../data/quotes";
import { ERAS } from "../data/eras";

export default function AuthorGallery() {
  const navigate = useNavigate();
  const authors = allAuthors();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">All Thinkers</h2>
        <p className="text-slate-400 mt-1">
          {authors.length} minds across history. Click a thinker to see all their quotes and dive deep.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {authors.map((name) => {
          const authorQuotes = ALL_QUOTES.filter((q) => q.author === name);
          const sample = authorQuotes[0];
          const era = ERAS.find((e) => e.id === sample?.eraId);
          const slug = authorSlug(name);

          return (
            <button
              key={name}
              onClick={() => navigate(`/author/${slug}`)}
              className="rounded-2xl p-4 text-left transition-all duration-200 hover:scale-105 active:scale-95 group"
              style={{
                background: "#1e293b",
                border: `1px solid ${era?.color ?? "#334155"}44`,
              }}
            >
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 transition-all"
                style={{
                  background: `${era?.color ?? "#334155"}22`,
                }}
              >
                {sample?.emoji ?? name[0]}
              </div>
              <p className="font-semibold text-slate-200 text-sm leading-tight group-hover:text-white transition-colors">
                {name}
              </p>
              {sample?.authorTitle && (
                <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{sample.authorTitle}</p>
              )}
              <div className="flex items-center justify-between mt-2">
                {sample?.authorLived && (
                  <span className="text-slate-600 text-xs">{sample.authorLived}</span>
                )}
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium ml-auto"
                  style={{ background: `${era?.color ?? "#334155"}22`, color: era?.color ?? "#94a3b8" }}
                >
                  {authorQuotes.length} quote{authorQuotes.length !== 1 ? "s" : ""}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
