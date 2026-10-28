import React, { useState } from 'react';
import { Driver, PerformanceMetric } from '../../types/f1';
import { Trophy, Award, Zap, TrendingUp, HelpCircle, Download, Check } from 'lucide-react';
import { formatMetricValue } from '../../utils/analytics';

interface DriverPerformanceLeaderboardProps {
  drivers: Driver[];
  selectedMetric: PerformanceMetric;
  topN: number;
}

export const DriverPerformanceLeaderboard: React.FC<DriverPerformanceLeaderboardProps> = ({
  drivers,
  selectedMetric,
  topN,
}) => {
  const [hoveredDriver, setHoveredDriver] = useState<Driver | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<boolean>(false);

  const displayDrivers = drivers.slice(0, topN === 999 ? undefined : topN);
  const maxVal = Math.max(
    ...displayDrivers.map((d) => {
      switch (selectedMetric) {
        case 'points': return d.points;
        case 'ppr': return d.points / Math.max(1, d.starts);
        case 'wins': return d.wins;
        case 'podiums': return d.podiums;
        case 'reliability': return d.dnfBreakdown.Finished / Math.max(1, d.starts);
        case 'avgFinish': return 20; // scale
      }
    }),
    1
  );

  const handleExportLeaderboard = () => {
    const headers = 'Rank,Driver,Code,Number,Nationality,Team,MetricValue,Starts,Wins,Podiums,Points,DNFs\n';
    const rows = displayDrivers.map((d, i) => {
      let metricVal = '';
      switch (selectedMetric) {
        case 'points': metricVal = d.points.toString(); break;
        case 'ppr': metricVal = (d.points / Math.max(1, d.starts)).toFixed(2); break;
        case 'wins': metricVal = d.wins.toString(); break;
        case 'podiums': metricVal = d.podiums.toString(); break;
        case 'reliability': metricVal = `${((d.dnfBreakdown.Finished / Math.max(1, d.starts)) * 100).toFixed(1)}%`; break;
        case 'avgFinish': metricVal = `P${d.avgFinishPos}`; break;
      }
      return `${i + 1},"${d.name}","${d.code}",${d.number},"${d.nationality}","${d.currentTeam}","${metricVal}",${d.starts},${d.wins},${d.podiums},${d.points},${d.dnfCount}`;
    }).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `f1_leaderboard_ranked_by_${selectedMetric}_top${topN === 999 ? 'all' : topN}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  return (
    <div className="bg-[#141822] border border-white/10 rounded-xl p-4 lg:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <h2 className="text-sm lg:text-base font-bold text-white uppercase tracking-wider">
              Driver Performance Leaderboard
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ranked by {selectedMetric.toUpperCase()} · Top {topN === 999 ? 'All' : topN} Drivers
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLeaderboard}
            title="Download this ranked leaderboard as CSV"
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white transition-colors border border-white/10"
          >
            {copiedSuccess ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Downloaded</span>
              </>
            ) : (
              <>
                <Download className="w-3 h-3 text-amber-400" />
                <span>Export CSV</span>
              </>
            )}
          </button>

          <div className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded text-[11px] font-mono text-amber-400">
            {selectedMetric.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Driver List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[360px]">
        {displayDrivers.map((driver, index) => {
          let rawVal: number;
          let barPct: number;

          switch (selectedMetric) {
            case 'points':
              rawVal = driver.points;
              barPct = (rawVal / maxVal) * 100;
              break;
            case 'ppr':
              rawVal = driver.points / Math.max(1, driver.starts);
              barPct = (rawVal / maxVal) * 100;
              break;
            case 'wins':
              rawVal = driver.wins;
              barPct = (rawVal / Math.max(1, maxVal)) * 100;
              break;
            case 'podiums':
              rawVal = driver.podiums;
              barPct = (rawVal / Math.max(1, maxVal)) * 100;
              break;
            case 'reliability':
              rawVal = driver.dnfBreakdown.Finished / Math.max(1, driver.starts);
              barPct = rawVal * 100;
              break;
            case 'avgFinish':
              rawVal = driver.avgFinishPos;
              barPct = Math.max(5, (1 - rawVal / 20) * 100);
              break;
          }

          const isTop3 = index < 3;
          const isHovered = hoveredDriver?.id === driver.id;

          return (
            <div
              key={driver.id}
              className={`p-2 rounded-lg border transition-all ${
                isHovered
                  ? 'bg-white/10 border-white/20'
                  : 'bg-[#0f121a] border-white/5 hover:border-white/10'
              }`}
              onMouseEnter={() => setHoveredDriver(driver)}
              onMouseLeave={() => setHoveredDriver(null)}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded font-mono font-bold text-[11px] ${
                      index === 0
                        ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/50'
                        : index === 1
                        ? 'bg-slate-300 text-slate-950'
                        : index === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-white/5 text-slate-400'
                    }`}
                  >
                    {index + 1}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-1.5 h-3.5 rounded-sm"
                      style={{ backgroundColor: driver.teamColor }}
                    />
                    <span className="font-bold text-white tracking-wide">
                      {driver.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      #{driver.number} · {driver.nationality}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span className="text-white font-bold text-xs sm:text-sm">
                    {formatMetricValue(rawVal, selectedMetric)}
                  </span>
                </div>
              </div>

              {/* Progress Track */}
              <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden flex items-center">
                <div
                  style={{
                    width: `${Math.max(2, Math.min(100, barPct))}%`,
                    backgroundColor: driver.teamColor,
                  }}
                  className="h-full rounded-full transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>{driver.currentTeam}</span>
                <span className="font-mono">
                  {driver.wins} Wins · {driver.podiums} Podiums · {driver.starts} Starts
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Driver Telemetry Floating Inspector */}
      {hoveredDriver && (
        <div className="mt-3 p-2.5 bg-[#0b0e14] border border-white/10 rounded-lg text-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: hoveredDriver.teamColor }}
            />
            <span className="font-bold text-white">{hoveredDriver.name}</span>
            <span className="text-slate-400">({hoveredDriver.currentTeam})</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-amber-400">Points: {hoveredDriver.points}</span>
            <span className="text-emerald-400">PPR: {(hoveredDriver.points / Math.max(1, hoveredDriver.starts)).toFixed(2)}</span>
            <span className="text-sky-400">Poles: {hoveredDriver.poles}</span>
            <span className="text-purple-400">Fastest Laps: {hoveredDriver.fastestLaps}</span>
            <span className="text-white">Avg Finish: P{hoveredDriver.avgFinishPos}</span>
          </div>
        </div>
      )}
    </div>
  );
};
