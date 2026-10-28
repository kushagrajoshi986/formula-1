import { Driver, Constructor, Circuit, FilterState, DNFCategory, PerformanceMetric } from '../types/f1';
import { DRIVERS, CONSTRUCTORS, CIRCUITS, SEASONS } from '../data/f1Data';

export interface FilteredAnalytics {
  kpis: {
    competingTeams: number;
    seasonsCount: number;
    seasonsLabel: string;
    raceOutcomesRecorded: number;
    circuitsRepresented: number;
    overallReliabilityPct: number;
    totalPodiums: number;
    totalWins: number;
  };
  drivers: Driver[];
  constructors: Constructor[];
  circuits: Circuit[];
}

export function computeAnalytics(filters: FilterState): FilteredAnalytics {
  const selectedSeasons = filters.seasons.length > 0 ? filters.seasons : SEASONS;
  const seasonRatio = selectedSeasons.length / SEASONS.length;

  // Filter and adjust constructors based on seasons
  let filteredConstructors = CONSTRUCTORS.map((c) => {
    // Sum points for selected seasons
    const pointsInSeasons = selectedSeasons.reduce((sum, s) => sum + (c.seasonPoints[s] || 0), 0);
    // Scale wins, podiums, starts, dnfs proportionally to season points if multi-season filtered
    const factor = c.points > 0 ? pointsInSeasons / c.points : seasonRatio;
    
    return {
      ...c,
      points: Number(pointsInSeasons.toFixed(1)),
      wins: Math.round(c.wins * factor),
      podiums: Math.round(c.podiums * factor),
      dnfCount: Math.round(c.dnfCount * factor),
      starts: Math.round(c.starts * seasonRatio),
    };
  });

  if (filters.selectedConstructor) {
    filteredConstructors = filteredConstructors.filter((c) => c.name === filters.selectedConstructor || c.id === filters.selectedConstructor);
  }

  // Filter and scale drivers
  let filteredDrivers = DRIVERS.map((d) => {
    // Adjust driver metrics if seasons are filtered
    const factor = seasonRatio;
    const scaledPoints = Number((d.points * factor).toFixed(1));
    const scaledStarts = Math.max(1, Math.round(d.starts * factor));
    const scaledWins = Math.round(d.wins * factor);
    const scaledPodiums = Math.round(d.podiums * factor);

    // Apply DNF breakdown scaling
    const adjustedBreakdown: Record<DNFCategory, number> = {} as any;
    (Object.keys(d.dnfBreakdown) as DNFCategory[]).forEach((cat) => {
      adjustedBreakdown[cat] = Math.max(0, Math.round(d.dnfBreakdown[cat] * factor));
    });

    const scaledDnf = Math.round(d.dnfCount * factor);

    return {
      ...d,
      starts: scaledStarts,
      points: scaledPoints,
      wins: scaledWins,
      podiums: scaledPodiums,
      dnfCount: scaledDnf,
      dnfBreakdown: adjustedBreakdown,
    };
  });

  // Apply DNF Category filter to drivers if specific non-finish reason is selected
  if (filters.dnfFilter !== 'ALL') {
    if (filters.dnfFilter === 'FINISHED') {
      filteredDrivers = filteredDrivers.filter((d) => d.dnfBreakdown.Finished > 0);
    } else if (filters.dnfFilter === 'ANY_DNF') {
      filteredDrivers = filteredDrivers.filter((d) => d.dnfCount > 0);
    } else {
      const cat = filters.dnfFilter as DNFCategory;
      filteredDrivers = filteredDrivers.filter((d) => (d.dnfBreakdown[cat] || 0) > 0);
    }
  }

  // Filter by selected constructor if applicable
  if (filters.selectedConstructor) {
    filteredDrivers = filteredDrivers.filter((d) => d.currentTeam.toLowerCase().includes(filters.selectedConstructor!.toLowerCase()));
  }

  // Filter by search query
  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    filteredDrivers = filteredDrivers.filter((d) => 
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.currentTeam.toLowerCase().includes(q) ||
      d.nationality.toLowerCase().includes(q)
    );
  }

  // Sort drivers based on selected metric
  filteredDrivers.sort((a, b) => {
    switch (filters.selectedMetric) {
      case 'points':
        return b.points - a.points;
      case 'ppr':
        return (b.points / Math.max(1, b.starts)) - (a.points / Math.max(1, a.starts));
      case 'wins':
        return b.wins - a.wins;
      case 'podiums':
        return b.podiums - a.podiums;
      case 'reliability': {
        const relA = a.dnfBreakdown.Finished / Math.max(1, a.starts);
        const relB = b.dnfBreakdown.Finished / Math.max(1, b.starts);
        return relB - relA;
      }
      case 'avgFinish':
        return a.avgFinishPos - b.avgFinishPos; // lower is better
      default:
        return b.points - a.points;
    }
  });

  // Sort constructors by points
  filteredConstructors.sort((a, b) => b.points - a.points);

  // Compute KPIs
  const totalStarts = filteredDrivers.reduce((acc, d) => acc + d.starts, 0);
  const totalFinished = filteredDrivers.reduce((acc, d) => acc + (d.dnfBreakdown.Finished || 0), 0);
  const totalPodiums = filteredDrivers.reduce((acc, d) => acc + d.podiums, 0);
  const totalWins = filteredDrivers.reduce((acc, d) => acc + d.wins, 0);
  const overallReliabilityPct = totalStarts > 0 ? (totalFinished / totalStarts) * 100 : 0;

  const seasonsCount = selectedSeasons.length;
  const seasonsLabel = selectedSeasons.length === SEASONS.length
    ? `${Math.min(...SEASONS)}–${Math.max(...SEASONS)} (${seasonsCount} Seasons)`
    : selectedSeasons.length === 1
    ? `Season ${selectedSeasons[0]}`
    : `${selectedSeasons.sort((a, b) => a - b).join(', ')}`;

  // Total race outcomes recorded (approx 20 cars * races per season * seasons)
  const outcomesCount = Math.round(totalStarts * 1.05);

  return {
    kpis: {
      competingTeams: filteredConstructors.length,
      seasonsCount,
      seasonsLabel,
      raceOutcomesRecorded: outcomesCount,
      circuitsRepresented: CIRCUITS.length,
      overallReliabilityPct: Number(overallReliabilityPct.toFixed(1)),
      totalPodiums,
      totalWins,
    },
    drivers: filteredDrivers,
    constructors: filteredConstructors,
    circuits: CIRCUITS,
  };
}

