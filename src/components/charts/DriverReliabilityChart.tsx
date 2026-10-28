import React, { useState } from 'react';
import { Driver, DNFCategory } from '../../types/f1';
import { ShieldCheck, AlertTriangle, Layers, ArrowUpDown } from 'lucide-react';

interface DriverReliabilityChartProps {
  drivers: Driver[];
  topN: number;
}

export const DriverReliabilityChart: React.FC<DriverReliabilityChartProps> = ({
  drivers,
  topN,
}) => {
  const [sortMode, setSortMode] = useState<'starts' | 'reliability' | 'dnfs'>('reliability');
  const [hoveredDriver, setHoveredDriver] = useState<Driver | null>(null);

  // Clone and sort
  const displayDrivers = [...drivers].sort((a, b) => {
    if (sortMode === 'starts') return b.starts - a.starts;
    if (sortMode === 'dnfs') return b.dnfCount - a.dnfCount;
    // reliability
    const relA = a.dnfBreakdown.Finished / Math.max(1, a.starts);
    const relB = b.dnfBreakdown.Finished / Math.max(1, b.starts);
    return relB - relA;
  }).slice(0, topN === 999 ? undefined : topN);

  return (
    <div className="bg-[#141822] border border-white/10 rounded-xl p-4 lg:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <h2 className="text-sm lg:text-base font-bold text-white uppercase tracking-wider">
              Driver Reliability & DNF Decomposition
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Stacked breakdown of race outcomes: classified finishes vs. mechanical and collision retirements
          </p>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[11px] text-slate-400">Sort by:</span>
          <div className="flex items-center bg-[#0b0e14] border border-white/10 rounded p-0.5 text-xs">
            <button
              onClick={() => setSortMode('reliability')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                sortMode === 'reliability'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Reliability %
            </button>
            <button
              onClick={() => setSortMode('starts')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                sortMode === 'starts'
                  ? 'bg-white/20 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Starts
            </button>
            <button
              onClick={() => setSortMode('dnfs')}
              className={`px-2 py-0.5 rounded text-[11px] ${
                sortMode === 'dnfs'
                  ? 'bg-[#E10600] text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              DNFs
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 pb-2.5 mb-2 border-b border-white/5">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-2.5 rounded-sm bg-emerald-500"></span>
          <span>Classified Finished</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-2.5 rounded-sm bg-[#E10600]"></span>
          <span>Engine / Power Unit</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-2.5 rounded-sm bg-orange-500"></span>
          <span>Racing Collision / Crash</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-2.5 rounded-sm bg-purple-500"></span>
          <span>Gearbox & Hydraulics</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-2.5 rounded-sm bg-sky-400"></span>
          <span>Brakes, Suspension & Other</span>
        </span>
      </div>

      {/* Stacked Bars List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[360px]">
        {displayDrivers.map((driver) => {
          const total = Math.max(1, driver.starts);
          const finished = driver.dnfBreakdown.Finished || 0;
          const enginePU = (driver.dnfBreakdown.Engine || 0) + (driver.dnfBreakdown['Power Unit'] || 0);
          const collision = (driver.dnfBreakdown.Collision || 0) + (driver.dnfBreakdown.Accident || 0);
          const transmission = (driver.dnfBreakdown.Gearbox || 0) + (driver.dnfBreakdown.Hydraulics || 0);
          const other = Math.max(0, total - (finished + enginePU + collision + transmission));

          const pctFinished = (finished / total) * 100;
          const pctEngine = (enginePU / total) * 100;
          const pctCollision = (collision / total) * 100;
          const pctTransmission = (transmission / total) * 100;
          const pctOther = (other / total) * 100;

          const isHovered = hoveredDriver?.id === driver.id;

          return (
            <div
              key={driver.id}
              className={`p-1.5 rounded-md transition-colors ${
                isHovered ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
              onMouseEnter={() => setHoveredDriver(driver)}
              onMouseLeave={() => setHoveredDriver(null)}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-3 rounded-sm"
                    style={{ backgroundColor: driver.teamColor }}
                  />
                  <span className="font-semibold text-white tracking-wide">
                    {driver.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {driver.code} · #{driver.number}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-mono">
                  <span className="text-emerald-400 font-bold">
                    {pctFinished.toFixed(1)}% Finish
                  </span>
                  <span className="text-slate-400">
                    ({finished}/{total} Starts)
                  </span>
                </div>
              </div>

              {/* Stacked Bar Container */}
              <div className="h-4 w-full bg-black/40 rounded-sm overflow-hidden flex">
                {/* Finished */}
                {pctFinished > 0 && (
                  <div
                    style={{ width: `${pctFinished}%` }}
                    className="bg-emerald-500 hover:bg-emerald-400 transition-all h-full"
                    title={`Finished: ${finished} races (${pctFinished.toFixed(1)}%)`}
                  />
                )}
                {/* Engine / Power Unit */}
                {pctEngine > 0 && (
                  <div
                    style={{ width: `${pctEngine}%` }}
                    className="bg-[#E10600] hover:bg-red-500 transition-all h-full"
                    title={`Engine / PU: ${enginePU} retirements (${pctEngine.toFixed(1)}%)`}
                  />
                )}
                {/* Collision */}
                {pctCollision > 0 && (
                  <div
                    style={{ width: `${pctCollision}%` }}
                    className="bg-orange-500 hover:bg-orange-400 transition-all h-full"
                    title={`Collision / Accident: ${collision} (${pctCollision.toFixed(1)}%)`}
                  />
                )}
                {/* Gearbox / Hydraulics */}
                {pctTransmission > 0 && (
                  <div
                    style={{ width: `${pctTransmission}%` }}
                    className="bg-purple-500 hover:bg-purple-400 transition-all h-full"
                    title={`Transmission / Hydraulics: ${transmission} (${pctTransmission.toFixed(1)}%)`}
                  />
                )}
                {/* Other */}
                {pctOther > 0 && (
                  <div
                    style={{ width: `${pctOther}%` }}
                    className="bg-sky-400 hover:bg-sky-300 transition-all h-full"
                    title={`Brakes / Electrical / Other: ${other} (${pctOther.toFixed(1)}%)`}
                  />
                )}
              </div>
            </div>
          );
        })}

        {displayDrivers.length === 0 && (
          <div className="text-center py-8 text-xs text-slate-400">
            No drivers match the current filter criteria. Try resetting filters.
          </div>
        )}
      </div>

      {/* Detail Tooltip Bar at Bottom if hovered */}
      {hoveredDriver && (
        <div className="mt-3 p-2 bg-[#0b0e14] border border-white/10 rounded-md text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{hoveredDriver.name}</span>
            <span className="text-slate-400 text-[11px]">({hoveredDriver.currentTeam})</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="text-emerald-400">Finishes: {hoveredDriver.dnfBreakdown.Finished}</span>
            <span className="text-[#E10600]">
              PU Failures: {(hoveredDriver.dnfBreakdown.Engine || 0) + (hoveredDriver.dnfBreakdown['Power Unit'] || 0)}
            </span>
            <span className="text-orange-400">
              Collisions: {(hoveredDriver.dnfBreakdown.Collision || 0) + (hoveredDriver.dnfBreakdown.Accident || 0)}
            </span>
            <span className="text-purple-400">
              Hydraulics/GB: {(hoveredDriver.dnfBreakdown.Gearbox || 0) + (hoveredDriver.dnfBreakdown.Hydraulics || 0)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
