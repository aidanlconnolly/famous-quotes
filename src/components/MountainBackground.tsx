import { useEffect, useRef } from "react";

// Each layer has a parallax multiplier.
// Higher = moves more with the mouse (feels closer to camera).
const LAYERS = [
  { id: "sky",         speedX: 0.0,  speedY: 0.0  },
  { id: "stars",       speedX: 0.01, speedY: 0.01 },
  { id: "moon",        speedX: 0.02, speedY: 0.015 },
  { id: "clouds-far",  speedX: 0.04, speedY: 0.02 },
  { id: "mtns-far",    speedX: 0.05, speedY: 0.03 },
  { id: "clouds-mid",  speedX: 0.09, speedY: 0.04 },
  { id: "mtns-mid",    speedX: 0.10, speedY: 0.05 },
  { id: "mtns-main",   speedX: 0.14, speedY: 0.07 },
  { id: "clouds-near", speedX: 0.18, speedY: 0.08 },
  { id: "mtns-near",   speedX: 0.20, speedY: 0.09 },
  { id: "trees",       speedX: 0.26, speedY: 0.10 },
  { id: "mist",        speedX: 0.05, speedY: 0.02 },
];

export default function MountainBackground() {
  const svgRef = useRef<SVGSVGElement>(null);
  // Current and target mouse positions (normalised -0.5 → 0.5)
  const mouse   = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const rafRef  = useRef<number>(0);
  const cloudOffset = useRef(0);
  const lastTime = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth)  - 0.5;
      mouse.current.y = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = (now: number) => {
      const dt = Math.min(now - (lastTime.current || now), 50); // cap at 50ms
      lastTime.current = now;

      // Lerp current position toward mouse (smoothing factor)
      const lerp = 1 - Math.pow(0.04, dt / 16);
      current.current.x += (mouse.current.x - current.current.x) * lerp;
      current.current.y += (mouse.current.y - current.current.y) * lerp;

      // Animate cloud drift
      cloudOffset.current += dt * 0.004;

      const svg = svgRef.current;
      if (svg) {
        const { x, y } = current.current;
        // Move each named group
        LAYERS.forEach(({ id, speedX, speedY }) => {
          const el = svg.getElementById(id);
          if (el) {
            const tx = x * speedX * 120;
            const ty = y * speedY * 60;
            el.setAttribute("transform", `translate(${tx}, ${ty})`);
          }
        });

        // Animate clouds separately
        ["clouds-far", "clouds-mid", "clouds-near"].forEach((id, ci) => {
          const el = svg.getElementById(id);
          if (el) {
            const speed = LAYERS.find((l) => l.id === id)!;
            const drift = cloudOffset.current * (0.3 + ci * 0.2);
            const tx = (x * speed.speedX * 120) + drift;
            const ty = y * speed.speedY * 60;
            el.setAttribute("transform", `translate(${tx}, ${ty})`);
          }
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    >
      <defs>
        {/* ── Sky gradient: deep twilight with alpenglow ── */}
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#1a2a44" />
          <stop offset="28%"  stopColor="#2d4a6e" />
          <stop offset="55%"  stopColor="#8a9eb8" />
          <stop offset="75%"  stopColor="#c4a898" />
          <stop offset="88%"  stopColor="#c48878" />
          <stop offset="100%" stopColor="#b07060" />
        </linearGradient>

        {/* Snow gradients */}
        <linearGradient id="snowA" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%"   stopColor="#f2f6fa" />
          <stop offset="60%"  stopColor="#dce8f4" />
          <stop offset="100%" stopColor="#b8cfe0" />
        </linearGradient>
        <linearGradient id="snowB" x1="0" y1="0" x2="0.5" y2="1">
          <stop offset="0%"   stopColor="#eef4fa" />
          <stop offset="100%" stopColor="#c8daea" />
        </linearGradient>

        {/* Mist gradient at mountain bases */}
        <linearGradient id="mistGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#8aa8c0" stopOpacity="0" />
          <stop offset="60%"  stopColor="#8aa8c0" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#6a90a8" stopOpacity="0.38" />
        </linearGradient>

        {/* Bottom fade to site background color */}
        <linearGradient id="fadeOut" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#f4f1ea" stopOpacity="0" />
          <stop offset="100%" stopColor="#f4f1ea" stopOpacity="1" />
        </linearGradient>

        {/* Vignette */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor="transparent" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>

        {/* Moon glow */}
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#e8f0f8" stopOpacity="0.8" />
          <stop offset="50%"  stopColor="#d0dff0" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#c0d0e8" stopOpacity="0" />
        </radialGradient>

        {/* Cloud softness */}
        <filter id="cloudBlur">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ══════════════ SKY ══════════════ */}
      <g id="sky">
        <rect x="-100" y="-100" width="1640" height="1100" fill="url(#skyGrad)" />
      </g>

      {/* ══════════════ STARS ══════════════ */}
      <g id="stars" opacity="0.7">
        {[
          [120,55],[240,30],[380,80],[510,20],[640,65],[760,40],
          [900,25],[1050,55],[1180,35],[1320,70],[80,110],[300,90],
          [440,130],[600,100],[750,120],[880,90],[1020,115],[1160,80],
          [1380,50],[1420,95],[160,160],[490,170],[810,155],[1100,165],
          [200,40],[850,30],[1250,45],[700,15],[400,50],[1050,20],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={i % 5 === 0 ? 1.8 : i % 3 === 0 ? 1.3 : 0.9}
            fill="white"
            opacity={0.4 + (i % 4) * 0.15}
          />
        ))}
      </g>

      {/* ══════════════ MOON ══════════════ */}
      <g id="moon">
        {/* Glow halo */}
        <circle cx="1180" cy="110" r="80" fill="url(#moonGlow)" />
        {/* Moon body */}
        <circle cx="1180" cy="110" r="44" fill="#dce8f4" opacity="0.92" />
        {/* Shadow crescent */}
        <circle cx="1196" cy="104" r="38" fill="#9ab5cc" opacity="0.55" />
        {/* Surface texture */}
        <circle cx="1166" cy="102" r="5"  fill="#c8d8e8" opacity="0.3" />
        <circle cx="1188" cy="122" r="3"  fill="#c8d8e8" opacity="0.25" />
        <circle cx="1173" cy="118" r="2"  fill="#c8d8e8" opacity="0.2" />
      </g>

      {/* ══════════════ FAR CLOUDS ══════════════ */}
      <g id="clouds-far" opacity="0.5">
        {/* Soft cloud shapes using overlapping ellipses */}
        <g filter="url(#cloudBlur)">
          <ellipse cx="180"  cy="130" rx="120" ry="28" fill="white" opacity="0.6" />
          <ellipse cx="220"  cy="118" rx="80"  ry="22" fill="white" opacity="0.5" />
          <ellipse cx="150"  cy="122" rx="60"  ry="18" fill="white" opacity="0.45" />

          <ellipse cx="680"  cy="100" rx="140" ry="30" fill="white" opacity="0.55" />
          <ellipse cx="720"  cy="88"  rx="90"  ry="22" fill="white" opacity="0.5" />
          <ellipse cx="650"  cy="95"  rx="70"  ry="18" fill="white" opacity="0.45" />

          <ellipse cx="1050" cy="120" rx="100" ry="26" fill="white" opacity="0.5" />
          <ellipse cx="1090" cy="108" rx="70"  ry="20" fill="white" opacity="0.45" />

          <ellipse cx="1400" cy="90"  rx="120" ry="28" fill="white" opacity="0.5" />
          <ellipse cx="1440" cy="80"  rx="80"  ry="20" fill="white" opacity="0.45" />
        </g>
      </g>

      {/* ══════════════ FAR MOUNTAINS (barely visible) ══════════════ */}
      <g id="mtns-far" opacity="0.35">
        <path
          d="M-100,600 L80,380 L200,430 L340,340 L480,400 L600,310 L740,375 L880,295 L1020,360 L1160,280 L1300,350 L1440,290 L1580,360 L1640,600 Z"
          fill="#7a9ab5"
        />
      </g>

      {/* ══════════════ MID CLOUDS ══════════════ */}
      <g id="clouds-mid" opacity="0.65">
        <g filter="url(#cloudBlur)">
          <ellipse cx="340"  cy="310" rx="130" ry="32" fill="white" opacity="0.55" />
          <ellipse cx="390"  cy="295" rx="90"  ry="24" fill="white" opacity="0.5" />
          <ellipse cx="310"  cy="305" rx="65"  ry="20" fill="white" opacity="0.45" />

          <ellipse cx="820"  cy="280" rx="150" ry="35" fill="white" opacity="0.6" />
          <ellipse cx="870"  cy="265" rx="100" ry="26" fill="white" opacity="0.55" />
          <ellipse cx="790"  cy="275" rx="75"  ry="22" fill="white" opacity="0.5" />

          <ellipse cx="1260" cy="300" rx="120" ry="30" fill="white" opacity="0.55" />
          <ellipse cx="1300" cy="285" rx="85"  ry="22" fill="white" opacity="0.5" />
        </g>
      </g>

      {/* ══════════════ MID MOUNTAINS ══════════════ */}
      <g id="mtns-mid" opacity="0.6">
        <path
          d="M-100,640 L60,480 L160,510 L280,420 L400,470 L500,380 L620,440 L740,355 L860,415 L980,330 L1100,390 L1220,320 L1340,385 L1460,315 L1560,375 L1640,640 Z"
          fill="#5a7d98"
        />
        {/* Snow caps on mid range */}
        {[
          "M500,380 L530,405 L475,408 Z",
          "M740,355 L775,385 L718,388 Z",
          "M980,330 L1020,365 L950,368 Z",
          "M1220,320 L1258,352 L1188,355 Z",
        ].map((d, i) => (
          <path key={i} d={d} fill="url(#snowB)" opacity="0.65" />
        ))}
      </g>

      {/* ══════════════ THREE MAIN PEAKS ══════════════ */}
      <g id="mtns-main">

        {/* ── LEFT PEAK (x≈320) ── */}
        <path
          d="M-60,780 L80,620 L170,655 L260,575 L320,480 L390,570 L460,545 L540,590 L640,630 L700,665 L740,780 Z"
          fill="#3a5570"
        />
        {/* Shadow face */}
        <path
          d="M320,480 L390,570 L460,545 L430,590 L375,605 L340,578 Z"
          fill="#1e3348"
          opacity="0.55"
        />
        {/* Snow cap */}
        <path
          d="M260,575 L320,480 L390,570 L368,582 L345,562 L316,578 L290,584 Z"
          fill="url(#snowA)"
        />
        {/* Snow runoff streaks */}
        <path d="M285,588 L270,615 L275,640" stroke="#ddeaf6" strokeWidth="2"   fill="none" opacity="0.5" />
        <path d="M365,582 L378,610 L373,638" stroke="#ddeaf6" strokeWidth="2"   fill="none" opacity="0.5" />
        <path d="M320,580 L315,618"           stroke="#ddeaf6" strokeWidth="1.5" fill="none" opacity="0.35" />

        {/* ── CENTRE PEAK — tallest (x≈720) ── */}
        <path
          d="M480,780 L600,655 L670,680 L740,600 L800,525 L720,468 L780,530 L820,555 L870,590 L950,635 L1020,660 L1060,700 L1100,780 Z"
          fill="#2e4a62"
        />
        {/* Shadow face */}
        <path
          d="M720,468 L780,530 L820,555 L800,580 L764,560 L738,520 Z"
          fill="#172838"
          opacity="0.6"
        />
        {/* Snow cap */}
        <path
          d="M740,600 L800,525 L720,468 L680,510 L700,540 L720,565 L700,578 L670,590 Z"
          fill="url(#snowA)"
        />
        {/* Snow runoffs */}
        <path d="M673,592 L655,630 L660,665" stroke="#ddeaf6" strokeWidth="2.5" fill="none" opacity="0.55" />
        <path d="M738,580 L730,622 L735,655" stroke="#ddeaf6" strokeWidth="2"   fill="none" opacity="0.45" />
        <path d="M700,580 L695,628"           stroke="#ddeaf6" strokeWidth="1.5" fill="none" opacity="0.35" />
        <path d="M800,535 L818,575 L812,610" stroke="#ddeaf6" strokeWidth="2"   fill="none" opacity="0.45" />

        {/* ── RIGHT PEAK (x≈1120) ── */}
        <path
          d="M900,780 L1010,660 L1075,685 L1140,605 L1120,520 L1180,570 L1240,540 L1300,575 L1380,620 L1440,660 L1540,780 Z"
          fill="#344f68"
        />
        {/* Shadow face */}
        <path
          d="M1120,520 L1180,570 L1240,540 L1218,578 L1175,590 L1148,558 Z"
          fill="#1a2f42"
          opacity="0.55"
        />
        {/* Snow cap */}
        <path
          d="M1075,685 L1140,605 L1120,520 L1076,555 L1090,580 L1110,600 L1095,618 L1068,628 Z"
          fill="url(#snowA)"
        />
        {/* Snow runoffs */}
        <path d="M1070,630 L1055,665 L1060,692" stroke="#ddeaf6" strokeWidth="2"   fill="none" opacity="0.5" />
        <path d="M1110,605 L1122,640 L1117,668" stroke="#ddeaf6" strokeWidth="2"   fill="none" opacity="0.45" />
      </g>

      {/* ══════════════ NEAR CLOUDS ══════════════ */}
      <g id="clouds-near" opacity="0.42">
        <g filter="url(#cloudBlur)">
          <ellipse cx="140"  cy="500" rx="100" ry="24" fill="white" opacity="0.4" />
          <ellipse cx="175"  cy="488" rx="70"  ry="18" fill="white" opacity="0.35" />
          <ellipse cx="580"  cy="470" rx="120" ry="28" fill="white" opacity="0.4" />
          <ellipse cx="618"  cy="458" rx="85"  ry="20" fill="white" opacity="0.35" />
          <ellipse cx="1050" cy="490" rx="110" ry="26" fill="white" opacity="0.38" />
          <ellipse cx="1088" cy="478" rx="75"  ry="19" fill="white" opacity="0.33" />
          <ellipse cx="1380" cy="505" rx="95"  ry="22" fill="white" opacity="0.36" />
        </g>
      </g>

      {/* ══════════════ NEAR MOUNTAINS (foreground ridge) ══════════════ */}
      <g id="mtns-near">
        <path
          d="M-100,820 L0,730 L80,748 L160,715 L240,735 L320,705 L400,722 L480,695 L560,714 L640,688 L720,705 L800,680 L880,698 L960,672 L1040,690 L1120,665 L1200,682 L1280,658 L1360,674 L1440,650 L1520,668 L1640,820 Z"
          fill="#1e3040"
          opacity="0.95"
        />
      </g>

      {/* ══════════════ PINE TREES ══════════════ */}
      <g id="trees">
        {[
          // x, baseY, heightFactor
          [30,  748, 1.0], [72,  740, 1.2], [115, 755, 0.9],
          [158, 735, 1.1], [200, 748, 1.0], [245, 718, 1.3],
          [290, 735, 1.1], [335, 705, 1.4], [378, 722, 1.0],
          [422, 712, 1.2], [468, 698, 1.3], [512, 714, 1.1],
          [558, 705, 1.2], [602, 690, 1.4], [648, 708, 1.0],
          [694, 688, 1.3], [740, 705, 1.1], [786, 682, 1.4],
          [832, 698, 1.0], [878, 672, 1.5], [924, 690, 1.1],
          [970, 665, 1.3], [1016,682, 1.0], [1062,658, 1.4],
          [1108,675, 1.2], [1154,650, 1.5], [1200,668, 1.0],
          [1246,655, 1.3], [1292,672, 1.1], [1338,648, 1.4],
          [1384,665, 1.0], [1430,645, 1.3], [1476,662, 1.1],
          [1520,655, 1.0],
        ].map(([x, by, hf], i) => {
          const h = (28 + (i % 5) * 8) * hf;
          const w = h * 0.55;
          return (
            <g key={i}>
              {/* Trunk */}
              <rect x={x - 2} y={by} width={4} height={h * 0.28} fill="#0d1a22" />
              {/* Three tiers */}
              <polygon points={`${x},${by - h} ${x - w*0.52},${by - h*0.22} ${x + w*0.52},${by - h*0.22}`} fill="#0f1e2c" />
              <polygon points={`${x},${by - h*0.68} ${x - w*0.46},${by - h*0.05} ${x + w*0.46},${by - h*0.05}`} fill="#142330" />
              <polygon points={`${x},${by - h*0.38} ${x - w*0.40},${by + h*0.12} ${x + w*0.40},${by + h*0.12}`} fill="#182835" />
              {/* Snow on tree tops */}
              <path d={`M${x - w*0.18},${by - h*0.85} Q${x},${by - h - 4} ${x + w*0.18},${by - h*0.85}`}
                fill="#ddeaf6" opacity="0.55" />
            </g>
          );
        })}
      </g>

      {/* ══════════════ MIST OVERLAY ══════════════ */}
      <g id="mist">
        <rect x="-100" y="580" width="1640" height="320" fill="url(#mistGrad)" />
      </g>

      {/* ══════════════ VIGNETTE ══════════════ */}
      <rect x="-100" y="-100" width="1640" height="1100" fill="url(#vignette)" />

      {/* ══════════════ BOTTOM FADE (blends into site bg) ══════════════ */}
      <rect x="-100" y="640" width="1640" height="360" fill="url(#fadeOut)" />
    </svg>
  );
}
