import { ArrowRight, Plus, ShieldCheck } from 'lucide-react';
import { ConsentTable } from '../components/ConsentTable';
import { StatCard } from '../components/StatCard';
import { EventTypeLabel } from '../components/StatusBadge';
import { AppPage, AuditEvent, Consent, ConsentStats } from '../types/consent';
import { formatRelativeTime } from '../utils/formatters';

interface DashboardProps {
  consents: Consent[];
  stats: ConsentStats;
  recentAuditEvents: AuditEvent[];
  onOpenCreate: () => void;
  onSelectConsent: (consent: Consent) => void;
  onNavigate: (page: AppPage) => void;
}

export function Dashboard({
  consents,
  stats,
  recentAuditEvents,
  onOpenCreate,
  onSelectConsent,
  onNavigate,
}: DashboardProps) {
  const latestFiveConsents = consents.slice(0, 5);
  const latestFiveEvents = recentAuditEvents.slice(0, 5);

  const pct = (count: number) =>
    stats.total === 0 ? 0 : Math.round((count / stats.total) * 100);

  const activePct = pct(stats.active);
  const withdrawnPct = pct(stats.withdrawn);
  const expiredPct = pct(stats.expired);

  const statusRows = [
    {
      label: 'Active',
      count: stats.active,
      percent: activePct,
      barClass: 'bg-teal-600',
      description: 'Valid for verification until expiry date',
    },
    {
      label: 'Withdrawn',
      count: stats.withdrawn,
      percent: withdrawnPct,
      barClass: 'bg-rose-600',
      description: 'Revoked by data subject or steward',
    },
    {
      label: 'Expired',
      count: stats.expired,
      percent: expiredPct,
      barClass: 'bg-amber-500',
      description: 'Past recorded expiry date; automatically denied',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Workspace Action Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-600">
            Live summary calculated from <span className="font-mono font-medium text-slate-900 tabular-nums">{stats.total}</span> stored consent records.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => onNavigate('verify')}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
          >
            <ShieldCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
            Verify Use
          </button>
          <button
            type="button"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-teal-800 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Consent
          </button>
        </div>
      </div>

      {/* Four Dynamic Summary Cards */}
      <section aria-label="Consent summary metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Consents"
          value={stats.total}
          detail="All recorded consent entries"
          tone="neutral"
        />
        <StatCard
          label="Active Consents"
          value={stats.active}
          detail="Currently valid and within expiry"
          tone="teal"
        />
        <StatCard
          label="Withdrawn Consents"
          value={stats.withdrawn}
          detail="Revoked and excluded from use"
          tone="rose"
        />
        <StatCard
          label="Expired Consents"
          value={stats.expired}
          detail="Automatically deactivated at expiry"
          tone="amber"
        />
      </section>

      {/* Consent Activity Distribution & Recent Audit Panel */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Consent Activity CSS Visualisation */}
        <section
          aria-labelledby="consent-activity-heading"
          className="rounded-xl border border-slate-200 bg-white p-5 lg:col-span-7"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="consent-activity-heading"
                className="font-display text-base font-semibold text-slate-900"
              >
                Consent activity
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Current distribution of stored consent records by lifecycle status.
              </p>
            </div>
            <span className="font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap">
              {stats.total} total
            </span>
          </div>

          {/* Stacked Proportion Bar */}
          <div className="mt-5">
            {stats.total === 0 ? (
              <div className="h-3 w-full rounded-full bg-slate-100" />
            ) : (
              <div
                className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100"
                role="img"
                aria-label={`Active ${activePct}%, Withdrawn ${withdrawnPct}%, Expired ${expiredPct}%`}
              >
                {stats.active > 0 && (
                  <div
                    className="bg-teal-600 transition-all duration-300"
                    style={{ width: `${(stats.active / stats.total) * 100}%` }}
                  />
                )}
                {stats.withdrawn > 0 && (
                  <div
                    className="bg-rose-600 transition-all duration-300"
                    style={{ width: `${(stats.withdrawn / stats.total) * 100}%` }}
                  />
                )}
                {stats.expired > 0 && (
                  <div
                    className="bg-amber-500 transition-all duration-300"
                    style={{ width: `${(stats.expired / stats.total) * 100}%` }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Individual Status Bars */}
          <div className="mt-6 divide-y divide-slate-100">
            {statusRows.map((row) => (
              <div key={row.label} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="font-medium text-slate-900">{row.label}</span>
                    <span className="text-xs text-slate-500 hidden sm:inline">
                      · {row.description}
                    </span>
                  </div>
                  <div className="font-mono text-xs text-slate-700 tabular-nums">
                    <span className="font-semibold text-slate-900">{row.count}</span>{' '}
                    <span className="text-slate-500">({row.percent}%)</span>
                  </div>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${row.barClass} transition-all duration-300`}
                    style={{
                      width: stats.total === 0 ? '0%' : `${(row.count / stats.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Audit Activity */}
        <section
          aria-labelledby="recent-activity-heading"
          className="flex flex-col rounded-xl border border-slate-200 bg-white lg:col-span-5"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2
                id="recent-activity-heading"
                className="font-display text-base font-semibold text-slate-900"
              >
                Recent activity
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Latest consent and verification events
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('audit')}
              className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-900 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
            >
              Audit Trail
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          {latestFiveEvents.length === 0 ? (
            <div className="flex flex-1 items-center justify-center p-6 text-xs text-slate-500">
              No audit events recorded yet.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {latestFiveEvents.map((event) => (
                <li key={event.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <EventTypeLabel eventType={event.eventType} />
                    <span className="font-mono text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
                      {formatRelativeTime(event.timestamp)}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-700 line-clamp-2">
                    {event.description}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-slate-500 tabular-nums">
                    {event.consentId} · {event.subjectId}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Recent Consent Records Table Preview */}
      <section
        aria-labelledby="recent-consents-heading"
        className="overflow-hidden rounded-xl border border-slate-200 bg-white"
      >
        <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2
              id="recent-consents-heading"
              className="font-display text-base font-semibold text-slate-900"
            >
              Recent consent records
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Showing the latest five records stored in the consent register.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('records')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:text-teal-900 whitespace-nowrap shrink-0 self-start sm:self-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded"
          >
            View full register
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        {latestFiveConsents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-slate-900">No consent records found</p>
            <p className="mt-1 text-xs text-slate-500">
              Create a new consent record to populate the register.
            </p>
            <button
              type="button"
              onClick={onOpenCreate}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3.5 py-2 text-xs font-medium text-white hover:bg-teal-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Consent
            </button>
          </div>
        ) : (
          <ConsentTable
            consents={latestFiveConsents}
            variant="preview"
            onSelectConsent={onSelectConsent}
          />
        )}
      </section>
    </div>
  );
}
