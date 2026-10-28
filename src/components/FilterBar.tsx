import React, { useState, useRef, useEffect } from 'react';
import { FilterState, DNFCategory, PerformanceMetric } from '../types/f1';
import { SEASONS, CONSTRUCTORS } from '../data/f1Data';
import { FilteredAnalytics, downloadFilteredCsv } from '../utils/analytics';
import { Filter, SlidersHorizontal, Search, X, Download, FileSpreadsheet, Check, ChevronDown } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  analytics?: FilteredAnalytics;
}

const DNF_OPTIONS: { label: string; value: FilterState['dnfFilter'] }[] = [
  { label: 'All Race Outcomes', value: 'ALL' },
  { label: 'Classified Finishes Only', value: 'FINISHED' },
  { label: 'Any Retirement / DNF', value: 'ANY_DNF' },
  { label: 'Engine & Power Unit', value: 'Engine' },
  { label: 'Racing Collision', value: 'Collision' },
  { label: 'Gearbox / Transmission', value: 'Gearbox' },
  { label: 'Hydraulics Failure', value: 'Hydraulics' },
  { label: 'Brakes / Suspension', value: 'Brakes' },
  { label: 'Electrical Issue', value: 'Electrical' },
  { label: 'Accident / Spin', value: 'Accident' },
];

const METRIC_OPTIONS: { label: string; value: PerformanceMetric; short: string }[] = [
  { label: 'Total Points', value: 'points', short: 'PTS' },
  { label: 'Points Per Race (PPR)', value: 'ppr', short: 'PPR' },
  { label: 'Grand Prix Wins', value: 'wins', short: 'WINS' },
  { label: 'Podium Finishes', value: 'podiums', short: 'POD' },
  { label: 'Reliability (Finish %)', value: 'reliability', short: 'REL%' },
  { label: 'Average Finish Position', value: 'avgFinish', short: 'AVG POS' },
];

