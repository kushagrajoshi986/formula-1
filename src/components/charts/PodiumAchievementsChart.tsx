import React, { useState } from 'react';
import { Driver, Constructor } from '../../types/f1';
import { Trophy, Award, Sparkles, Filter } from 'lucide-react';

interface PodiumAchievementsChartProps {
  drivers: Driver[];
  constructors: Constructor[];
  topN: number;
}

export const PodiumAchievementsChart: React.FC<PodiumAchievementsChartProps> = ({
  drivers,
  constructors,
  topN,
}) => {
  const [viewEntity, setViewEntity] = useState<'drivers' | 'constructors'>('drivers');
  const [hoveredItem, setHoveredItem] = useState<{
    name: string;
    team: string;
    starts: number;
    podiums: number;
    wins: number;
    color: string;
  } | null>(null);

  // SVG dimensions
  const svgWidth = 720;
  const svgHeight = 360;
  const padding = { top: 30, right: 40, bottom: 50, left: 60 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const chartHeight = svgHeight - padding.top - padding.bottom;

  // Domain maximums
  const maxX = viewEntity === 'drivers' ? 160 : 300; // starts
  const maxY = viewEntity === 'drivers' ? 120 : 180; // podiums

  const displayDrivers = drivers.slice(0, topN === 999 ? undefined : topN);
  const displayConstructors = constructors.slice(0, topN === 999 ? undefined : topN);

  return (
    <div className="bg-[#141822] border border-white/10 rounded-xl p-4 lg:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <h2 className="text-sm lg:text-base font-bold text-white uppercase tracking-wider">
              Podium Achievements & Win Conversion Bubble Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            X-Axis: Starts · Y-Axis: Podiums · Bubble Size: Race Wins · Color: Team Identity
          </p>
        </div>

        {/* Entity Switcher */}
        <div className="flex items-center gap-1 bg-[#0b0e14] border border-white/10 rounded p-0.5 text-xs self-start sm:self-auto">
          <button
            onClick={() => setViewEntity('drivers')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              viewEntity === 'drivers'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Driver Bubbles
          </button>
          <button
            onClick={() => setViewEntity('constructors')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
              viewEntity === 'constructors'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Team Bubbles
          </button>
        </div>
      </div>

      {/* SVG Bubble Canvas */}
      <div className="relative flex-1 min-h-[300px] bg-[#0b0e14] border border-white/5 rounded-lg p-2 flex items-center justify-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full min-w-[500px] select-none"
        >
          {/* Horizontal Gridlines (Podiums) */}
          {[0, 25, 50, 75, 100, 125, 150].filter(v => v <= maxY).map((val) => {
            const y = padding.top + chartHeight - (val / maxY) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#ffffff10"
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
          })}

          {/* Vertical Gridlines (Starts) */}
          {[0, 50, 100, 150, 200, 250, 300].filter(v => v <= maxX).map((val) => {
            const x = padding.left + (val / maxX) * chartWidth;
            return (
              <g key={val}>
                <line
                  x1={x}
                  y1={padding.top}
                  x2={x}
                  y2={padding.top + chartHeight}
                  stroke="#ffffff10"
                  strokeDasharray="2 3"
                />
                <text
                  x={x}
                  y={padding.top + chartHeight + 18}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="10px"
                  fontFamily="monospace"
                >
                  {val} Starts
                </text>
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padding.left + chartWidth / 2}
            y={svgHeight - 10}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11px"
            fontFamily="sans-serif"
          >
            Grand Prix Starts (Volume of Experience)
          </text>

          <text
            transform={`rotate(-90)`}
            x={-(padding.top + chartHeight / 2)}
            y={18}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="11px"
            fontFamily="sans-serif"
          >
            Podium Finishes (Silverware)
          </text>

          {/* Bubbles */}
          {viewEntity === 'drivers'
            ? displayDrivers.map((driver) => {
                const cx = padding.left + (driver.starts / maxX) * chartWidth;
                const cy = padding.top + chartHeight - (driver.podiums / maxY) * chartHeight;
                // Radius derived from wins (min 6, max 26)
                const r = Math.max(6, Math.min(26, Math.sqrt(driver.wins + 1) * 3 + 4));
                const isHovered = hoveredItem?.name === driver.name;

                return (
                  <g
                    key={driver.id}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() =>
                      setHoveredItem({
                        name: driver.name,
                        team: driver.currentTeam,
                        starts: driver.starts,
                        podiums: driver.podiums,
                        wins: driver.wins,
                        color: driver.teamColor,
                      })
                    }
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r + 8}
                        fill="none"
                        stroke={driver.teamColor}
                        strokeWidth="1.5"
                        className="animate-ping opacity-60"
                      />
                    )}

                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={driver.teamColor}
                      fillOpacity={isHovered ? 0.9 : 0.65}
                      stroke="#FFFFFF"
                      strokeWidth={isHovered ? 2.5 : 1}
                    />

                    {/* Driver Code / Name Label if podiums > 0 */}
                    {driver.podiums > 0 && (
                      <text
                        x={cx}
                        y={cy + (r > 12 ? 4 : -r - 4)}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize={r > 14 ? '11px' : '9px'}
                        fontFamily="sans-serif"
                        fontWeight="bold"
                        className="pointer-events-none drop-shadow"
                      >
                        {driver.code}
                      </text>
                    )}
                  </g>
                );
              })
            : displayConstructors.map((team) => {
                const cx = padding.left + (team.starts / maxX) * chartWidth;
                const cy = padding.top + chartHeight - (team.podiums / maxY) * chartHeight;
                const r = Math.max(8, Math.min(32, Math.sqrt(team.wins + 1) * 3 + 6));
                const isHovered = hoveredItem?.name === team.name;

                return (
                  <g
                    key={team.id}
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() =>
                      setHoveredItem({
                        name: team.name,
                        team: team.country,
                        starts: team.starts,
                        podiums: team.podiums,
                        wins: team.wins,
                        color: team.color,
                      })
                    }
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={r + 10}
                        fill="none"
                        stroke={team.color}
                        strokeWidth="1.5"
                        className="animate-ping opacity-60"
                      />
                    )}

                    <circle
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill={team.color}
                      fillOpacity={isHovered ? 0.9 : 0.65}
                      stroke="#FFFFFF"
                      strokeWidth={isHovered ? 2.5 : 1}
                    />

                    <text
                      x={cx}
                      y={cy + 4}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10px"
                      fontFamily="sans-serif"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow"
                    >
                      {team.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
        </svg>

        {/* Hover Telemetry Card */}
        {hoveredItem && (
          <div className="absolute top-3 right-3 bg-[#10141d]/95 backdrop-blur-md border border-white/20 rounded-lg p-3 shadow-xl pointer-events-none min-w-[200px]">
            <div className="flex items-center gap-2 border-b border-white/10 pb-1.5 mb-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: hoveredItem.color }}
              />
              <span className="font-bold text-white text-xs">{hoveredItem.name}</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="bg-white/5 rounded p-1">
                <span className="block text-[9px] text-slate-400 font-sans">Podiums</span>
                <span className="font-bold text-amber-400">{hoveredItem.podiums}</span>
              </div>
              <div className="bg-white/5 rounded p-1">
                <span className="block text-[9px] text-slate-400 font-sans">Wins</span>
                <span className="font-bold text-[#E10600]">{hoveredItem.wins}</span>
              </div>
              <div className="bg-white/5 rounded p-1">
                <span className="block text-[9px] text-slate-400 font-sans">Starts</span>
                <span className="font-bold text-white">{hoveredItem.starts}</span>
              </div>
            </div>

            <div className="mt-2 text-[10px] text-slate-400 flex justify-between">
              <span>Conversion Rate:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {((hoveredItem.podiums / Math.max(1, hoveredItem.starts)) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
        <span>Bubble area is proportional to race victories</span>
        <span className="font-mono text-amber-400">Top-3 Silverware vs Starts</span>
      </div>
    </div>
  );
};
