import { useState } from 'react';
import { ConsentStats } from '../../types/consent';

interface StatusDistributionDonutProps {
  stats: ConsentStats;
}

interface DonutSegment {
  key: 'active' | 'withdrawn' | 'expired';
  label: string;
  count: number;
  percent: number;
  stroke: string;
  swatchClass: string;
}

export function StatusDistributionDonut({ stats }: StatusDistributionDonutProps) {
  const [hoveredKey, setHoveredKey] = useState<DonutSegment['key'] | null>(null);

  const total = stats.total;
  const pct = (count: number) =>
    total === 0 ? 0 : Math.round((count / total) * 1000) / 10;

  const segments: DonutSegment[] = [
    {
      key: 'active',
      label: 'Active',
      count: stats.active,
      percent: pct(stats.active),
      stroke: '#0D9488',
      swatchClass: 'bg-teal-600',
    },
    {
      key: 'withdrawn',
      label: 'Withdrawn',
      count: stats.withdrawn,
      percent: pct(stats.withdrawn),
      stroke: '#E11D48',
      swatchClass: 'bg-rose-600',
    },
    {
      key: 'expired',
      label: 'Expired',
      count: stats.expired,
      percent: pct(stats.expired),
      stroke: '#D97706',
      swatchClass: 'bg-amber-600',
    },
  ];

  // SVG circle geometry
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  let cumulativeFraction = 0;
  const arcs = segments.map((seg) => {
    const fraction = total > 0 ? seg.count / total : 0;
    const strokeLength = fraction * circumference;
    const rotation = cumulativeFraction * 360 - 90;
    cumulativeFraction += fraction;
    return {
      ...seg,
      strokeLength,
      rotation,
    };
  });

  const hoveredSegment = segments.find((s) => s.key === hoveredKey) ?? null;

  return (
    <section
      aria-labelledby="status-donut-title"
      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="status-donut-title"
            className="font-display text-base font-semibold text-slate-900"
          >
            Consent Status Distribution
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Breakdown of stored consents across lifecycle states.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
          {total} total
        </span>
      </div>

      {total === 0 ? (
        <div className="my-8 flex flex-col items-center justify-center text-center">
          <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-dashed border-slate-200">
            <div>
              <p className="font-mono text-2xl font-semibold text-slate-400 tabular-nums">0</p>
              <p className="text-[11px] text-slate-500">No records</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Create a consent record to populate status distribution.
          </p>
        </div>
      ) : (
        <div className="my-4 grid items-center gap-6 sm:grid-cols-12">
          {/* Donut SVG */}
          <div className="flex justify-center sm:col-span-5">
            <svg
              viewBox="0 0 180 180"
              className="h-44 w-44"
              role="img"
              aria-label={`Consent status distribution: Active ${stats.active}, Withdrawn ${stats.withdrawn}, Expired ${stats.expired}`}
            >
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#F1F5F9"
                strokeWidth="24"
              />

              {arcs.map((arc) => {
                if (arc.count === 0) return null;
                const isDimmed = hoveredKey !== null && hoveredKey !== arc.key;
                return (
                  <circle
                    key={arc.key}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke={arc.stroke}
                    strokeWidth={hoveredKey === arc.key ? '27' : '24'}
                    strokeDasharray={`${arc.strokeLength} ${circumference}`}
                    transform={`rotate(${arc.rotation} 90 90)`}
                    className="cursor-pointer transition-all duration-200"
                    style={{ opacity: isDimmed ? 0.35 : 1 }}
                    onMouseEnter={() => setHoveredKey(arc.key)}
                    onMouseLeave={() => setHoveredKey(null)}
                  />
                );
              })}

              {/* Center readout */}
              <text
                x="90"
                y="88"
                textAnchor="middle"
                className="fill-slate-900 font-mono text-[26px] font-semibold tabular-nums"
              >
                {hoveredSegment ? hoveredSegment.count : total}
              </text>
              <text
                x="90"
                y="106"
                textAnchor="middle"
                className="fill-slate-500 text-[11px] font-medium"
              >
                {hoveredSegment ? hoveredSegment.label : 'Total Consents'}
              </text>
            </svg>
          </div>

          {/* Interactive Legend */}
          <div className="divide-y divide-slate-100 sm:col-span-7">
            {segments.map((seg) => (
              <div
                key={seg.key}
                onMouseEnter={() => setHoveredKey(seg.key)}
                onMouseLeave={() => setHoveredKey(null)}
                className={`flex items-center justify-between gap-3 rounded-lg px-2.5 py-2.5 transition-colors ${
                  hoveredKey === seg.key ? 'bg-slate-50' : ''
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-xs ${seg.swatchClass}`}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-slate-800 truncate">
                    {seg.label}
                  </span>
                </div>
                <div className="font-mono text-xs tabular-nums whitespace-nowrap">
                  <span className="font-semibold text-slate-900">{seg.count}</span>{' '}
                  <span className="text-slate-500">({seg.percent.toFixed(1)}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="border-t border-slate-100 pt-3 text-[11px] text-slate-500">
        Consistent lifecycle colours reflect active, withdrawn, and expired states across the register.
      </p>
    </section>
  );
}
