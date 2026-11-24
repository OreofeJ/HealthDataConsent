import { useState } from 'react';
import { AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';

interface SettingsProps {
  totalConsents: number;
  totalAuditEvents: number;
  onResetDemoData: () => void;
}

export function Settings({
  totalConsents,
  totalAuditEvents,
  onResetDemoData,
}: SettingsProps) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const handleConfirmReset = () => {
    onResetDemoData();
    setConfirmReset(false);
    setResetMessage('Synthetic dataset restored to the default 128 fictional consent records.');
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Prototype Information */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-base font-semibold text-slate-900">
          About HealthDataConsent
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          HealthDataConsent is an open-source prototype demonstrating community-controlled
          health-data consent governance. It enables individuals and community stewards to
          record granular, purpose-bound data permissions, withdraw active consent at any
          time, deterministically verify proposed data uses, and inspect a chronological
          audit log.
        </p>

        <dl className="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs font-medium text-slate-500">Environment</dt>
            <dd className="mt-1 font-mono text-sm font-medium text-slate-900">
              MVP VERSION 1
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Stored Consent Records</dt>
            <dd className="mt-1 font-mono text-sm font-medium text-slate-900 tabular-nums">
              {totalConsents}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-slate-500">Stored Audit Events</dt>
            <dd className="mt-1 font-mono text-sm font-medium text-slate-900 tabular-nums">
              {totalAuditEvents}
            </dd>
          </div>
        </dl>
      </section>

      {/* Architecture & Limitations */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-base font-semibold text-slate-900">
          Prototype Scope & Architecture
        </h2>
        <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-slate-600">
          <li>
            All records shown in this workspace use synthetic demonstration data with
            fictional pseudonymous Subject IDs and organisations.
          </li>
          <li>
            State is persisted locally in your browser via <span className="font-mono text-xs">localStorage</span> and
            isolated behind service modules (<span className="font-mono text-xs">consentService</span>,{' '}
            <span className="font-mono text-xs">auditService</span>, <span className="font-mono text-xs">storageService</span>)
            so a FastAPI and PostgreSQL backend can replace local persistence cleanly in a
            future version.
          </li>
          <li>
            This MVP intentionally excludes authentication, external APIs, and production
            healthcare infrastructure. Do not enter real personal or patient health data.
          </li>
        </ul>
      </section>

      {/* Reset Synthetic Data */}
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-display text-base font-semibold text-slate-900">
          Synthetic Dataset Management
        </h2>
        <p className="mt-1.5 text-sm text-slate-600">
          Restore the default 128 fictional consent records and initial audit history.
          Any custom records or withdrawals created in this browser will be replaced.
        </p>

        {resetMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-teal-200 bg-teal-50 px-3.5 py-2.5 text-xs font-medium text-teal-900">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
            <span>{resetMessage}</span>
          </div>
        )}

        {!confirmReset ? (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => {
                setResetMessage(null);
                setConfirmReset(true);
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <RotateCcw className="h-4 w-4 text-slate-500" aria-hidden="true" />
              Reset Synthetic Data
            </button>
          </div>
        ) : (
          <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50/70 p-4">
            <div className="flex items-start gap-2.5">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-amber-700"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-amber-950">
                  Confirm synthetic data reset
                </p>
                <p className="mt-1 text-xs leading-relaxed text-amber-900">
                  This will clear your current local consent register and audit log and
                  re-initialise the 128 fictional synthetic records.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleConfirmReset}
                    className="rounded-lg bg-amber-700 px-3.5 py-2 text-xs font-medium text-white hover:bg-amber-800 whitespace-nowrap shrink-0"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
