import { ArrowRight, Plus, ShieldCheck } from 'lucide-react';
import { ActiveConsentGauge } from '../components/charts/ActiveConsentGauge';
import { PurposePrismChart } from '../components/charts/PurposePrismChart';
import { StatusDistributionDonut } from '../components/charts/StatusDistributionDonut';
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

  return (
    <div className="space-y-6">
      {/* Top Workspace Action Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-600">
            Live summary calculated from{' '}
            <span className="font-mono font-medium text-slate-900 tabular-nums">
              {stats.total}
            </span>{' '}
            stored consent records.
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

      {/* First Row: Four Dynamic Summary Cards */}
      <section
        aria-label="Consent summary metrics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
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

      {/* Second Row: Active Consent Rate Gauge + Status Distribution Donut */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ActiveConsentGauge activeCount={stats.active} totalCount={stats.total} />
        <StatusDistributionDonut stats={stats} />
      </div>

      {/* Third Row: Consent Purpose Landscape Triangular Prism Chart */}
      <PurposePrismChart consents={consents} />

      {/* Below the Charts: Recent Consent Records & Recent Audit Activity */}
      <div className="space-y-6">
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

        <section
          aria-labelledby="recent-activity-heading"
          className="overflow-hidden rounded-xl border border-slate-200 bg-white"
        >
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <div>
              <h2
                id="recent-activity-heading"
                className="font-display text-base font-semibold text-slate-900"
              >
                Recent audit activity
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Latest five lifecycle and verification events recorded in the audit log.
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
            <div className="p-6 text-center text-xs text-slate-500">
              No audit events recorded yet.
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {latestFiveEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-col gap-1.5 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <EventTypeLabel eventType={event.eventType} />
                      <span className="font-mono text-xs font-medium text-slate-700 tabular-nums">
                        {event.consentId} · {event.subjectId}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-700">
                      {event.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-left sm:text-right">
                    <span className="font-mono text-[11px] text-slate-500 tabular-nums whitespace-nowrap">
                      {formatRelativeTime(event.timestamp)}
                    </span>
                    <p className="text-[11px] text-slate-500 whitespace-nowrap">
                      {event.actor}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
