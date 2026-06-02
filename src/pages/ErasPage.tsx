import { Quote } from "../data/types";
import EraRoadmap from "../components/EraRoadmap";

type Props = {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onDeepDive: (q: Quote) => void;
};

export default function ErasPage({ isFavorite, onToggleFavorite, onDeepDive }: Props) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Browse by Era</h1>
        <p className="text-slate-400 mt-2 max-w-2xl">
          From ancient philosophers to contemporary champions — explore wisdom grouped by the age
          it came from. Click an era to expand its quotes. Double-click any quote to go deep.
        </p>
      </div>
      <EraRoadmap
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
        onDeepDive={onDeepDive}
      />
    </div>
  );
}
