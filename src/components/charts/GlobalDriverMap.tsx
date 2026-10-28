import React, { useState } from 'react';
import { COUNTRY_STATS, CIRCUITS } from '../../data/f1Data';
import { Globe, MapPin, Trophy, Flag, Info } from 'lucide-react';

interface GlobalDriverMapProps {
  onSelectCountry?: (country: string) => void;
  selectedCountry?: string | null;
}

// Representative coordinates on a 1000x500 Robinson/Equirectangular projection
const COUNTRY_COORDS: Record<string, { x: number; y: number; code: string }> = {
  'United Kingdom': { x: 485, y: 155, code: 'GBR' },
  'Netherlands': { x: 505, y: 160, code: 'NLD' },
  'Spain': { x: 475, y: 205, code: 'ESP' },
  'Monaco': { x: 502, y: 195, code: 'MCO' },
  'Mexico': { x: 230, y: 250, code: 'MEX' },
  'Australia': { x: 865, y: 395, code: 'AUS' },
  'Finland': { x: 550, y: 115, code: 'FIN' },
  'Germany': { x: 515, y: 165, code: 'DEU' },
  'France': { x: 490, y: 180, code: 'FRA' },
  'Italy': { x: 518, y: 195, code: 'ITA' },
  'United States': { x: 220, y: 190, code: 'USA' },
  'Japan': { x: 855, y: 205, code: 'JPN' },
  'Canada': { x: 250, y: 140, code: 'CAN' },
  'Austria': { x: 525, y: 178, code: 'AUT' },
  'Brazil': { x: 345, y: 360, code: 'BRA' },
  'Belgium': { x: 498, y: 165, code: 'BEL' },
  'Bahrain': { x: 625, y: 235, code: 'BHR' },
  'Saudi Arabia': { x: 610, y: 245, code: 'SAU' },
  'United Arab Emirates': { x: 638, y: 240, code: 'ARE' },
  'Singapore': { x: 775, y: 290, code: 'SGP' },
  'Azerbaijan': { x: 620, y: 190, code: 'AZE' },
  'China': { x: 790, y: 210, code: 'CHN' },
  'Hungary': { x: 535, y: 175, code: 'HUN' },
  'Qatar': { x: 632, y: 238, code: 'QAT' },
};

