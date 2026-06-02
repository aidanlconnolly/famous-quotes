import { useState, useCallback } from "react";

const STORAGE_KEY = "quote-vault-explored";

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as string[]);
  } catch {
    return new Set();
  }
}

function save(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(ids)));
}

export function useExplored() {
  const [explored, setExplored] = useState<Set<string>>(load);

  const markExplored = useCallback((id: string) => {
    setExplored((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      save(next);
      return next;
    });
  }, []);

  const isExplored = useCallback(
    (id: string) => explored.has(id),
    [explored]
  );

  return { explored, markExplored, isExplored, count: explored.size };
}
