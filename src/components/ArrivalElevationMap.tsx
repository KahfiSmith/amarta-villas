"use client";

import { motion } from "motion/react";
import { Mountain } from "lucide-react";

interface ArrivalElevationMapProps {
  activeStepIndex: number;
  onSelectStep: (idx: number) => void;
}

interface WaypointData {
  step: string;
  name: string;
  elevationMeters: number;
  aslLabel: string;
  gradientStop: string;
  zone: string;
  svgX: number;
  svgY: number;
}

const WAYPOINTS: WaypointData[] = [
  {
    step: "01",
    name: "Sayan Ridge Descent",
    elevationMeters: 265,
    aslLabel: "265m ASL",
    gradientStop: "Upper Limestone Ridge",
    zone: "Highland Canopy & Bamboo Forest",
    svgX: 60,
    svgY: 55,
  },
  {
    step: "02",
    name: "Travertine Pavilion",
    elevationMeters: 240,
    aslLabel: "240m ASL",
    gradientStop: "Mid-Slope Terrace",
    zone: "Arrival Portico & Water Court",
    svgX: 240,
    svgY: 135,
  },
  {
    step: "03",
    name: "Ayung River Sanctuary",
    elevationMeters: 212,
    aslLabel: "212m ASL",
    gradientStop: "Valley Floor Basin",
    zone: "Riverbank Grotto & Mineral Springs",
    svgX: 420,
    svgY: 205,
  },
];

