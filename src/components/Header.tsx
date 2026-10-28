import React from 'react';
import { LayoutDashboard, BookOpen, Database, Share2, RotateCcw, Trophy, Activity, Globe2, Download } from 'lucide-react';

interface HeaderProps {
  activeTab: 'dashboard' | 'story' | 'datamodel' | 'tableau_public';
  setActiveTab: (tab: 'dashboard' | 'story' | 'datamodel' | 'tableau_public') => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  onExport?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onResetFilters,
  hasActiveFilters,
  onExport,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0e12]/95 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Branding & Logo */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center justify-center w-10 h-10 rounded bg-[#E10600] text-white font-black tracking-tighter text-xl shadow-lg shadow-[#E10600]/30 select-none">
            F1
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-wider text-white uppercase font-sans">
                Formula 1 Race Intelligence
              </h1>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono tracking-widest text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 rounded uppercase">
                Tableau Desktop Pro
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Motorsport Analytics Platform</span>
              <span aria-hidden="true">·</span>
              <span>2018–2024 Era Telemetry</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#E10600] font-medium">FIA / Ergast Verified</span>
            </div>
          </div>
        </div>

        {/* View Switcher Navigation */}
        <div className="flex items-center gap-1.5 p-1 bg-[#151922] border border-white/10 rounded-lg overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-[#E10600] text-white shadow-md shadow-[#E10600]/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Interactive Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('story')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
              activeTab === 'story'
                ? 'bg-[#E10600] text-white shadow-md shadow-[#E10600]/30'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tableau Story (7 Points)</span>
          </button>

          <button
            onClick={() => setActiveTab('datamodel')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'datamodel'
                ? 'bg-white/15 text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Data Model & Calculations</span>
          </button>

          <button
            onClick={() => setActiveTab('tableau_public')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              activeTab === 'tableau_public'
                ? 'bg-[#E10600]/20 text-[#ff4c45] border border-[#E10600]/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Tableau Public Portal</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {onExport && (
            <button
              onClick={onExport}
              title="Export current filtered view to CSV"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 rounded-md transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          )}

          {hasActiveFilters && (
            <button
              onClick={onResetFilters}
              title="Reset all filters to default"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-md transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}

          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 bg-white/5 border border-white/10 rounded-md text-[11px] text-slate-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>LIVE SYNC</span>
          </div>
        </div>
      </div>
    </header>
  );
};
