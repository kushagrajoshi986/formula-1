import React from 'react';
import { Users, Calendar, Flag, MapPin, ShieldCheck, Trophy, Sparkles } from 'lucide-react';
import { FilteredAnalytics } from '../utils/analytics';

interface KpiSummaryProps {
  analytics: FilteredAnalytics;
}

export const KpiSummary: React.FC<KpiSummaryProps> = ({ analytics }) => {
  const { kpis } = analytics;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3.5 mb-6">
      {/* 1. Competing Teams */}
      <div className="bg-[#141822] border border-white/10 rounded-lg p-3.5 relative overflow-hidden group hover:border-white/20 transition-all">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#1E41FF]"></div>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Competing Teams</span>
          <Users className="w-4 h-4 text-[#1E41FF]" />
        </div>
        <div className="text-2xl font-black text-white font-mono tracking-tight">
          {kpis.competingTeams}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
          Constructors active on grid
        </div>
      </div>

      {/* 2. Seasons Covered */}
      <div className="bg-[#141822] border border-white/10 rounded-lg p-3.5 relative overflow-hidden group hover:border-white/20 transition-all">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#E10600]"></div>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Seasons Covered</span>
          <Calendar className="w-4 h-4 text-[#E10600]" />
        </div>
        <div className="text-2xl font-black text-white font-mono tracking-tight">
          {kpis.seasonsCount}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 truncate font-mono">
          {kpis.seasonsLabel}
        </div>
      </div>

      {/* 3. Race Outcomes Recorded */}
      <div className="bg-[#141822] border border-white/10 rounded-lg p-3.5 relative overflow-hidden group hover:border-white/20 transition-all">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#00D2BE]"></div>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Race Outcomes</span>
          <Flag className="w-4 h-4 text-[#00D2BE]" />
        </div>
        <div className="text-2xl font-black text-white font-mono tracking-tight">
          {kpis.raceOutcomesRecorded.toLocaleString()}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
          Driver starts & classifications
        </div>
      </div>

      {/* 4. Circuits Represented */}
      <div className="bg-[#141822] border border-white/10 rounded-lg p-3.5 relative overflow-hidden group hover:border-white/20 transition-all">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#FF8700]"></div>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Circuits Represented</span>
          <MapPin className="w-4 h-4 text-[#FF8700]" />
        </div>
        <div className="text-2xl font-black text-white font-mono tracking-tight">
          {kpis.circuitsRepresented}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
          Across 21 sovereign nations
        </div>
      </div>

      {/* 5. Driver Reliability Index */}
      <div className="bg-[#141822] border border-white/10 rounded-lg p-3.5 relative overflow-hidden group hover:border-white/20 transition-all">
        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Grid Reliability</span>
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="text-2xl font-black text-emerald-400 font-mono tracking-tight">
          {kpis.overallReliabilityPct}%
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
          Classified finish rate
        </div>
      </div>

      {/* 6. Total Podiums / Silverware */}
      <div className="bg-[#141822] border border-white/10 rounded-lg p-3.5 relative overflow-hidden group hover:border-white/20 transition-all">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Podiums Awarded</span>
          <Trophy className="w-4 h-4 text-amber-400" />
        </div>
        <div className="text-2xl font-black text-amber-400 font-mono tracking-tight">
          {kpis.totalPodiums}
        </div>
        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
          Top-3 silverware finishes
        </div>
      </div>
    </div>
  );
};
