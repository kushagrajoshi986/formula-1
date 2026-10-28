import React, { useState } from 'react';
import { Database, CheckCircle, Code2, BookOpen, Layers, FileSpreadsheet, ShieldAlert } from 'lucide-react';

interface DataDictionaryModalProps {
  onClose?: () => void;
}

export const DataDictionaryModal: React.FC<DataDictionaryModalProps> = () => {
  const [activeSubtab, setActiveSubtab] = useState<'calculated_fields' | 'data_model' | 'cleaning_rules'>('calculated_fields');

  const calculatedFields = [
    {
      name: 'Points Per Race (PPR)',
      formula: 'SUM([Points]) / COUNT([Race Starts])',
      description: 'Measures driver and team scoring efficiency per Grand Prix entered, eliminating bias from varying race counts.',
      datatype: 'Continuous Float (e.g. 18.46)',
      role: 'Measure',
    },
    {
      name: 'Driver Reliability Rate (%)',
      formula: 'SUM([Classified Finishes]) / COUNT([Race Starts]) * 100',
      description: 'Percentage of Grand Prix starts where the driver crossed the chequered flag or completed >= 90% race distance.',
      datatype: 'Continuous Percentage (0.0% – 100.0%)',
      role: 'Measure',
    },
    {
      name: 'Podium Conversion Ratio',
      formula: 'SUM([Podium Finishes]) / COUNT([Race Starts]) * 100',
      description: 'Frequency of converting race starts into top-3 silverware on the podium.',
      datatype: 'Continuous Percentage',
      role: 'Measure',
    },
    {
      name: 'Win Conversion Efficiency',
      formula: 'SUM([Race Wins]) / SUM([Podium Finishes]) * 100',
      description: 'Rate at which a driver or constructor transforms podium finishes into race victories.',
      datatype: 'Continuous Percentage',
      role: 'Measure',
    },
    {
      name: 'Mechanical Failure Ratio',
      formula: '(SUM([Engine]) + SUM([Power Unit]) + SUM([Gearbox]) + SUM([Hydraulics])) / COUNT([DNFs])',
      description: 'Distinguishes chassis/powertrain mechanical unreliability from on-track racing incidents and collisions.',
      datatype: 'Continuous Percentage',
      role: 'Measure',
    },
    {
      name: 'Top N Parameter Selector',
      formula: 'RANK_UNIQUE([Selected Metric], \'desc\') <= [Parameters].[Top N Parameter]',
      description: 'Dynamic Tableau parameter filter enabling users to isolate Top 5, 10, 15, or All ranked entities.',
      datatype: 'Boolean (True / False)',
      role: 'Filter Calculation',
    },
    {
      name: 'Tyre Degradation Delta',
      formula: '([Final Stint Lap Time] - [Initial Outlap Pace]) / [Stint Length In Laps]',
      description: 'Pirelli compound thermal wear penalty in tenths of a second per completed lap.',
      datatype: 'Continuous Float (+0.07s/lap)',
      role: 'Measure',
    },
  ];

  const dataTables = [
    {
      tableName: 'Fact_RaceOutcomes',
      rows: '2,880 rows',
      columns: 'RaceId, Season, Round, DriverId, ConstructorId, Grid, Position, Status, DnfCategory, Points, Laps',
      grain: 'One row per driver entry per Grand Prix round',
    },
    {
      tableName: 'Dim_Drivers',
      rows: '20 active (40 historic)',
      columns: 'DriverId, DriverName, Code, PermanentNumber, Nationality, CountryCode, CurrentTeam',
      grain: 'One row per Formula 1 driver',
    },
    {
      tableName: 'Dim_Constructors',
      rows: '10 teams',
      columns: 'ConstructorId, ConstructorName, Country, ColorHex, EngineSupplier, BaseLocation',
      grain: 'One row per constructor team',
    },
    {
      tableName: 'Dim_Circuits',
      rows: '24 circuits',
      columns: 'CircuitId, CircuitName, Location, Country, Lat, Lng, LengthKm, Turns, DownforceLevel, AbrasionRating',
      grain: 'One row per Grand Prix venue',
    },
    {
      tableName: 'Fact_TyreTelemetry',
      rows: '10,725 stints',
      columns: 'StintId, RaceId, DriverId, Compound, StintLength, TotalLaps, FastestLapAchieved, DegradationRate',
      grain: 'One row per tyre compound stint executed',
    },
  ];

  const cleaningLogs = [
    {
      item: 'Driver Name & Identity Normalization',
      action: 'Standardized alphanumeric IDs (e.g., VER: Max Verstappen, HAM: Lewis Hamilton) across constructor changes (Vettel Ferrari → Aston Martin, Alonso Alpine → Aston Martin, Russell Williams → Mercedes).',
      status: 'Cleaned & Verified',
    },
    {
      item: 'DNF Reason Reclassification',
      action: 'Consolidated granular FIA status codes into 5 standardized analytical categories: Classified Finished, Power Unit/Engine, Racing Collision, Gearbox/Hydraulics, and Brakes/Suspension/Other.',
      status: 'Cleaned & Verified',
    },
    {
      item: 'Cancelled & Sprint Races Handling',
      action: 'Isolated Sunday Grand Prix outcomes from Saturday sprint points to maintain longitudinal consistency across seasons with varying sprint formats (2021–2024).',
      status: 'Cleaned & Verified',
    },
    {
      item: 'Circuit Geographic Coordinates',
      action: 'Validated latitude/longitude projections for all 24 Grand Prix circuits to ensure accurate spatial rendering on both Web Mercator and Tableau Robinson maps.',
      status: 'Cleaned & Verified',
    },
  ];

  return (
    <div className="bg-[#141822] border border-white/10 rounded-xl p-4 lg:p-6 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#E10600]/10 border border-[#E10600]/30 text-[#E10600]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest px-1.5 py-0.5 bg-emerald-950/60 rounded border border-emerald-500/20">
                Analytical Accuracy & Methodology
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-wide mt-0.5">
              Data Model, Calculated Fields & Cleaning Audit
            </h2>
          </div>
        </div>

        {/* Subtabs */}
        <div className="flex items-center gap-1 bg-[#0b0e14] border border-white/10 rounded-lg p-1 text-xs">
          <button
            onClick={() => setActiveSubtab('calculated_fields')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeSubtab === 'calculated_fields'
                ? 'bg-[#E10600] text-white font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Calculated Fields (7)
          </button>
          <button
            onClick={() => setActiveSubtab('data_model')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeSubtab === 'data_model'
                ? 'bg-[#E10600] text-white font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Data Model ER Schema
          </button>
          <button
            onClick={() => setActiveSubtab('cleaning_rules')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeSubtab === 'cleaning_rules'
                ? 'bg-[#E10600] text-white font-medium'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Data Cleaning & Integrity
          </button>
        </div>
      </div>

      {/* Subtab 1: Calculated Fields */}
      {activeSubtab === 'calculated_fields' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            All performance metrics and KPI values in this dashboard are governed by explicit mathematical formulas, verified against official FIA Formula 1 season records.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {calculatedFields.map((field, idx) => (
              <div
                key={idx}
                className="bg-[#0b0e14] border border-white/10 rounded-lg p-3.5 space-y-2 hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {field.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-300">
                    {field.role}
                  </span>
                </div>

                <div className="p-2 bg-black/40 rounded border border-white/5 font-mono text-xs text-emerald-400 overflow-x-auto">
                  <code>{field.formula}</code>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {field.description}
                </p>

                <div className="text-[10px] text-slate-400 font-mono">
                  Output Format: {field.datatype}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 2: Data Model ER Schema */}
      {activeSubtab === 'data_model' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Relational star schema connecting fact tables (Race Outcomes, Tyre Telemetry) to dimensional entities (Drivers, Constructors, Circuits) through primary surrogate keys.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-white/15 bg-white/5 text-white font-mono uppercase text-[11px]">
                  <th className="p-3">Table Name</th>
                  <th className="p-3">Record Count</th>
                  <th className="p-3">Key Attribute Fields</th>
                  <th className="p-3">Granularity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {dataTables.map((t, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="p-3 font-bold text-white font-mono">{t.tableName}</td>
                    <td className="p-3 font-mono text-emerald-400">{t.rows}</td>
                    <td className="p-3 font-mono text-slate-400 text-[11px]">{t.columns}</td>
                    <td className="p-3 text-slate-400">{t.grain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 3: Cleaning & Integrity */}
      {activeSubtab === 'cleaning_rules' && (
        <div className="space-y-4">
          <p className="text-xs text-slate-400">
            Audit log of data sanitization, missing value imputation, deduplication, and format standardization conducted prior to workbook publishing.
          </p>

          <div className="space-y-3">
            {cleaningLogs.map((log, i) => (
              <div
                key={i}
                className="bg-[#0b0e14] border border-white/10 rounded-lg p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white text-xs sm:text-sm">
                      {log.item}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pl-6">
                    {log.action}
                  </p>
                </div>

                <span className="self-start sm:self-auto px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-semibold whitespace-nowrap">
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
