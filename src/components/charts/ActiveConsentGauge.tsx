interface ActiveConsentGaugeProps {
  activeCount: number;
  totalCount: number;
}

export function ActiveConsentGauge({
  activeCount,
  totalCount,
}: ActiveConsentGaugeProps) {
  const rate = totalCount > 0 ? (activeCount / totalCount) * 100 : 0;
  const clampedRate = Math.max(0, Math.min(100, rate));
  const formattedRate =
    totalCount === 0
      ? '0%'
      : Number.isInteger(Math.round(clampedRate * 10) / 10)
        ? `${Math.round(clampedRate)}%`
        : `${clampedRate.toFixed(1)}%`;

  // Semicircle geometry: center (130, 122), radius 92
  const radius = 92;
  const cx = 130;
  const cy = 122;
  const arcLength = Math.PI * radius;
  const dashOffset = arcLength * (1 - clampedRate / 100);
  const arcPath = `M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`;

  const inactiveCount = Math.max(0, totalCount - activeCount);

  return (
    <section
      aria-labelledby="active-rate-gauge-title"
      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="active-rate-gauge-title"
            className="font-display text-base font-semibold text-slate-900"
          >
            Active Consent Rate
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Share of total consent records currently active and valid.
          </p>
        </div>
        <span className="font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
          {activeCount} / {totalCount}
        </span>
      </div>

      <div className="my-4 flex flex-col items-center">
        <svg
          viewBox="0 0 260 148"
          className="w-full max-w-[280px]"
          role="img"
          aria-label={`Active consent rate: ${formattedRate} (${activeCount} active out of ${totalCount} total records)`}
        >
          {/* Background track */}
          <path
            d={arcPath}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Active progress arc */}
          {clampedRate > 0 && (
            <path
              d={arcPath}
              fill="none"
              stroke="#0D9488"
              strokeWidth="18"
              strokeLinecap="round"
              strokeDasharray={arcLength}
              strokeDashoffset={dashOffset}
              className="transition-[stroke-dashoffset] duration-500 ease-out"
            />
          )}

          {/* Subtle scale markers */}
          <text
            x="24"
            y="142"
            textAnchor="middle"
            className="fill-slate-400 font-mono text-[10px]"
          >
            0%
          </text>
          <text
            x="130"
            y="18"
            textAnchor="middle"
            className="fill-slate-400 font-mono text-[10px]"
          >
            50%
          </text>
          <text
            x="236"
            y="142"
            textAnchor="middle"
            className="fill-slate-400 font-mono text-[10px]"
          >
            100%
          </text>

          {/* Center percentage readout */}
          <text
            x="130"
            y="102"
            textAnchor="middle"
            className="fill-slate-900 font-mono text-[30px] font-semibold tabular-nums"
          >
            {formattedRate}
          </text>
          <text
            x="130"
            y="122"
            textAnchor="middle"
            className="fill-slate-500 text-[11px] font-medium"
          >
            {totalCount === 0 ? 'No records stored' : 'Active of total'}
          </text>
        </svg>
      </div>

      <dl className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3.5 text-center">
        <div>
          <dt className="text-[11px] text-slate-500">Active</dt>
          <dd className="mt-0.5 font-mono text-sm font-semibold text-teal-800 tabular-nums">
            {activeCount}
          </dd>
        </div>
        <div className="border-x border-slate-100">
          <dt className="text-[11px] text-slate-500">Total Records</dt>
          <dd className="mt-0.5 font-mono text-sm font-semibold text-slate-900 tabular-nums">
            {totalCount}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-slate-500">Inactive</dt>
          <dd className="mt-0.5 font-mono text-sm font-semibold text-slate-700 tabular-nums">
            {inactiveCount}
          </dd>
        </div>
      </dl>
    </section>
  );
}
