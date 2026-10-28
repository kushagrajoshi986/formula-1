import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { KpiSummary } from './components/KpiSummary';
import { GlobalDriverMap } from './components/charts/GlobalDriverMap';
import { CountryParticipationChart } from './components/charts/CountryParticipationChart';
import { DriverReliabilityChart } from './components/charts/DriverReliabilityChart';
import { DriverPerformanceLeaderboard } from './components/charts/DriverPerformanceLeaderboard';
import { TeamPerformanceRanking } from './components/charts/TeamPerformanceRanking';
import { ChampionshipPerformance } from './components/charts/ChampionshipPerformance';
import { TyreCompoundUsage } from './components/charts/TyreCompoundUsage';
import { PodiumAchievementsChart } from './components/charts/PodiumAchievementsChart';
import { TableauStoryViewer } from './components/story/TableauStoryViewer';
import { DataDictionaryModal } from './components/DataDictionaryModal';
import { TableauPublicModal } from './components/TableauPublicModal';
import { FilterState } from './types/f1';
import { computeAnalytics, downloadFilteredCsv } from './utils/analytics';
import { SEASONS } from './data/f1Data';

const INITIAL_FILTERS: FilterState = {
  seasons: [], // empty = all seasons
  dnfFilter: 'ALL',
  topN: 10,
  selectedConstructor: null,
  selectedDriver: null,
  selectedMetric: 'points',
  searchQuery: '',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'story' | 'datamodel' | 'tableau_public'>('dashboard');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  // Compute filtered analytics
  const analytics = useMemo(() => computeAnalytics(filters), [filters]);

  const hasActiveFilters = useMemo(() => {
    return (
      (filters.seasons.length > 0 && filters.seasons.length < SEASONS.length) ||
      filters.dnfFilter !== 'ALL' ||
      filters.topN !== 10 ||
      filters.selectedConstructor !== null ||
      filters.selectedDriver !== null ||
      filters.selectedMetric !== 'points' ||
      filters.searchQuery.trim() !== ''
    );
  }, [filters]);

  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handleQuickExport = () => {
    downloadFilteredCsv(analytics, filters, 'complete');
  };

  return (
    <div className="min-h-screen bg-[#090b0e] text-slate-100 flex flex-col font-sans selection:bg-[#E10600] selection:text-white">
      {/* Top Motorsport Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
        onExport={handleQuickExport}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 lg:px-8 py-5">
        {activeTab === 'dashboard' && (
          <div className="space-y-5">
            {/* Interactive Tableau Filters */}
            <FilterBar filters={filters} setFilters={setFilters} analytics={analytics} />

            {/* KPI Summary Cards */}
            <KpiSummary analytics={analytics} />

            {/* Dashboard Visualizations Grid */}
            <div className="space-y-5">
              {/* Row 1: Global Driver Distribution Map & Country Participation */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7">
                  <GlobalDriverMap
                    onSelectCountry={(country) => {
                      setFilters((prev) => ({
                        ...prev,
                        searchQuery: prev.searchQuery === country ? '' : country,
                      }));
                    }}
                  />
                </div>
                <div className="lg:col-span-5">
                  <CountryParticipationChart />
                </div>
              </div>

              {/* Row 2: Driver Reliability Analysis & Driver Performance Leaderboard */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7">
                  <DriverReliabilityChart
                    drivers={analytics.drivers}
                    topN={filters.topN}
                  />
                </div>
                <div className="lg:col-span-5">
                  <DriverPerformanceLeaderboard
                    drivers={analytics.drivers}
                    selectedMetric={filters.selectedMetric}
                    topN={filters.topN}
                  />
                </div>
              </div>

              {/* Row 3: Team Performance Ranking & Championship Progression */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-5">
                  <TeamPerformanceRanking
                    constructors={analytics.constructors}
                    topN={filters.topN}
                  />
                </div>
                <div className="lg:col-span-7">
                  <ChampionshipPerformance
                    constructors={analytics.constructors}
                  />
                </div>
              </div>

              {/* Row 4: Tyre Compound Usage Distribution & Podium Achievements Bubble Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-5">
                  <TyreCompoundUsage />
                </div>
                <div className="lg:col-span-7">
                  <PodiumAchievementsChart
                    drivers={analytics.drivers}
                    constructors={analytics.constructors}
                    topN={filters.topN}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tableau Story Mode */}
        {activeTab === 'story' && <TableauStoryViewer />}

        {/* Data Model & Calculated Fields */}
        {activeTab === 'datamodel' && <DataDictionaryModal />}

        {/* Tableau Public Portal & Verified Link */}
        {activeTab === 'tableau_public' && <TableauPublicModal />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-[#0c0e12] px-4 lg:px-8 py-4 text-xs text-slate-400">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wider">FORMULA 1 RACE INTELLIGENCE</span>
            <span aria-hidden="true">·</span>
            <span>Tableau Desktop & Public Deployment</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
            <span>Dataset: 2018–2024 FIA World Championship</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">All Visualizations Validated</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
