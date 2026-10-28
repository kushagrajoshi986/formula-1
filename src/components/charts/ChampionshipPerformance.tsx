import React, { useState } from 'react';
import { Constructor } from '../../types/f1';
import { SEASONS } from '../../data/f1Data';
import { TrendingUp, Award, Layers } from 'lucide-react';

interface ChampionshipPerformanceProps {
  constructors: Constructor[];
}

export const ChampionshipPerformance: React.FC<ChampionshipPerformanceProps> = ({
  constructors,
}) => {
  const [viewMode, setViewMode] = useState<'points' | 'standings'>('points');
  const [hoveredTeamId, setHoveredTeamId] = useState<string | null>(null);

  // Top 5 key constructors for clarity or all
  const keyTeams = constructors.slice(0, 7);

  // SVG dimensions
  const svgWidth = 720;
  const svgHeight = 280;
  const padding = { top: 30, right: 120, bottom: 40, left: 60 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Max points across any season
  const maxPoints = 900;

  return (
    <div className="bg-[#141822] border border-white/10 rounded-xl p-4 lg:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E10600]"></span>
            <h2 className="text-sm lg:text-base font-bold text-white uppercase tracking-wider">
              Championship Performance Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Constructor standings & points trajectory across the 2018–2024 aerodynamic eras
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-[#0b0e14] border border-white/10 rounded p-0.5 text-xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('points')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              viewMode === 'points'
                ? 'bg-[#E10600] text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Points Trajectory
          </button>
          <button
            onClick={() => setViewMode('standings')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              viewMode === 'standings'
                ? 'bg-[#E10600] text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rank Bump Chart (P1–P10)
          </button>
        </div>
      </div>

      {/* SVG Chart Area */}
      <div className="relative flex-1 min-h-[280px] bg-[#0b0e14] border border-white/5 rounded-lg p-2 flex items-center justify-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full min-w-[500px] select-none"
        >
          {/* Background Gridlines */}
          {viewMode === 'points' ? (
            // Horizontal points lines
            [0, 200, 400, 600, 800].map((val) => {
              const y = padding.top + chartHeight - (val / maxPoints) * chartHeight;
              return (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + chartWidth}
                    y2={y}
                    stroke="#ffffff15"
                    strokeDasharray="2 3"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 4}
                    textAnchor="end"
                    fill="#64748b"
                    fontSize="10px"
                    fontFamily="monospace"
                  >
                    {val}
                  </text>
                </g>
              );
            })
          ) : (
            // Horizontal position lines (P1 to P10)
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((pos) => {
              const y = padding.top + ((pos - 1) / 9) * chartHeight;
              return (
                <g key={pos}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + chartWidth}
                    y2={y}
                    stroke="#ffffff10"
                    strokeDasharray="2 2"
                  />
                  <text
                    x={padding.left - 10}
                    y={y + 3}
                    textAnchor="end"
                    fill="#94a3b8"
                    fontSize="10px"
                    fontFamily="monospace"
                  >
                    P{pos}
                  </text>
                </g>
              );
            })
          )}

          {/* Vertical Season Lines */}
          {SEASONS.map((season, i) => {
            const x = padding.left + (i / (SEASONS.length - 1)) * chartWidth;
            return (
              <g key={season}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + chartHeight}
                  stroke="#ffffff10"
                />
                <text
                  x={x}
                  y={padding.top + chartHeight + 18}
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="11px"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {season}
                </text>
              </g>
            );
          })}

          {/* Constructor Lines */}
          {keyTeams.map((team) => {
            const isHovered = hoveredTeamId === team.id;
            const isAnyHovered = hoveredTeamId !== null;
            const opacity = isHovered ? 1 : isAnyHovered ? 0.2 : 0.85;
            const strokeWidth = isHovered ? 3.5 : 2;

            // Generate path points
            const points = SEASONS.map((season, i) => {
              const x = padding.left + (i / (SEASONS.length - 1)) * chartWidth;
              let y: number;
              if (viewMode === 'points') {
                const pts = team.seasonPoints[season] || 0;
                y = padding.top + chartHeight - (pts / maxPoints) * chartHeight;
              } else {
                const pos = team.seasonPositions[season] || 10;
                y = padding.top + ((pos - 1) / 9) * chartHeight;
              }
              return { x, y, season, pts: team.seasonPoints[season], pos: team.seasonPositions[season] };
            });

            const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
            const lastPoint = points[points.length - 1];

            return (
              <g
                key={team.id}
                className="cursor-pointer transition-opacity duration-200"
                onMouseEnter={() => setHoveredTeamId(team.id)}
                onMouseLeave={() => setHoveredTeamId(null)}
              >
                {/* Polyline Path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke={team.color}
                  strokeWidth={strokeWidth}
                  opacity={opacity}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Nodes on each season */}
                {points.map((p) => (
                  <circle
                    key={p.season}
                    cx={p.x}
                    cy={p.y}
                    r={isHovered ? 5 : 3.5}
                    fill={team.color}
                    stroke="#0b0e14"
                    strokeWidth="1.5"
                    opacity={opacity}
                  >
                    <title>{`${team.name} (${p.season}): ${viewMode === 'points' ? `${p.pts} pts` : `P${p.pos}`}`}</title>
                  </circle>
                ))}

                {/* Trailing Label */}
                <text
                  x={lastPoint.x + 8}
                  y={lastPoint.y + 3}
                  fill={isHovered ? '#FFFFFF' : team.color}
                  fontSize="10px"
                  fontFamily="sans-serif"
                  fontWeight="bold"
                  opacity={opacity}
                >
                  {team.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend & Key Dynasty Takeaway */}
      <div className="mt-2.5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {keyTeams.map((t) => (
            <span
              key={t.id}
              className={`inline-flex items-center gap-1 cursor-pointer transition-colors ${
                hoveredTeamId === t.id ? 'text-white font-bold' : 'hover:text-slate-200'
              }`}
              onMouseEnter={() => setHoveredTeamId(t.id)}
              onMouseLeave={() => setHoveredTeamId(null)}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
              <span className="text-[11px]">{t.name.split(' ')[0]}</span>
            </span>
          ))}
        </div>

        <span className="text-[11px] font-mono text-emerald-400">
          Mercedes (18–21) → Red Bull (22–23) → McLaren (2024)
        </span>
      </div>
    </div>
  );
};
