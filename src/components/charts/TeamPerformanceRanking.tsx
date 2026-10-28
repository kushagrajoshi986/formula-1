import React, { useState } from 'react';
import { Constructor } from '../../types/f1';
import { ShieldAlert, Award, Trophy, CheckCircle2 } from 'lucide-react';

interface TeamPerformanceRankingProps {
  constructors: Constructor[];
  topN: number;
}

type TeamMetric = 'points' | 'wins' | 'podiums' | 'dnfCount';

export const TeamPerformanceRanking: React.FC<TeamPerformanceRankingProps> = ({
  constructors,
  topN,
}) => {
  const [metric, setMetric] = useState<TeamMetric>('points');
  const [hoveredTeam, setHoveredTeam] = useState<Constructor | null>(null);

  const displayTeams = [...constructors].sort((a, b) => {
    if (metric === 'points') return b.points - a.points;
    if (metric === 'wins') return b.wins - a.wins;
    if (metric === 'podiums') return b.podiums - a.podiums;
    if (metric === 'dnfCount') return a.dnfCount - b.dnfCount; // lower DNF is better
    return 0;
  }).slice(0, topN === 999 ? undefined : topN);

  const maxVal = Math.max(...displayTeams.map((c) => c[metric]), 1);

  return (
    <div className="bg-[#141822] border border-white/10 rounded-xl p-4 lg:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E41FF]"></span>
            <h2 className="text-sm lg:text-base font-bold text-white uppercase tracking-wider">
              Team Performance Ranking
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Constructor championship benchmarks & operational metrics
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-1 bg-[#0b0e14] border border-white/10 rounded p-0.5 text-xs self-start sm:self-auto">
          <button
            onClick={() => setMetric('points')}
            className={`px-2 py-0.5 rounded text-[11px] ${
              metric === 'points'
                ? 'bg-[#1E41FF] text-white font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Points
          </button>
          <button
            onClick={() => setMetric('wins')}
            className={`px-2 py-0.5 rounded text-[11px] ${
              metric === 'wins'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Wins
          </button>
          <button
            onClick={() => setMetric('podiums')}
            className={`px-2 py-0.5 rounded text-[11px] ${
              metric === 'podiums'
                ? 'bg-emerald-600 text-white font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Podiums
          </button>
          <button
            onClick={() => setMetric('dnfCount')}
            className={`px-2 py-0.5 rounded text-[11px] ${
              metric === 'dnfCount'
                ? 'bg-[#E10600] text-white font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            DNFs
          </button>
        </div>
      </div>

      {/* Horizontal Bar Chart */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[360px]">
        {displayTeams.map((team, index) => {
          const val = team[metric];
          const pct = Math.max(3, (val / maxVal) * 100);
          const isHovered = hoveredTeam?.id === team.id;

          return (
            <div
              key={team.id}
              className={`p-2 rounded-lg border transition-all ${
                isHovered
                  ? 'bg-white/10 border-white/20'
                  : 'bg-[#0f121a] border-white/5 hover:border-white/10'
              }`}
              onMouseEnter={() => setHoveredTeam(team)}
              onMouseLeave={() => setHoveredTeam(null)}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[11px] w-4">
                    #{index + 1}
                  </span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: team.color }}
                  />
                  <span className="font-bold text-white tracking-wide">
                    {team.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    ({team.countryCode})
                  </span>
                </div>

                <div className="font-mono font-bold text-white text-xs sm:text-sm">
                  {metric === 'points' && `${val.toLocaleString()} pts`}
                  {metric === 'wins' && `${val} Wins`}
                  {metric === 'podiums' && `${val} Podiums`}
                  {metric === 'dnfCount' && `${val} DNFs`}
                </div>
              </div>

              {/* Bar */}
              <div className="h-3 w-full bg-black/40 rounded-sm overflow-hidden flex items-center">
                <div
                  style={{
                    width: `${pct}%`,
                    backgroundColor: team.color,
                  }}
                  className="h-full rounded-sm transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>
                  {team.wins} Wins · {team.podiums} Podiums · {team.dnfCount} DNFs
                </span>
                <span className="font-mono">
                  Reliability: {(((team.starts - team.dnfCount) / team.starts) * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover Card */}
      {hoveredTeam && (
        <div className="mt-2.5 p-2 bg-[#0b0e14] border border-white/10 rounded-md text-xs flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: hoveredTeam.color }}
            />
            <span className="font-bold text-white">{hoveredTeam.name}</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Points: {hoveredTeam.points}</span>
            <span>Championships: {hoveredTeam.championships}</span>
            <span>Poles: {hoveredTeam.poles}</span>
          </div>
        </div>
      )}
    </div>
  );
};
