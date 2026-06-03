import { Quote } from "../data/types";
import ThemeGrid from "../components/ThemeGrid";

type Props = {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onDeepDive: (q: Quote) => void;
};

export default function ThemesPage({ isFavorite, onToggleFavorite, onDeepDive }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Browse by Theme</h1>
        <p className="text-[#6b6358] mt-2 max-w-2xl">
          Find exactly what you need — motivation before a big challenge, Stoic wisdom when you
          need perspective, or words about resilience when you've been knocked down.
        </p>
      </div>
      <ThemeGrid
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onDeepDive={onDeepDive}
      />
    </div>
  );
}
