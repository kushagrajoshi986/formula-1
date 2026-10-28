import React, { useState } from 'react';
import { COUNTRY_STATS } from '../../data/f1Data';
import { CountryStat } from '../../types/f1';
import { Flag, Trophy, MapPin, Globe } from 'lucide-react';

export const CountryParticipationChart: React.FC = () => {
  const [metric, setMetric] = useState<'races' | 'podiums' | 'drivers'>('races');
  const [hoveredCountry, setHoveredCountry] = useState<CountryStat | null>(null);

  const sortedCountries = [...COUNTRY_STATS].sort((a, b) => {
    if (metric === 'races') return b.racesHosted - a.racesHosted;
    if (metric === 'podiums') return b.totalPodiums - a.totalPodiums;
    if (metric === 'drivers') return b.driversCount - a.driversCount;
    return 0;
  });

  const maxVal = Math.max(
    ...sortedCountries.map((c) =>
      metric === 'races' ? c.racesHosted : metric === 'podiums' ? c.totalPodiums : c.driversCount
    ),
    1
  );

  return (
    <div className="bg-[#141822] border border-white/10 rounded-xl p-4 lg:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00D2BE]"></span>
            <h2 className="text-sm lg:text-base font-bold text-white uppercase tracking-wider">
              Country-Wise Race Participation & Heritage
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Historic Grand Prix hosting volume vs. driver talent conversion by sovereign nation
          </p>
        </div>

        {/* Metric Selector */}
        <div className="flex items-center gap-1 bg-[#0b0e14] border border-white/10 rounded p-0.5 text-xs self-start sm:self-auto">
          <button
            onClick={() => setMetric('races')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              metric === 'races'
                ? 'bg-[#00D2BE] text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Races Hosted
          </button>
          <button
            onClick={() => setMetric('podiums')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              metric === 'podiums'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Driver Podiums
          </button>
          <button
            onClick={() => setMetric('drivers')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium ${
              metric === 'drivers'
                ? 'bg-[#E10600] text-white font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Driver Seats
          </button>
        </div>
      </div>

      {/* Ranked List */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[360px]">
        {sortedCountries.map((item, index) => {
          const val =
            metric === 'races'
              ? item.racesHosted
              : metric === 'podiums'
              ? item.totalPodiums
              : item.driversCount;

          const pct = Math.max(2, (val / maxVal) * 100);
          const isHovered = hoveredCountry?.country === item.country;

          return (
            <div
              key={item.country}
              className={`p-2 rounded-lg border transition-all ${
                isHovered
                  ? 'bg-white/10 border-white/20'
                  : 'bg-[#0f121a] border-white/5 hover:border-white/10'
              }`}
              onMouseEnter={() => setHoveredCountry(item)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 text-[11px] w-4">
                    #{index + 1}
                  </span>
                  <span className="font-bold text-white tracking-wide">
                    {item.country}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 px-1 bg-white/5 rounded">
                    {item.countryCode}
                  </span>
                </div>

                <div className="font-mono font-bold text-white text-xs sm:text-sm">
                  {metric === 'races' && `${val} GPs Hosted`}
                  {metric === 'podiums' && `${val} Podiums`}
                  {metric === 'drivers' && `${val} Drivers`}
                </div>
              </div>

              {/* Bar */}
              <div className="h-2.5 w-full bg-black/40 rounded-sm overflow-hidden flex items-center">
                <div
                  style={{
                    width: `${pct}%`,
                    backgroundColor:
                      metric === 'races'
                        ? '#00D2BE'
                        : metric === 'podiums'
                        ? '#F59E0B'
                        : '#E10600',
                  }}
                  className="h-full rounded-sm transition-all duration-300"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>
                  {item.racesHosted} GPs Hosted · {item.totalWins} Wins · {item.totalPodiums} Podiums
                </span>
                <span>
                  {item.driversCount > 0 ? `${item.driversCount} Active Driver(s)` : 'No current driver'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover Card */}
      {hoveredCountry && (
        <div className="mt-2.5 p-2 bg-[#0b0e14] border border-white/10 rounded-md text-xs flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">{hoveredCountry.country}</span>
            <span className="text-slate-400">({hoveredCountry.countryCode})</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span>Races: {hoveredCountry.racesHosted}</span>
            <span>Wins: {hoveredCountry.totalWins}</span>
            <span>Podiums: {hoveredCountry.totalPodiums}</span>
          </div>
        </div>
      )}
    </div>
  );
};