const TOP_N_OPTIONS = [5, 10, 15, 20, 999];

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, analytics }) => {
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [lastExportedFile, setLastExportedFile] = useState<string | null>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setIsExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExport = (type: 'drivers' | 'constructors' | 'complete') => {
    if (!analytics) return;
    const filename = downloadFilteredCsv(analytics, filters, type);
    setLastExportedFile(filename);
    setIsExportOpen(false);
    setTimeout(() => {
      setLastExportedFile(null);
    }, 4000);
  };
  const toggleSeason = (season: number) => {
    setFilters((prev) => {
      const isSelected = prev.seasons.includes(season);
      if (isSelected) {
        // If unselecting, ensure we don't end up empty (or if empty, means all)
        const updated = prev.seasons.filter((s) => s !== season);
        return { ...prev, seasons: updated };
      } else {
        return { ...prev, seasons: [...prev.seasons, season] };
      }
    });
  };

  const handleSelectAllSeasons = () => {
    setFilters((prev) => ({ ...prev, seasons: [] })); // [] means all
  };

  const isAllSeasons = filters.seasons.length === 0 || filters.seasons.length === SEASONS.length;

  return (
    <div className="bg-[#12161f] border-b border-white/10 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-3">
        {/* Top Controls Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Season Filter (Year of Race Date) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              <Filter className="w-3.5 h-3.5 text-[#E10600]" />
              <span>Year / Season:</span>
            </span>

            <div className="flex items-center gap-1 p-0.5 bg-[#0b0d12] border border-white/10 rounded-md">
              <button
                onClick={handleSelectAllSeasons}
                className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                  isAllSeasons
                    ? 'bg-[#E10600] text-white shadow'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                All (2018–24)
              </button>

              {SEASONS.map((season) => {
                const isSelected = !isAllSeasons && filters.seasons.includes(season);
                return (
                  <button
                    key={season}
                    onClick={() => toggleSeason(season)}
                    className={`px-2 py-1 text-xs font-mono font-medium rounded transition-colors ${
                      isSelected
                        ? 'bg-white/20 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {season}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Top N Parameter */}
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span>Top N Parameter:</span>
            </span>

            <div className="flex items-center gap-1 p-0.5 bg-[#0b0d12] border border-white/10 rounded-md">
              {TOP_N_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setFilters((prev) => ({ ...prev, topN: n }))}
                  className={`px-2 py-1 text-xs font-mono rounded transition-colors ${
                    filters.topN === n
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {n === 999 ? 'All' : `Top ${n}`}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Switcher Parameter */}
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Rank Metric:
            </span>
            <select
              value={filters.selectedMetric}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  selectedMetric: e.target.value as PerformanceMetric,
                }))
              }
              className="bg-[#0b0d12] border border-white/15 text-white text-xs rounded-md px-2.5 py-1 focus:outline-none focus:border-[#E10600] cursor-pointer"
            >
              {METRIC_OPTIONS.map((m) => (
                <option key={m.value} value={m.value} className="bg-[#12161f]">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bottom Controls Row: DNF Category, Team Filter, and Search */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
          <div className="flex flex-wrap items-center gap-2">
            {/* DNF Reason Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                DNF Filter:
              </span>
              <select
                value={filters.dnfFilter}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    dnfFilter: e.target.value as FilterState['dnfFilter'],
                  }))
                }
                className="bg-[#0b0d12] border border-white/15 text-slate-200 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:border-[#E10600] cursor-pointer"
              >
                {DNF_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-[#12161f]">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Constructor Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Constructor:
              </span>
              <select
                value={filters.selectedConstructor || ''}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    selectedConstructor: e.target.value === '' ? null : e.target.value,
                  }))
                }
                className="bg-[#0b0d12] border border-white/15 text-slate-200 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:border-[#E10600] cursor-pointer"
              >
                <option value="" className="bg-[#12161f]">
                  All Constructors (10 Teams)
                </option>
                {CONSTRUCTORS.map((c) => (
                  <option key={c.id} value={c.name} className="bg-[#12161f]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Action Controls: Search & Export Data */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {/* Quick Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search driver, team..."
                value={filters.searchQuery}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                }
                className="w-full bg-[#0b0d12] border border-white/15 rounded-md pl-8 pr-7 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#E10600]"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Export Data Button & Dropdown */}
            <div className="relative" ref={exportRef}>
              <button
                onClick={() => setIsExportOpen(!isExportOpen)}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md bg-[#1d232f] hover:bg-[#252d3d] text-emerald-400 border border-emerald-500/30 transition-all shadow-sm shadow-emerald-950/40"
                title="Download current filtered view as CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Export Data</span>
                <ChevronDown className={`w-3 h-3 text-emerald-400 transition-transform ${isExportOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isExportOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-72 bg-[#12161f] border border-white/15 rounded-lg shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
                    <span>Export Filtered View</span>
                    <span className="text-[10px] text-emerald-400 font-mono">CSV FORMAT</span>
                  </div>

                  <div className="py-1 space-y-0.5">
                    {/* Option 1: Drivers */}
                    <button
                      onClick={() => handleExport('drivers')}
                      className="w-full text-left px-2.5 py-2 rounded-md hover:bg-white/10 transition-colors flex items-start gap-2.5 text-xs text-slate-200 group"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-white group-hover:text-emerald-300">
                          Filtered Drivers (Top {filters.topN === 999 ? 'All' : filters.topN})
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                          Points, PPR, wins, podiums, reliability %, and DNF failure modes.
                        </div>
                      </div>
                    </button>

                    {/* Option 2: Constructors */}
                    <button
                      onClick={() => handleExport('constructors')}
                      className="w-full text-left px-2.5 py-2 rounded-md hover:bg-white/10 transition-colors flex items-start gap-2.5 text-xs text-slate-200 group"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-white group-hover:text-amber-300">
                          Filtered Constructors View
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                          Team standings, wins, podiums, and reliability rates.
                        </div>
                      </div>
                    </button>

                    {/* Option 3: Complete Telemetry */}
                    <button
                      onClick={() => handleExport('complete')}
                      className="w-full text-left px-2.5 py-2 rounded-md hover:bg-white/10 transition-colors flex items-start gap-2.5 text-xs text-slate-200 group border-t border-white/5"
                    >
                      <Download className="w-4 h-4 text-[#E10600] mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-white group-hover:text-red-300">
                          Complete Telemetry Package
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                          Header KPI metadata + drivers + constructors dataset.
                        </div>
                      </div>
                    </button>
                  </div>

                  <div className="px-2.5 py-1 text-[10px] text-slate-400 border-t border-white/10 mt-1 flex items-center justify-between font-mono">
                    <span>{analytics?.drivers.length || 0} Drivers matched</span>
                    <span>{analytics?.kpis.seasonsLabel}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Export Success Notification Banner */}
        {lastExportedFile && (
          <div className="mt-1 p-2 bg-emerald-950/80 border border-emerald-500/40 rounded-md text-xs text-emerald-300 flex items-center justify-between gap-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Downloaded filtered CSV: <strong className="text-white font-mono">{lastExportedFile}</strong>
              </span>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-mono uppercase">Ready in Downloads</span>
          </div>
        )}
      </div>
    </div>
  );
};
