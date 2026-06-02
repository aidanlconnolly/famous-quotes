import { useState, useCallback } from "react";
import { Quote } from "../data/types";
import { ALL_QUOTES } from "../data/quotes";

function pickRandom(exclude?: string): Quote {
  const pool = exclude ? ALL_QUOTES.filter((q) => q.id !== exclude) : ALL_QUOTES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function useRandomQuote() {
  const [quote, setQuote] = useState<Quote>(() => pickRandom());

  const shuffle = useCallback(() => {
    setQuote((prev) => pickRandom(prev.id));
  }, []);

  return { quote, shuffle };
}