export const GlobalDriverMap: React.FC<GlobalDriverMapProps> = ({
  onSelectCountry,
  selectedCountry,
}) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const activeStat = COUNTRY_STATS.find(
    (c) => c.country === (hoveredCountry || selectedCountry || 'United Kingdom')
  );

  return (
    <div className="bg-[#141822] border border-white/10 rounded-xl p-4 lg:p-5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E10600]"></span>
            <h2 className="text-sm lg:text-base font-bold text-white uppercase tracking-wider">
              Global Driver Distribution & Grand Prix Nations
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Interactive map visualizing Grand Prix participation, driver origins, and host venues
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E10600]"></span>
            <span>Driver + GP Host</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D2BE]"></span>
            <span>Host Circuit Only</span>
          </span>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 min-h-[300px] lg:min-h-[340px] bg-[#0b0e14] border border-white/5 rounded-lg overflow-hidden flex items-center justify-center">
        {/* Subtle gridlines */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* World Outline SVG & Pins */}
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-full max-h-[380px] select-none"
        >
          {/* Stylized continent polygons */}
          <g fill="#1a202c" stroke="#2d3748" strokeWidth="0.75" opacity="0.7">
            {/* North America */}
            <path d="M120,60 L240,70 L310,120 L270,180 L230,220 L190,260 L170,220 L130,160 Z" />
            {/* South America */}
            <path d="M270,270 L340,300 L370,360 L320,440 L280,380 L260,300 Z" />
            {/* Europe */}
            <path d="M460,90 L560,95 L570,150 L530,210 L470,200 L450,140 Z" />
            {/* Africa */}
            <path d="M460,220 L550,220 L580,320 L530,420 L480,380 L440,280 Z" />
            {/* Asia */}
            <path d="M570,90 L850,90 L880,180 L800,280 L680,270 L580,200 Z" />
            {/* Australia */}
            <path d="M800,340 L900,340 L920,420 L820,430 Z" />
          </g>

          {/* Equator & Prime Meridian subtle reference lines */}
          <line x1="0" y1="250" x2="1000" y2="250" stroke="#374151" strokeDasharray="4 4" strokeWidth="0.5" />
          <line x1="500" y1="0" x2="500" y2="500" stroke="#374151" strokeDasharray="4 4" strokeWidth="0.5" />

          {/* Interactive Country Pin Markers */}
          {COUNTRY_STATS.map((item) => {
            const coord = COUNTRY_COORDS[item.country];
            if (!coord) return null;

            const isHovered = hoveredCountry === item.country;
            const isSelected = selectedCountry === item.country;
            const hasDrivers = item.driversCount > 0;
            const markerColor = hasDrivers ? '#E10600' : '#00D2BE';
            const radius = Math.max(5, Math.min(14, Math.sqrt(item.racesHosted || 5) * 1.5 + (hasDrivers ? 3 : 0)));

            return (
              <g
                key={item.country}
                className="cursor-pointer transition-transform duration-200"
                transform={`translate(${coord.x}, ${coord.y})`}
                onMouseEnter={() => setHoveredCountry(item.country)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={() => onSelectCountry?.(item.country)}
              >
                {/* Pulse ring for active/hovered */}
                {(isHovered || isSelected) && (
                  <circle
                    r={radius + 8}
                    fill="none"
                    stroke={markerColor}
                    strokeWidth="1.5"
                    className="animate-ping opacity-75"
                  />
                )}

                {/* Outer halo */}
                <circle
                  r={radius + 2}
                  fill={markerColor}
                  fillOpacity={isHovered || isSelected ? 0.35 : 0.15}
                  stroke={markerColor}
                  strokeWidth={isHovered || isSelected ? 2 : 1}
                />

                {/* Core dot */}
                <circle
                  r={radius}
                  fill={markerColor}
                  className="transition-all"
                />

                {/* Country Code Label */}
                <text
                  y={radius + 12}
                  textAnchor="middle"
                  fill={isHovered || isSelected ? '#FFFFFF' : '#94A3B8'}
                  fontSize={isHovered || isSelected ? '11px' : '9px'}
                  fontFamily="monospace"
                  fontWeight={isHovered || isSelected ? 'bold' : 'normal'}
                >
                  {coord.code}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Active Country Detail Card */}
        {activeStat && (
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:w-80 bg-[#10141d]/95 backdrop-blur-md border border-white/15 rounded-lg p-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-xs sm:text-sm">
                  {activeStat.country}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-white/10 rounded text-slate-300">
                  {activeStat.countryCode}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                {activeStat.driversCount > 0 ? `${activeStat.driversCount} Drivers` : 'Host Venue'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white/5 rounded p-1.5">
                <span className="block text-[10px] text-slate-400">Races Hosted</span>
                <span className="font-mono font-bold text-white text-sm">
                  {activeStat.racesHosted}
                </span>
              </div>

              <div className="bg-white/5 rounded p-1.5">
                <span className="block text-[10px] text-slate-400">Race Wins</span>
                <span className="font-mono font-bold text-[#E10600] text-sm">
                  {activeStat.totalWins}
                </span>
              </div>

              <div className="bg-white/5 rounded p-1.5">
                <span className="block text-[10px] text-slate-400">Podiums</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {activeStat.totalPodiums}
                </span>
              </div>
            </div>

            {activeStat.circuits.length > 0 && (
              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#FF8700] shrink-0" />
                <span className="truncate">Circuits: {activeStat.circuits.join(', ')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Metric Note */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
        <span>Click any country marker to focus telemetry</span>
        <span className="font-mono">Global Grand Prix Footprint</span>
      </div>
    </div>
  );
};