export default function ArrivalElevationMap({
  activeStepIndex,
  onSelectStep,
}: ArrivalElevationMapProps) {
  const currentWaypoint = WAYPOINTS[activeStepIndex] || WAYPOINTS[0];

  return (
    <div className="relative border border-[#E2DDD3] bg-[#151412] text-[#F7F4EE] overflow-hidden select-none">
      <div className="p-3.5 border-b border-white/10 flex items-center justify-between gap-3 bg-[#181614]/90">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C57D65] animate-pulse" />
          <span className="text-[9px] tracking-[0.24em] uppercase text-[#C57D65] font-mono">
            Sayan Ridge Elevation Cross-Section
          </span>
        </div>
        <div className="flex items-center gap-2 text-[9px] tracking-[0.18em] uppercase text-[#E2DDD3]">
          <Mountain className="w-3.5 h-3.5 text-[#C57D65]" />
          <span>265m &rarr; 212m ASL Descent</span>
        </div>
      </div>

      <div className="relative aspect-[16/9] w-full p-4 flex items-center justify-center">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C57D65_1px,transparent_1px)] [background-size:16px_16px]" />

        <svg
          viewBox="0 0 480 250"
          className="w-full h-full overflow-visible relative z-10"
        >
          <defs>
            <linearGradient id="ridgeSlopeFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C57D65" stopOpacity="0.28" />
              <stop offset="50%" stopColor="#8D4A33" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#3D4838" stopOpacity="0.25" />
            </linearGradient>

            <linearGradient id="ridgePathStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E2DDD3" />
              <stop offset="50%" stopColor="#C57D65" />
              <stop offset="100%" stopColor="#7AB3A8" />
            </linearGradient>
          </defs>

          {[
            { y: 55, label: "265m Upper Crest" },
            { y: 135, label: "240m Mid Terrace" },
            { y: 205, label: "212m Riverbed" },
          ].map((line, i) => (
            <g key={i}>
              <line
                x1="20"
                y1={line.y}
                x2="460"
                y2={line.y}
                stroke="#F7F4EE"
                strokeOpacity="0.08"
                strokeDasharray="3 3"
              />
              <text
                x="455"
                y={line.y - 4}
                textAnchor="end"
                className="fill-[#8A847A] text-[7.5px] font-mono tracking-widest uppercase"
              >
                {line.label}
              </text>
            </g>
          ))}

          <path
            d="M 20 50 Q 140 65 240 135 T 460 215 L 460 245 L 20 245 Z"
            fill="url(#ridgeSlopeFill)"
          />

          <path
            d="M 20 50 Q 140 65 240 135 T 460 215"
            fill="none"
            stroke="url(#ridgePathStroke)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="M 20 85 Q 150 98 250 162 T 460 235"
            fill="none"
            stroke="#8D4A33"
            strokeOpacity="0.3"
            strokeWidth="1"
            strokeDasharray="4 4"
          />

          <path
            d="M 370 218 Q 410 212 460 216"
            fill="none"
            stroke="#7AB3A8"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeOpacity="0.75"
          />
          <text
            x="415"
            y="232"
            textAnchor="middle"
            className="fill-[#7AB3A8] text-[7px] font-mono tracking-[0.2em] uppercase"
          >
            Ayung River
          </text>

          {WAYPOINTS.map((wp, idx) => {
            const isSelected = idx === activeStepIndex;
            return (
              <g
                key={wp.step}
                onClick={() => onSelectStep(idx)}
                className="cursor-pointer group"
              >
                <line
                  x1={wp.svgX}
                  y1={wp.svgY}
                  x2={wp.svgX}
                  y2={245}
                  stroke={isSelected ? "#C57D65" : "#F7F4EE"}
                  strokeOpacity={isSelected ? 0.45 : 0.12}
                  strokeDasharray="2 2"
                />

                {isSelected && (
                  <motion.circle
                    cx={wp.svgX}
                    cy={wp.svgY}
                    r="12"
                    fill="none"
                    stroke="#C57D65"
                    strokeWidth="1.5"
                    initial={{ scale: 0.8, opacity: 0.9 }}
                    animate={{ scale: 1.6, opacity: 0 }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}

                <circle
                  cx={wp.svgX}
                  cy={wp.svgY}
                  r={isSelected ? 6.5 : 4.5}
                  fill={isSelected ? "#8D4A33" : "#26231F"}
                  stroke={isSelected ? "#F7F4EE" : "#C57D65"}
                  strokeWidth={isSelected ? 2 : 1.5}
                  className="transition-all duration-300 group-hover:scale-125"
                />

                <g transform={`translate(${wp.svgX}, ${wp.svgY - 14})`}>
                  <rect
                    x="-14"
                    y="-11"
                    width="28"
                    height="14"
                    rx="2"
                    fill={isSelected ? "#8D4A33" : "#1B1916"}
                    stroke={isSelected ? "#C57D65" : "rgba(255,255,255,0.15)"}
                    strokeWidth="0.8"
                  />
                  <text
                    x="0"
                    y="-1"
                    textAnchor="middle"
                    className={`font-mono text-[8px] font-medium tracking-wider ${
                      isSelected ? "fill-white" : "fill-[#E2DDD3]"
                    }`}
                  >
                    {wp.step}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        <div className="absolute bottom-2 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#C57D65]/40 to-transparent" />
      </div>

      <div className="p-3.5 bg-[#1B1916] border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[8px] tracking-[0.26em] uppercase text-[#C57D65] font-mono">
              Stage {currentWaypoint.step} &bull; {currentWaypoint.aslLabel}
            </span>
            <span className="text-[7.5px] tracking-[0.16em] uppercase text-[#A39E93] border border-white/15 px-1.5 py-0.2">
              {currentWaypoint.gradientStop}
            </span>
          </div>
          <p className="font-serif text-sm sm:text-base text-white font-light">
            {currentWaypoint.name}
          </p>
          <p className="text-[10px] text-[#A39E93] font-light">
            {currentWaypoint.zone}
          </p>
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {WAYPOINTS.map((wp, idx) => (
            <button
              key={wp.step}
              type="button"
              onClick={() => onSelectStep(idx)}
              className={`flex-1 sm:flex-initial min-h-[38px] px-3 py-1 text-[8.5px] font-mono tracking-wider uppercase border transition-all ${
                idx === activeStepIndex
                  ? "bg-[#8D4A33] border-[#C57D65] text-white font-semibold shadow-xs"
                  : "bg-transparent border-white/15 text-[#E2DDD3] hover:bg-white/5"
              }`}
            >
              {wp.step} &bull; {wp.elevationMeters}M
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
