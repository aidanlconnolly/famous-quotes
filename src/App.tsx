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
import { useFavorites } from "./hooks/useFavorites";
import { quoteById } from "./data/quotes";
import { Quote } from "./data/types";

export default function App() {
  const { favorites, toggle, isFavorite, count } = useFavorites();
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);
  const [searchParams] = useSearchParams();

  // Handle deep-link: /?q=<quote-id> opens the modal on load
  useEffect(() => {
    const qid = searchParams.get("q");
    if (qid) {
      const found = quoteById(qid);
      if (found) setActiveQuote(found);
    }
  }, [searchParams]);

  const openDeepDive = (q: Quote) => setActiveQuote(q);
  const openDeepDiveById = (id: string) => {
    const found = quoteById(id);
    if (found) setActiveQuote(found);
  };
  const closeDeepDive = () => setActiveQuote(null);

  const sharedProps = {
    isFavorite,
    onToggleFavorite: toggle,
    onDeepDive: openDeepDive,
  };

  return (
    <>
      <Layout onDeepDive={openDeepDiveById} favCount={count}>
        <Routes>
          <Route path="/" element={<HomePage {...sharedProps} />} />
          <Route path="/eras" element={<ErasPage {...sharedProps} />} />
          <Route path="/themes" element={<ThemesPage {...sharedProps} />} />
          <Route path="/authors" element={<AuthorsPage />} />
          <Route path="/author/:slug" element={<AuthorPage {...sharedProps} />} />
          <Route
            path="/favorites"
            element={<FavoritesPage favorites={favorites} {...sharedProps} />}
          />
          <Route path="*" element={<HomePage {...sharedProps} />} />
        </Routes>
      </Layout>

      {activeQuote && (
        <DeepDiveModal
          quote={activeQuote}
          onClose={closeDeepDive}
          onOpen={openDeepDive}
          isFavorite={isFavorite(activeQuote.id)}
          onToggleFavorite={toggle}
        />
      )}
    </>
  );
}
