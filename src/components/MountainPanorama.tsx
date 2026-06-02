import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const PEAKS = [
  {
    id: "eras",
    label: "By Era",
    sublabel: "Journey through time",
    icon: "🏛️",
    href: "/eras",
    cx: 420,   // SVG x centre of this peak's summit label
  },
  {
    id: "themes",
    label: "By Theme",
    sublabel: "Find what you need",
    icon: "✨",
    href: "/themes",
    cx: 960,
  },
  {
    id: "authors",
    label: "By Author",
    sublabel: "Explore each mind",
    icon: "👤",
    href: "/authors",
    cx: 1500,
  },
];

export default function MountainPanorama() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollX, setScrollX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [activePeak, setActivePeak] = useState(1); // 0=eras, 1=themes, 2=authors
  const [hovered, setHovered] = useState<number | null>(null);

  // Total SVG width (wider than viewport for scrolling)
  const SVG_W = 1920;
  const SVG_H = 420;
  // Viewport display width — use container width
  const [viewW, setViewW] = useState(1200);

  useEffect(() => {
    const obs = new ResizeObserver((entries) => {
      setViewW(entries[0].contentRect.width);
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Clamp scrollX so we don't over-scroll
  const maxScroll = SVG_W - viewW;
  const clamp = (v: number) => Math.max(0, Math.min(maxScroll, v));

  // Snap to peak on click of dot indicator
  const snapTo = useCallback(
    (idx: number) => {
      setActivePeak(idx);
      const targetX = clamp(PEAKS[idx].cx - viewW / 2);
      setScrollX(targetX);
    },
    [viewW, maxScroll] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Snap to peak 1 (centre) on first render
  useEffect(() => {
    snapTo(1);
  }, [viewW]); // eslint-disable-line react-hooks/exhaustive-deps

  // Pointer drag handlers
  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    setDragStart(e.clientX + scrollX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setScrollX(clamp(dragStart - e.clientX));
  };
  const onPointerUp = () => {
    setDragging(false);
    // Snap to nearest peak after drag
    const nearest = PEAKS.reduce((best, p, i) => {
      const dist = Math.abs(scrollX - clamp(p.cx - viewW / 2));
      const bestDist = Math.abs(scrollX - clamp(PEAKS[best].cx - viewW / 2));
      return dist < bestDist ? i : best;
    }, 0);
    snapTo(nearest);
    setActivePeak(nearest);
  };

  // Cloud x offset animation
  const [cloudOffset, setCloudOffset] = useState(0);
  useEffect(() => {
    let frame: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setCloudOffset((o) => (o + dt * 0.006) % SVG_W);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const viewBox = `${scrollX} 0 ${viewW} ${SVG_H}`;

  return (
    <div className="relative select-none" ref={containerRef}>
      {/* ── SVG Panorama ── */}
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{ cursor: dragging ? "grabbing" : "grab", height: SVG_H }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <svg
          width="100%"
          height={SVG_H}
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
          style={{ display: "block" }}
        >
          <defs>
            {/* Sky gradient — pale pink horizon → dusty blue top (matching photo) */}
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#b8cce4" />
              <stop offset="45%" stopColor="#c9d8e8" />
              <stop offset="75%" stopColor="#ddb8aa" />
              <stop offset="100%" stopColor="#c8967a" />
            </linearGradient>

            {/* Snow gradient for peaks */}
            <linearGradient id="snow1" x1="0" y1="0" x2="0.3" y2="1">
              <stop offset="0%" stopColor="#f0f4f8" />
              <stop offset="100%" stopColor="#cdd9e5" />
            </linearGradient>
            <linearGradient id="snow2" x1="0" y1="0" x2="0.2" y2="1">
              <stop offset="0%" stopColor="#eef2f7" />
              <stop offset="100%" stopColor="#b8c8d8" />
            </linearGradient>

            {/* Mist gradient at base of mountains */}
            <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c5d5e5" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#d0dce8" stopOpacity="0.55" />
            </linearGradient>

            {/* Glow for active peak label */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#00000055" />
            </filter>
          </defs>

          {/* ── Sky ── */}
          <rect x="0" y="0" width={SVG_W} height={SVG_H} fill="url(#sky)" />

          {/* ── Moon ── */}
          <circle cx={SVG_W - 280} cy={60} r={38} fill="#e8edf2" opacity="0.88" />
          <circle cx={SVG_W - 258} cy={52} r={34} fill="#c8d4e0" opacity="0.5" />

          {/* ── Clouds (animated, loop) ── */}
          {[
            { y: 55, w: 200, h: 28, baseX: 80 },
            { y: 40, w: 140, h: 20, baseX: 350 },
            { y: 70, w: 170, h: 22, baseX: 700 },
            { y: 48, w: 220, h: 30, baseX: 1050 },
            { y: 60, w: 130, h: 18, baseX: 1380 },
            { y: 38, w: 180, h: 26, baseX: 1620 },
          ].map((c, i) => {
            const x = ((c.baseX + cloudOffset * (0.4 + i * 0.05)) % (SVG_W + c.w)) - c.w / 2;
            return (
              <ellipse
                key={i}
                cx={x}
                cy={c.y}
                rx={c.w / 2}
                ry={c.h / 2}
                fill="white"
                opacity={0.55 + (i % 3) * 0.1}
              />
            );
          })}

          {/* ── Far background mountains (very faint, blue-grey) ── */}
          <path
            d="M-100,320 L100,180 L250,230 L400,140 L600,200 L800,130 L1000,195 L1200,145 L1400,200 L1600,155 L1800,210 L1920,175 L2020,320 Z"
            fill="#8fa8c0"
            opacity="0.28"
          />

          {/* ── Mid-distance mountains (blue-grey, snowy tops) ── */}
          <path
            d="M-100,340 L50,240 L180,270 L320,195 L460,250 L560,180 L680,240 L800,170 L920,230 L1060,160 L1200,220 L1320,175 L1460,235 L1600,185 L1740,240 L1860,195 L1980,280 L2020,340 Z"
            fill="#6e8fa8"
            opacity="0.45"
          />
          {/* Snow caps on mid-range */}
          <path
            d="M560,180 L590,205 L540,210 Z"
            fill="url(#snow2)"
            opacity="0.6"
          />
          <path
            d="M800,170 L835,198 L778,200 Z"
            fill="url(#snow2)"
            opacity="0.6"
          />
          <path
            d="M1060,160 L1100,192 L1030,195 Z"
            fill="url(#snow2)"
            opacity="0.6"
          />
          <path
            d="M1320,175 L1358,205 L1288,207 Z"
            fill="url(#snow2)"
            opacity="0.6"
          />

          {/* ══════════════════════════════════════
              THREE MAIN PEAKS — Era / Theme / Author
              ══════════════════════════════════════ */}

          {/* ── PEAK 1 — By Era (left) x≈420 ── */}
          {/* Rock body */}
          <path
            d="M100,420 L200,310 L280,335 L360,260 L420,175 L480,255 L550,230 L620,285 L700,310 L760,350 L800,420 Z"
            fill="#4a6278"
          />
          {/* Shadow face */}
          <path
            d="M420,175 L480,255 L550,230 L500,285 L430,300 L390,270 Z"
            fill="#2e4456"
            opacity="0.5"
          />
          {/* Snow cap */}
          <path
            d="M360,260 L420,175 L480,255 L455,268 L430,252 L400,272 Z"
            fill="url(#snow1)"
          />
          {/* Snow detail streaks */}
          <path d="M380,268 L365,290 L370,300" stroke="#dde8f0" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M455,268 L468,290 L462,308" stroke="#dde8f0" strokeWidth="2" fill="none" opacity="0.6" />

          {/* ── PEAK 2 — By Theme (centre, tallest) x≈960 ── */}
          <path
            d="M660,420 L760,340 L820,360 L880,295 L940,240 L960,165 L990,235 L1040,275 L1100,300 L1160,330 L1220,355 L1260,420 Z"
            fill="#3d5870"
          />
          {/* Shadow face */}
          <path
            d="M960,165 L990,235 L1040,275 L1010,295 L975,278 L950,245 Z"
            fill="#253d52"
            opacity="0.55"
          />
          {/* Snow cap */}
          <path
            d="M880,295 L940,240 L960,165 L990,235 L1040,275 L1020,285 L990,265 L960,248 L935,268 L900,290 Z"
            fill="url(#snow1)"
          />
          {/* Snow streaks */}
          <path d="M900,292 L885,320 L890,340" stroke="#dde8f0" strokeWidth="2.5" fill="none" opacity="0.65" />
          <path d="M1020,288 L1038,318 L1030,342" stroke="#dde8f0" strokeWidth="2.5" fill="none" opacity="0.65" />
          <path d="M960,250 L955,290" stroke="#dde8f0" strokeWidth="1.5" fill="none" opacity="0.4" />

          {/* ── PEAK 3 — By Author (right) x≈1500 ── */}
          <path
            d="M1120,420 L1240,345 L1300,365 L1380,295 L1440,250 L1500,190 L1555,248 L1610,290 L1660,315 L1740,350 L1820,420 Z"
            fill="#445e74"
          />
          {/* Shadow face */}
          <path
            d="M1500,190 L1555,248 L1610,290 L1575,305 L1535,285 L1510,255 Z"
            fill="#2a3e52"
            opacity="0.5"
          />
          {/* Snow cap */}
          <path
            d="M1380,295 L1440,250 L1500,190 L1555,248 L1610,290 L1585,302 L1555,282 L1520,262 L1490,278 L1450,268 L1410,292 Z"
            fill="url(#snow1)"
          />
          {/* Snow streaks */}
          <path d="M1415,295 L1400,325 L1405,348" stroke="#dde8f0" strokeWidth="2" fill="none" opacity="0.6" />
          <path d="M1585,305 L1600,335 L1594,355" stroke="#dde8f0" strokeWidth="2" fill="none" opacity="0.6" />

          {/* ── Foreground ridge (dark, pine tree silhouettes) ── */}
          <path
            d="M-100,420 L0,370 L60,375 L120,355 L180,370 L240,348 L300,360 L360,340 L420,355 L480,335 L540,350 L600,330 L660,345 L720,325 L780,340 L840,320 L900,338 L960,318 L1020,334 L1080,315 L1140,330 L1200,312 L1260,328 L1320,310 L1380,325 L1440,308 L1500,322 L1560,305 L1620,320 L1680,302 L1740,318 L1800,300 L1860,315 L1920,360 L2020,420 Z"
            fill="#1e2e3a"
            opacity="0.95"
          />

          {/* Pine tree silhouettes on foreground ridge */}
          {[40, 80, 130, 175, 220, 280, 340, 390, 450, 510, 575, 640, 710, 780, 845, 920, 990, 1060, 1130, 1200, 1270, 1340, 1415, 1485, 1555, 1625, 1700, 1770, 1840, 1900].map((x, i) => {
            const h = 22 + (i % 4) * 6;
            const baseY = 370 + (i % 3) * 8;
            return (
              <g key={x}>
                {/* trunk */}
                <line x1={x} y1={baseY} x2={x} y2={baseY + 8} stroke="#131e27" strokeWidth="2" />
                {/* tree tiers */}
                <polygon points={`${x},${baseY - h} ${x - h * 0.45},${baseY} ${x + h * 0.45},${baseY}`} fill="#151f2a" />
                <polygon points={`${x},${baseY - h * 0.65} ${x - h * 0.38},${baseY - h * 0.12} ${x + h * 0.38},${baseY - h * 0.12}`} fill="#1a2633" />
              </g>
            );
          })}

          {/* ── Mist overlay at mountain base ── */}
          <rect x="0" y="280" width={SVG_W} height={140} fill="url(#mist)" />

          {/* ══════════════════════════════════════
              PEAK LABELS (clickable hit-areas)
              ══════════════════════════════════════ */}
          {PEAKS.map((peak, i) => {
            const isActive = activePeak === i;
            const isHov = hovered === i;
            return (
              <g
                key={peak.id}
                style={{ cursor: "pointer" }}
                onPointerEnter={() => setHovered(i)}
                onPointerLeave={() => setHovered(null)}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                  setActivePeak(i);
                  navigate(peak.href);
                }}
              >
                {/* Invisible hit area */}
                <rect
                  x={peak.cx - 80}
                  y={100}
                  width={160}
                  height={140}
                  fill="transparent"
                />
                {/* Glow ring on active */}
                {(isActive || isHov) && (
                  <circle
                    cx={peak.cx}
                    cy={i === 1 ? 165 : i === 0 ? 175 : 190}
                    r={isHov ? 14 : 10}
                    fill="white"
                    opacity={isActive ? 0.35 : 0.2}
                    filter="url(#glow)"
                  />
                )}
                {/* Summit dot */}
                <circle
                  cx={peak.cx}
                  cy={i === 1 ? 165 : i === 0 ? 175 : 190}
                  r={isActive ? 6 : 4}
                  fill={isActive ? "#fff" : "#c8dae8"}
                  opacity={isActive ? 0.95 : 0.7}
                />
                {/* Label pill */}
                <g filter={isActive ? "url(#shadow)" : undefined} opacity={isActive || isHov ? 1 : 0.55}>
                  <rect
                    x={peak.cx - 64}
                    y={i === 1 ? 128 : i === 0 ? 138 : 150}
                    width={128}
                    height={32}
                    rx={16}
                    fill={isActive ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)"}
                    stroke={isActive ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.2)"}
                    strokeWidth={1}
                  />
                  <text
                    x={peak.cx}
                    y={i === 1 ? 149 : i === 0 ? 159 : 171}
                    textAnchor="middle"
                    fill="white"
                    fontSize={isActive ? 13 : 12}
                    fontWeight={isActive ? "700" : "500"}
                    fontFamily="system-ui, sans-serif"
                    style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
                  >
                    {peak.icon} {peak.label}
                  </text>
                </g>
              </g>
            );
          })}

          {/* ── Drag hint ── */}
          <text
            x={scrollX + viewW / 2}
            y={SVG_H - 14}
            textAnchor="middle"
            fill="white"
            fontSize={11}
            opacity={0.35}
            fontFamily="system-ui, sans-serif"
          >
            drag to explore ← →
          </text>
        </svg>
      </div>

      {/* ── Peak dot navigator ── */}
      <div className="flex items-center justify-center gap-4 mt-4">
        {PEAKS.map((peak, i) => (
          <button
            key={peak.id}
            onClick={() => snapTo(i)}
            className="flex flex-col items-center gap-1.5 group"
          >
            <div
              className="transition-all duration-300"
              style={{
                width: activePeak === i ? 32 : 8,
                height: 8,
                borderRadius: 4,
                background: activePeak === i ? "#94a3b8" : "#334155",
              }}
            />
            <span
              className="text-xs font-medium transition-colors duration-200"
              style={{ color: activePeak === i ? "#e2e8f0" : "#475569" }}
            >
              {peak.icon} {peak.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
