import { useState, useEffect } from "react";
import { Routes, Route, useSearchParams } from "react-router-dom";
import Layout from "./components/Layout";
import DeepDiveModal from "./components/DeepDiveModal";
import HomePage from "./pages/HomePage";
import ErasPage from "./pages/ErasPage";
import ThemesPage from "./pages/ThemesPage";
import AuthorsPage from "./pages/AuthorsPage";
import AuthorPage from "./pages/AuthorPage";
import FavoritesPage from "./pages/FavoritesPage";
import ProgressPage from "./pages/ProgressPage";
import { useFavorites } from "./hooks/useFavorites";
import { useExplored } from "./hooks/useExplored";
import { quoteById } from "./data/quotes";
import { Quote } from "./data/types";

export default function App() {
  const { favorites, toggle, isFavorite, count: favCount } = useFavorites();
  const { explored, markExplored, isExplored, count: exploredCount } = useExplored();
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);
  const [searchParams] = useSearchParams();

  // Handle deep-link: /?q=<quote-id> opens the modal on load
  useEffect(() => {
    const qid = searchParams.get("q");
    if (qid) {
      const found = quoteById(qid);
      if (found) { setActiveQuote(found); markExplored(found.id); }
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const openDeepDive = (q: Quote) => {
    setActiveQuote(q);
    markExplored(q.id);
  };
  const openDeepDiveById = (id: string) => {
    const found = quoteById(id);
    if (found) { setActiveQuote(found); markExplored(found.id); }
  };
  const closeDeepDive = () => setActiveQuote(null);

  const sharedProps = {
    isFavorite,
    onToggleFavorite: toggle,
    onDeepDive: openDeepDive,
  };

  return (
    <>
      <Layout onDeepDive={openDeepDiveById} favCount={favCount} exploredCount={exploredCount}>
        <Routes>
          <Route path="/" element={<HomePage {...sharedProps} exploredCount={exploredCount} />} />
          <Route path="/eras" element={<ErasPage {...sharedProps} />} />
          <Route path="/themes" element={<ThemesPage {...sharedProps} />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/author/:slug" element={<AuthorPage {...sharedProps} />} />
          <Route path="/favorites" element={<FavoritesPage favorites={favorites} {...sharedProps} />} />
          <Route path="/progress" element={<ProgressPage explored={explored} onDeepDive={openDeepDive} />} />
          <Route path="*" element={<HomePage {...sharedProps} exploredCount={exploredCount} />} />
        </Routes>
      </Layout>

      {activeQuote && (
        <DeepDiveModal
          quote={activeQuote}
          onClose={closeDeepDive}
          onOpen={openDeepDive}
          isFavorite={isFavorite(activeQuote.id)}
          onToggleFavorite={toggle}
          isExplored={isExplored(activeQuote.id)}
        />
      )}
    </>
  );
}
