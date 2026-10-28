import React, { useState } from 'react';
import { TYRE_COMPOUNDS } from '../../data/f1Data';
import { TyreCompoundData } from '../../types/f1';
import { CircleDot, Zap, Gauge, Flame } from 'lucide-react';

export const TyreCompoundUsage: React.FC = () => {
  const [selectedCompound, setSelectedCompound] = useState<TyreCompoundData>(TYRE_COMPOUNDS[1]); // Medium default

  const totalLaps = TYRE_COMPOUNDS.reduce((sum, c) => sum + c.totalLaps, 0);

  return (
    <div className="bg-[#141822] border border-white/10 rounded-xl p-4 lg:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FFD700]"></span>
            <h2 className="text-sm lg:text-base font-bold text-white uppercase tracking-wider">
              Tyre Compound Usage & Stint Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Pirelli compound strategy, stint longevity, wear degradation & fastest laps
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Total Laps Logged</span>
          <span className="text-xs font-mono font-bold text-white">{totalLaps.toLocaleString()} Laps</span>
        </div>
      </div>

      {/* Proportional Segmented Track */}
      <div className="mb-4">
        <div className="h-5 w-full bg-black/40 rounded-md overflow-hidden flex p-0.5 gap-0.5">
          {TYRE_COMPOUNDS.map((item) => (
            <div
              key={item.compound}
              style={{
                width: `${item.usagePercentage}%`,
                backgroundColor: item.color,
              }}
              className={`h-full rounded-sm cursor-pointer transition-all hover:opacity-100 ${
                selectedCompound.compound === item.compound ? 'opacity-100 ring-2 ring-white' : 'opacity-75'
              }`}
              onClick={() => setSelectedCompound(item)}
              title={`${item.compound}: ${item.usagePercentage}% (${item.totalLaps.toLocaleString()} laps)`}
            />
          ))}
        </div>

        {/* Compound Badges / Legend */}
        <div className="flex flex-wrap items-center justify-between gap-1.5 mt-2 text-xs">
          {TYRE_COMPOUNDS.map((item) => (
            <button
              key={item.compound}
              onClick={() => setSelectedCompound(item)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition-all ${
                selectedCompound.compound === item.compound
                  ? 'bg-white/15 text-white font-bold border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-black/50"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.compound}</span>
              <span className="text-[10px] text-slate-400">{item.usagePercentage}%</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Compound Deep Dive Card */}
      <div className="flex-1 bg-[#0b0e14] border border-white/5 rounded-lg p-3.5 flex flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/50 shadow-sm"
              style={{ backgroundColor: selectedCompound.color }}
            />
            <span className="font-bold text-white text-sm tracking-wide">
              Pirelli {selectedCompound.compound} Compound
            </span>
          </div>

          <span className="text-xs font-mono text-emerald-400 font-semibold">
            {selectedCompound.stintsCount.toLocaleString()} Total Stints
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3 text-center">
          <div className="bg-white/5 rounded-md p-2">
            <span className="block text-[10px] text-slate-400">Total Mileage</span>
            <span className="font-mono font-bold text-white text-sm">
              {selectedCompound.totalLaps.toLocaleString()}
            </span>
            <span className="block text-[9px] text-slate-400">race laps</span>
          </div>

          <div className="bg-white/5 rounded-md p-2">
            <span className="block text-[10px] text-slate-400">Avg Stint Length</span>
            <span className="font-mono font-bold text-amber-400 text-sm">
              {selectedCompound.avgLapsPerStint}
            </span>
            <span className="block text-[9px] text-slate-400">laps / stint</span>
          </div>

          <div className="bg-white/5 rounded-md p-2">
            <span className="block text-[10px] text-slate-400">Fastest Laps</span>
            <span className="font-mono font-bold text-[#E10600] text-sm">
              {selectedCompound.fastestLapsAchieved}
            </span>
            <span className="block text-[9px] text-slate-400">bonus points</span>
          </div>

          <div className="bg-white/5 rounded-md p-2">
            <span className="block text-[10px] text-slate-400">Degradation</span>
            <span className="font-mono font-bold text-purple-400 text-sm">
              +{selectedCompound.avgDegradationTenthsPerLap}s
            </span>
            <span className="block text-[9px] text-slate-400">per lap wear</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-400 leading-relaxed bg-white/[0.02] p-2 rounded border border-white/5">
          {selectedCompound.compound === 'Soft' && (
            <span>
              <strong>Soft Compound (Red):</strong> Maximum mechanical grip and qualifying pace. High thermal degradation mandates shorter stints (15-18 laps) primarily utilized for aggressive undercut pit phases.
            </span>
          )}
          {selectedCompound.compound === 'Medium' && (
            <span>
              <strong>Medium Compound (Yellow):</strong> The quintessential grand prix race tyre. Accounts for 43% of all race mileage, providing optimal balance between turn-in grip and consistent 22-lap degradation.
            </span>
          )}
          {selectedCompound.compound === 'Hard' && (
            <span>
              <strong>Hard Compound (White):</strong> Highest durability and lowest degradation (+0.03s/lap). Essential for 1-stop race strategies at abrasive circuits like Silverstone, Suzuka, and Barcelona.
            </span>
          )}
          {selectedCompound.compound === 'Intermediate' && (
            <span>
              <strong>Intermediate (Green):</strong> Grooved tyre displacing 30 liters of water per second at 300 km/h. Utilized during damp or drying track conditions.
            </span>
          )}
          {selectedCompound.compound === 'Wet' && (
            <span>
              <strong>Full Wet (Blue):</strong> Extreme wet weather tyre displacing 85 liters per second. Highest rolling resistance and high heat buildup on drying asphalt.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