export function formatMetricValue(val: number, metric: PerformanceMetric): string {
  switch (metric) {
    case 'points':
      return val.toLocaleString() + ' pts';
    case 'ppr':
      return val.toFixed(2) + ' pts/GP';
    case 'wins':
      return val + (val === 1 ? ' Win' : ' Wins');
    case 'podiums':
      return val + (val === 1 ? ' Podium' : ' Podiums');
    case 'reliability':
      return (val * 100).toFixed(1) + '% Finishes';
    case 'avgFinish':
      return 'P' + val.toFixed(1);
  }
}

export function generateFilteredCsv(analytics: FilteredAnalytics, filters: FilterState, entityType: 'drivers' | 'constructors' | 'complete' = 'drivers'): string {
  const displayDrivers = analytics.drivers.slice(0, filters.topN === 999 ? undefined : filters.topN);
  const displayConstructors = analytics.constructors.slice(0, filters.topN === 999 ? undefined : filters.topN);

  if (entityType === 'constructors') {
    const headers = [
      'Rank',
      'Constructor',
      'Country',
      'Starts',
      'Points',
      'Wins',
      'Podiums',
      'DNFs',
      'Reliability_Rate_Pct',
      'Championships',
      'Seasons_Filter',
    ].join(',');

    const rows = displayConstructors.map((c, idx) => {
      const relRate = c.starts > 0 ? (((c.starts - c.dnfCount) / c.starts) * 100).toFixed(1) : '0.0';
      return [
        idx + 1,
        `"${c.name}"`,
        `"${c.country}"`,
        c.starts,
        c.points,
        c.wins,
        c.podiums,
        c.dnfCount,
        `${relRate}%`,
        c.championships,
        `"${analytics.kpis.seasonsLabel}"`,
      ].join(',');
    });

    return `${headers}\n${rows.join('\n')}`;
  }

  // Driver performance metrics (default or complete)
  const driverHeaders = [
    'Rank',
    'Driver_Name',
    'Code',
    'Number',
    'Nationality',
    'Constructor',
    'Starts',
    'Points',
    'Points_Per_Race_PPR',
    'Wins',
    'Podiums',
    'Podium_Conversion_Pct',
    'Classified_Finishes',
    'Total_DNFs',
    'Reliability_Pct',
    'Engine_PU_Failures',
    'Collisions_Accidents',
    'Gearbox_Hydraulics_Failures',
    'Brakes_Suspension_Failures',
    'Average_Finish_Pos',
    'Seasons_Filter',
    'DNF_Filter',
    'Ranked_Metric',
  ].join(',');

  const driverRows = displayDrivers.map((d, idx) => {
    const starts = Math.max(1, d.starts);
    const finished = d.dnfBreakdown.Finished || 0;
    const relPct = ((finished / starts) * 100).toFixed(1);
    const ppr = (d.points / starts).toFixed(2);
    const podPct = ((d.podiums / starts) * 100).toFixed(1);
    const enginePU = (d.dnfBreakdown.Engine || 0) + (d.dnfBreakdown['Power Unit'] || 0);
    const collisions = (d.dnfBreakdown.Collision || 0) + (d.dnfBreakdown.Accident || 0);
    const transmission = (d.dnfBreakdown.Gearbox || 0) + (d.dnfBreakdown.Hydraulics || 0);
    const brakesSuspension = (d.dnfBreakdown.Brakes || 0) + (d.dnfBreakdown.Suspension || 0);

    return [
      idx + 1,
      `"${d.name}"`,
      `"${d.code}"`,
      d.number,
      `"${d.nationality}"`,
      `"${d.currentTeam}"`,
      d.starts,
      d.points,
      ppr,
      d.wins,
      d.podiums,
      `${podPct}%`,
      finished,
      d.dnfCount,
      `${relPct}%`,
      enginePU,
      collisions,
      transmission,
      brakesSuspension,
      `P${d.avgFinishPos}`,
      `"${analytics.kpis.seasonsLabel}"`,
      `"${filters.dnfFilter}"`,
      `"${filters.selectedMetric.toUpperCase()}"`,
    ].join(',');
  });

  if (entityType === 'complete') {
    // Include KPI metadata header
    const kpiSummary = [
      '# FORMULA 1 RACE INTELLIGENCE - FILTERED PERFORMANCE EXPORT',
      `# Generated_At: ${new Date().toISOString()}`,
      `# Seasons_Covered: ${analytics.kpis.seasonsLabel}`,
      `# Competing_Teams: ${analytics.kpis.competingTeams}`,
      `# Total_Race_Outcomes: ${analytics.kpis.raceOutcomesRecorded}`,
      `# Grid_Reliability: ${analytics.kpis.overallReliabilityPct}%`,
      `# Total_Podiums: ${analytics.kpis.totalPodiums}`,
      `# Total_Wins: ${analytics.kpis.totalWins}`,
      `# Filter_DNF_Category: ${filters.dnfFilter}`,
      `# Filter_Top_N: ${filters.topN === 999 ? 'All' : filters.topN}`,
      `# Filter_Constructor: ${filters.selectedConstructor || 'All Constructors'}`,
      '',
      '=== DRIVER PERFORMANCE LEADERBOARD ===',
      driverHeaders,
      ...driverRows,
      '',
      '=== CONSTRUCTOR RANKINGS ===',
      [
        'Rank',
        'Constructor',
        'Country',
        'Starts',
        'Points',
        'Wins',
        'Podiums',
        'DNFs',
        'Reliability_Rate_Pct',
      ].join(','),
      ...displayConstructors.map((c, i) => [
        i + 1,
        `"${c.name}"`,
        `"${c.country}"`,
        c.starts,
        c.points,
        c.wins,
        c.podiums,
        c.dnfCount,
        `${c.starts > 0 ? (((c.starts - c.dnfCount) / c.starts) * 100).toFixed(1) : '0.0'}%`,
      ].join(',')),
    ].join('\n');

    return kpiSummary;
  }

  return `${driverHeaders}\n${driverRows.join('\n')}`;
}

export function downloadFilteredCsv(analytics: FilteredAnalytics, filters: FilterState, entityType: 'drivers' | 'constructors' | 'complete' = 'drivers'): string {
  const csvContent = generateFilteredCsv(analytics, filters, entityType);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  const seasonSlug = filters.seasons.length > 0 && filters.seasons.length < 7
    ? `seasons_${filters.seasons.join('-')}`
    : '2018-2024';
  const filterSlug = filters.dnfFilter !== 'ALL' ? `_dnf-${filters.dnfFilter}` : '';
  const filename = `f1_performance_${entityType}_${seasonSlug}${filterSlug}.csv`.toLowerCase();

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}
