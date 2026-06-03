import { useEffect, useRef, useState } from "react";
import { Quote } from "../data/types";
import MountainBackground from "../components/MountainBackground";
import BrowseCards from "../components/BrowseCards";
import QuoteOfDay from "../components/QuoteOfDay";
import { ALL_QUOTES } from "../data/quotes";

type Props = {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
  onDeepDive: (q: Quote) => void;
  exploredCount: number;
};

export default function HomePage({ onDeepDive, exploredCount }: Props) {
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mountain opacity: 1 at top → 0 when scrolled 60% of viewport height
  const mountainOpacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.55));
  // Hero content fades and shifts up as you scroll
  const heroOpacity = Math.max(0, 1 - scrollY / (window.innerHeight * 0.4));
  const heroTranslate = scrollY * 0.35;

  return (
    <>
      {/* ── FIXED MOUNTAIN BACKGROUND ── */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: mountainOpacity }}
      >
        <MountainBackground />
      </div>

      {/* ── HERO SECTION: full viewport, sits on top of mountain ── */}
      <section
        ref={heroRef}
        className="relative z-10 flex flex-col items-center justify-center text-center px-6"
        style={{ minHeight: "100vh" }}
      >
        <div
          style={{
            opacity: heroOpacity,
            transform: `translateY(-${heroTranslate}px)`,
            willChange: "transform, opacity",
          }}
        >
          {/* Glass pill label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold uppercase tracking-widest"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              color: "#c8d8e8",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            {ALL_QUOTES.length} quotes · {new Set(ALL_QUOTES.map(q => q.author)).size} great minds
          </div>

          {/* Title */}
          <h1
            className="font-bold tracking-tight mb-4"
            style={{
              fontSize: "clamp(3rem, 8vw, 6rem)",
              lineHeight: 1.05,
              color: "white",
              textShadow: "0 2px 32px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.8)",
            }}
          >
            The Quote Vault
          </h1>

          {/* Subtitle */}
          <p
            className="max-w-xl mx-auto text-lg leading-relaxed mb-10"
            style={{
              color: "rgba(232,218,198,0.88)",
              textShadow: "0 1px 8px rgba(0,0,0,0.6)",
            }}
          >
            Wisdom from history's greatest minds.
            Move your mouse to explore. Scroll to begin.
          </p>

          {/* CTA buttons */}
          <div className="flex items-center gap-4 justify-center flex-wrap">
            <a
              href="#explore"
              className="px-7 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(12px)",
                color: "white",
                boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
              }}
            >
              Explore Quotes
            </a>
            <a
              href="#explore"
              className="px-7 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(212,176,148,0.25)",
                border: "1px solid rgba(212,176,148,0.4)",
                backdropFilter: "blur(12px)",
                color: "#f0ddd0",
              }}
            >
              Today's Quote ✦
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: Math.max(0, 1 - scrollY / 150) }}
        >
          <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "rgba(220,198,170,0.65)" }}>
            Scroll
          </span>
          <div className="w-px h-10 relative overflow-hidden" style={{ background: "rgba(220,198,170,0.25)" }}>
            <div
              className="absolute top-0 left-0 w-full"
              style={{
                height: "40%",
                background: "rgba(220,198,170,0.8)",
                animation: "scrollDot 1.6s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </section>

      {/* ── CONTENT SECTION: slides up over the mountain ── */}
      <section
        id="explore"
        className="relative z-20"
        style={{
          background: "#f4f1ea",
          borderRadius: "2rem 2rem 0 0",
          marginTop: "-6rem",
          paddingTop: "5rem",
          paddingBottom: "6rem",
          boxShadow: "0 -20px 60px rgba(0,0,0,0.35)",
        }}
      >
        {/* Subtle top highlight line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: "40%", height: "1px", background: "#d6cfc1" }}
        />

        <div className="px-4 max-w-6xl mx-auto space-y-12">
          {/* Browse cards */}
          <div>
            <SectionLabel>Explore the Vault</SectionLabel>
            <BrowseCards exploredCount={exploredCount} />
          </div>

          {/* Daily Quote */}
          <div>
            <SectionLabel>Today's Wisdom</SectionLabel>
            <QuoteOfDay onDeepDive={onDeepDive} />
          </div>
        </div>
      </section>

      {/* Scroll-dot keyframe (injected inline) */}
      <style>{`
        @keyframes scrollDot {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(250%); opacity: 0; }
        }
      `}</style>
    </>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="h-px flex-1" style={{ background: "#d6cfc1" }} />
      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#6b6358", letterSpacing: "0.18em" }}>{children}</span>
      <div className="h-px flex-1" style={{ background: "#d6cfc1" }} />
    </div>
  );
}
