export type DNFCategory = 
  | 'Finished'
  | 'Engine'
  | 'Power Unit'
  | 'Collision'
  | 'Gearbox'
  | 'Hydraulics'
  | 'Brakes'
  | 'Suspension'
  | 'Electrical'
  | 'Accident'
  | 'Other';

export interface Driver {
  id: string;
  name: string;
  code: string;
  number: number;
  nationality: string;
  countryCode: string;
  currentTeam: string;
  teamColor: string;
  starts: number;
  wins: number;
  podiums: number;
  points: number;
  poles: number;
  fastestLaps: number;
  dnfCount: number;
  dnfBreakdown: Record<DNFCategory, number>;
  avgFinishPos: number;
  championships: number;
}

export interface Constructor {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  color: string;
  secondaryColor: string;
  points: number;
  wins: number;
  podiums: number;
  dnfCount: number;
  starts: number;
  poles: number;
  fastestLaps: number;
  championships: number;
  seasonPoints: Record<number, number>;
  seasonPositions: Record<number, number>;
}

export interface Circuit {
  id: string;
  name: string;
  location: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  lengthKm: number;
  turns: number;
  firstGpYear: number;
  racesHosted: number;
  tyreAbrasion: 'High' | 'Medium' | 'Low';
  downforce: 'High' | 'Medium' | 'Low';
}

export interface TyreCompoundData {
  compound: 'Soft' | 'Medium' | 'Hard' | 'Intermediate' | 'Wet';
  color: string;
  stintsCount: number;
  totalLaps: number;
  avgLapsPerStint: number;
  fastestLapsAchieved: number;
  usagePercentage: number;
  avgDegradationTenthsPerLap: number;
}

export interface RaceOutcomeRecord {
  id: string;
  season: number;
  round: number;
  raceName: string;
  circuitId: string;
  country: string;
  driverId: string;
  driverName: string;
  constructorId: string;
  constructorName: string;
  grid: number;
  position: number | null;
  status: 'Finished' | 'DNF' | 'DNS' | 'DSQ';
  dnfReason?: DNFCategory;
  points: number;
  tyresUsed: ('Soft' | 'Medium' | 'Hard' | 'Intermediate' | 'Wet')[];
  lapsCompleted: number;
}

export interface CountryStat {
  country: string;
  countryCode: string;
  driversCount: number;
  racesHosted: number;
  totalWins: number;
  totalPodiums: number;
  circuits: string[];
}

export type PerformanceMetric = 
  | 'points'
  | 'ppr' // Points per race
  | 'wins'
  | 'podiums'
  | 'reliability' // Finish %
  | 'avgFinish';

export interface FilterState {
  seasons: number[]; // empty means all [2018, 2019, 2020, 2021, 2022, 2023, 2024]
  dnfFilter: 'ALL' | 'FINISHED' | 'ANY_DNF' | DNFCategory;
  topN: number; // 5, 10, 15, 20, 999 (All)
  selectedConstructor: string | null;
  selectedDriver: string | null;
  selectedMetric: PerformanceMetric;
  searchQuery: string;
}

export interface StoryPoint {
  id: number;
  stepNumber: number;
  title: string;
  subtitle: string;
  narrative: string;
  analyticalInsight: string;
  keyMetrics: { label: string; value: string; detail?: string }[];
  visualFocus: 'map' | 'country_participation' | 'team_championship' | 'driver_reliability' | 'podiums' | 'tyres' | 'team_ranking';
}
