import { Quote } from "../data/types";
import MountainPanorama from "../components/MountainPanorama";
import BrowseCards from "../components/BrowseCards";
import QuoteOfDay from "../components/QuoteOfDay";
import RandomHero from "../components/RandomHero";

type Props = {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onDeepDive: (q: Quote) => void;
  exploredCount: number;
};

export default function HomePage({ onDeepDive, exploredCount }: Props) {
  return (
    <div className="space-y-10">
      {/* Heading */}
      <div className="text-center pt-2">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
          The Quote Vault
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Wisdom from history's greatest minds — drag the mountain to explore.
          Double-click any quote to go deep.
        </p>
      </div>

      {/* Mountain panorama — the three peaks = the three browse tabs */}
      <MountainPanorama />

      {/* Faded browse cards below the mountain */}
      <BrowseCards exploredCount={exploredCount} />

      {/* Quote of the day + random quote */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <QuoteOfDay onDeepDive={onDeepDive} />
        <RandomHero onDeepDive={onDeepDive} />
      </div>
    </div>
  );
}
