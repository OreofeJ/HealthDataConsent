interface StatCardProps {
  label: string;
  value: number;
  detail: string;
  tone?: 'neutral' | 'teal' | 'rose' | 'amber';
}

export function StatCard({ label, value, detail, tone = 'neutral' }: StatCardProps) {
  const toneIndicator: Record<NonNullable<StatCardProps['tone']>, string> = {
    neutral: 'text-slate-900',
    teal: 'text-teal-800',
    rose: 'text-rose-800',
    amber: 'text-amber-800',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p
        className={`mt-2 font-mono text-3xl font-semibold tracking-tight tabular-nums ${toneIndicator[tone]}`}
      >
        {value}
      </p>
      <p className="mt-1.5 text-xs text-slate-500">{detail}</p>
    </div>
  );
}
