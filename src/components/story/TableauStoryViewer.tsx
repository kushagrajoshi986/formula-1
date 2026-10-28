import React, { useState, useEffect } from 'react';
import { STORY_POINTS, CONSTRUCTORS, DRIVERS } from '../../data/f1Data';
import { GlobalDriverMap } from '../charts/GlobalDriverMap';
import { CountryParticipationChart } from '../charts/CountryParticipationChart';
import { ChampionshipPerformance } from '../charts/ChampionshipPerformance';
import { DriverReliabilityChart } from '../charts/DriverReliabilityChart';
import { PodiumAchievementsChart } from '../charts/PodiumAchievementsChart';
import { TyreCompoundUsage } from '../charts/TyreCompoundUsage';
import { TeamPerformanceRanking } from '../charts/TeamPerformanceRanking';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Maximize2,
  Minimize2,
  Sparkles,
  Info,
  CheckCircle,
  BarChart3,
} from 'lucide-react';

export const TableauStoryViewer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const activePoint = STORY_POINTS.find((s) => s.stepNumber === currentStep) || STORY_POINTS[0];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && currentStep < STORY_POINTS.length) {
        setCurrentStep((p) => p + 1);
      } else if (e.key === 'ArrowLeft' && currentStep > 1) {
        setCurrentStep((p) => p - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep]);

  const renderVisual = (focus: string) => {
    switch (focus) {
      case 'map':
        return <GlobalDriverMap />;
      case 'country_participation':
        return <CountryParticipationChart />;
      case 'team_championship':
        return <ChampionshipPerformance constructors={CONSTRUCTORS} />;
      case 'driver_reliability':
        return <DriverReliabilityChart drivers={DRIVERS} topN={15} />;
      case 'podiums':
        return <PodiumAchievementsChart drivers={DRIVERS} constructors={CONSTRUCTORS} topN={15} />;
      case 'tyres':
        return <TyreCompoundUsage />;
      case 'team_ranking':
        return <TeamPerformanceRanking constructors={CONSTRUCTORS} topN={10} />;
      default:
        return <GlobalDriverMap />;
    }
  };

  return (
    <div
      className={`bg-[#0c0e13] flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 p-4 lg:p-6 overflow-y-auto' : 'space-y-4'
      }`}
    >
      {/* Story Title & Top Banner */}
      <div className="bg-[#141822] border border-white/10 rounded-xl p-4 lg:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-white/10 pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#E10600]/10 border border-[#E10600]/30 text-[#E10600]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest px-1.5 py-0.5 bg-emerald-950/60 rounded border border-emerald-500/20">
                  Tableau Story Companion
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Story Point {currentStep} of {STORY_POINTS.length}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide mt-0.5">
                Formula 1 Race Intelligence: From Global Overview to Championship Success
              </h2>
            </div>
          </div>

          {/* Stepper Controls & Fullscreen */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a202c] border border-white/10 text-white hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="font-mono text-xs text-slate-300 px-2">
              {currentStep} / {STORY_POINTS.length}
            </span>

            <button
              onClick={() => setCurrentStep((p) => Math.min(STORY_POINTS.length, p + 1))}
              disabled={currentStep === STORY_POINTS.length}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#E10600] text-white hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md shadow-[#E10600]/20"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title="Toggle Fullscreen Presentation"
              className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Story Point Stepper Ribbon (Tableau Story Navigation Bar) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5">
          {STORY_POINTS.map((sp) => {
            const isActive = sp.stepNumber === currentStep;
            return (
              <button
                key={sp.id}
                onClick={() => setCurrentStep(sp.stepNumber)}
                className={`text-left p-2 rounded-lg border text-xs transition-all relative overflow-hidden ${
                  isActive
                    ? 'bg-[#1b2230] border-[#E10600] text-white shadow-md'
                    : 'bg-[#0f131a] border-white/5 text-slate-400 hover:text-slate-200 hover:border-white/15'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#E10600]" />
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-mono text-[10px] font-bold ${isActive ? 'text-[#E10600]' : 'text-slate-500'}`}>
                    0{sp.stepNumber}
                  </span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                </div>
                <div className="font-semibold line-clamp-2 text-[11px] leading-snug">
                  {sp.title.split(':')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Story Point Content & Embedded Visual */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Narrative & Insights Panel */}
        <div className="lg:col-span-4 bg-[#141822] border border-white/10 rounded-xl p-4 lg:p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono mb-1">
              <span>Chapter {activePoint.stepNumber}</span>
              <span aria-hidden="true">·</span>
              <span>Tableau Analytical Story</span>
            </div>

            <h3 className="text-lg font-bold text-white tracking-wide mb-1">
              {activePoint.title}
            </h3>

            <p className="text-xs text-slate-400 italic mb-3">
              {activePoint.subtitle}
            </p>

            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 border-t border-white/10 pt-3">
              <p>{activePoint.narrative}</p>
            </div>

            {/* Analytical Takeaway Callout */}
            <div className="mt-4 p-3 bg-[#0d1017] border-l-2 border-[#E10600] rounded-r-lg">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-white mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#E10600]" />
                <span>Executive Insight</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                {activePoint.analyticalInsight}
              </p>
            </div>
          </div>

          {/* Key Metrics Matrix */}
          <div className="space-y-2 border-t border-white/10 pt-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Story Point Telemetry
            </span>
            <div className="grid grid-cols-1 gap-2">
              {activePoint.keyMetrics.map((km, i) => (
                <div key={i} className="bg-white/5 border border-white/5 rounded-lg p-2.5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block">{km.label}</span>
                    {km.detail && <span className="text-[10px] text-slate-400">{km.detail}</span>}
                  </div>
                  <span className="font-mono font-bold text-white text-sm">
                    {km.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Focus Area */}
        <div className="lg:col-span-8 min-h-[480px]">
          {renderVisual(activePoint.visualFocus)}
        </div>
      </div>
    </div>
  );
};
