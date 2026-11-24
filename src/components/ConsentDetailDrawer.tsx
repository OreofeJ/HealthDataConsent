import { useState } from 'react';
import { AlertTriangle, Ban, X } from 'lucide-react';
import { computeEffectiveStatus } from '../services/consentService';
import { AuditEvent, Consent } from '../types/consent';
import { formatDateYmd, formatTimestamp } from '../utils/formatters';
import { EventTypeLabel, StatusBadge } from './StatusBadge';

interface ConsentDetailDrawerProps {
  consent: Consent | null;
  relatedEvents: AuditEvent[];
  onClose: () => void;
  onWithdraw: (consentId: string) => void;
}

export function ConsentDetailDrawer({
  consent,
  relatedEvents,
  onClose,
  onWithdraw,
}: ConsentDetailDrawerProps) {
  const [confirmingWithdrawal, setConfirmingWithdrawal] = useState(false);

  if (!consent) return null;

  const effectiveStatus = computeEffectiveStatus(consent);

  const handleClose = () => {
    setConfirmingWithdrawal(false);
    onClose();
  };

  const handleConfirmWithdraw = () => {
    onWithdraw(consent.id);
    setConfirmingWithdrawal(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-detail-title"
    >
      <div
        className="fixed inset-0 bg-slate-950/45 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-slate-200 bg-white shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <h2
                id="consent-detail-title"
                className="font-mono text-lg font-semibold text-slate-900 tabular-nums"
              >
                {consent.id}
              </h2>
              <StatusBadge status={effectiveStatus} />
            </div>
            <p className="mt-1 truncate text-xs text-slate-500">
              {consent.organisation} · {consent.purpose}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            aria-label="Close consent details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Core Metadata Grid */}
          <dl className="grid grid-cols-1 gap-4 border-b border-slate-200 pb-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium text-slate-500">Consent ID</dt>
              <dd className="mt-1 font-mono text-sm font-medium text-slate-900 tabular-nums">
                {consent.id}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-slate-500">Pseudonymous Subject ID</dt>
              <dd className="mt-1 font-mono text-sm font-medium text-slate-900 tabular-nums">
                {consent.subjectId}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="text-xs font-medium text-slate-500">Organisation</dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">
                {consent.organisation}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-slate-500">Consent Purpose</dt>
              <dd className="mt-1 text-sm text-slate-900">{consent.purpose}</dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-slate-500">Consent Status</dt>
              <dd className="mt-1">
                <StatusBadge status={effectiveStatus} />
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-slate-500">Date Granted</dt>
              <dd className="mt-1 font-mono text-sm text-slate-900 tabular-nums">
                {formatDateYmd(consent.dateGranted)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-slate-500">Expiry Date</dt>
              <dd className="mt-1 font-mono text-sm text-slate-900 tabular-nums">
                {formatDateYmd(consent.expiryDate)}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-slate-500">Consent Notice Version</dt>
              <dd className="mt-1 font-mono text-sm text-slate-900 tabular-nums">
                v{consent.noticeVersion}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-medium text-slate-500">Consent Method</dt>
              <dd className="mt-1 text-sm text-slate-900">{consent.method}</dd>
            </div>

            {consent.withdrawnAt && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium text-rose-700">Withdrawal Timestamp</dt>
                <dd className="mt-1 font-mono text-sm text-rose-900 tabular-nums">
                  {formatTimestamp(consent.withdrawnAt)}
                </dd>
              </div>
            )}
          </dl>

          {/* Permitted Data Categories */}
          <div className="border-b border-slate-200 pb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Permitted Data Categories
            </h3>
            <ul className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-slate-50/50">
              {consent.dataCategories.map((category) => (
                <li key={category} className="px-3.5 py-2 text-sm text-slate-800">
                  {category}
                </li>
              ))}
            </ul>
          </div>

          {/* Withdrawal Action (Active records only) */}
          {effectiveStatus === 'Active' && (
            <div className="border-b border-slate-200 pb-6">
              {!confirmingWithdrawal ? (
                <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Revoke active consent
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Marks this record as Withdrawn while preserving its full audit history.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setConfirmingWithdrawal(true)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3.5 py-2 text-xs font-medium text-rose-700 hover:bg-rose-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                  >
                    <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                    Withdraw Consent
                  </button>
                </div>
              ) : (
                <div className="rounded-lg border border-rose-300 bg-rose-50/70 p-4">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle
                      className="mt-0.5 h-4 w-4 shrink-0 text-rose-700"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold text-rose-950">
                        Confirm consent withdrawal
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-rose-900">
                        Withdrawing <span className="font-mono font-medium">{consent.id}</span>{' '}
                        immediately prevents future verification approvals for{' '}
                        {consent.organisation}. The original record is preserved and a{' '}
                        <span className="font-mono">CONSENT_WITHDRAWN</span> audit event will be
                        logged.
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={handleConfirmWithdraw}
                          className="rounded-lg bg-rose-700 px-3.5 py-2 text-xs font-medium text-white hover:bg-rose-800 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
                        >
                          Confirm Withdrawal
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingWithdrawal(false)}
                          className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                        >
                          Keep Active
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Related Audit Events */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Related Audit Events ({relatedEvents.length})
            </h3>
            {relatedEvents.length === 0 ? (
              <p className="mt-3 text-xs text-slate-500">
                No audit events recorded for this consent yet.
              </p>
            ) : (
              <div className="mt-3 divide-y divide-slate-100 rounded-lg border border-slate-200">
                {relatedEvents.map((event) => (
                  <div key={event.id} className="p-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <EventTypeLabel eventType={event.eventType} />
                      <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                        {formatTimestamp(event.timestamp)}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-slate-700">
                      {event.description}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                      Event <span className="font-mono">{event.id}</span> · Actor: {event.actor}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
