import { useState, type FormEvent } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { VerificationOutcomeBadge } from '../components/StatusBadge';
import { consentService } from '../services/consentService';
import {
  CONSENT_PURPOSES,
  Consent,
  DATA_CATEGORIES,
  VerificationRequest,
  VerificationResult,
} from '../types/consent';
import { formatTimestamp } from '../utils/formatters';

interface VerifyConsentProps {
  onVerificationLogged: () => void;
  onInspectConsent: (consent: Consent) => void;
}

const INITIAL_REQUEST: VerificationRequest = {
  subjectId: '',
  organisation: '',
  purpose: '',
  dataCategory: '',
};

export function VerifyConsent({
  onVerificationLogged,
  onInspectConsent,
}: VerifyConsentProps) {
  const [request, setRequest] = useState<VerificationRequest>(INITIAL_REQUEST);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const outcome = consentService.verifyConsent(request);
    setResult(outcome);
    onVerificationLogged();
  };

  const applySample = (preset: 'valid' | 'withdrawn' | 'incomplete') => {
    setResult(null);
    if (preset === 'valid') {
      setRequest({
        subjectId: 'SUB-1001',
        organisation: 'Northbridge Health Research Trust',
        purpose: 'Academic research',
        dataCategory: 'Health records',
      });
    } else if (preset === 'withdrawn') {
      setRequest({
        subjectId: 'SUB-1003',
        organisation: 'Harbourview Public Health Lab',
        purpose: 'Public-health research',
        dataCategory: 'Health records',
      });
    } else {
      setRequest({
        subjectId: 'SUB-1002',
        organisation: '',
        purpose: 'Mental-health research',
        dataCategory: '',
      });
    }
  };

  const handleInspectMatched = () => {
    if (!result?.matchedConsentId) return;
    const found = consentService.getConsentById(result.matchedConsentId);
    if (found) {
      onInspectConsent(found);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Verification Request Form */}
      <section
        aria-labelledby="verify-form-heading"
        className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6"
      >
        <div className="border-b border-slate-200 pb-4">
          <h2
            id="verify-form-heading"
            className="font-display text-base font-semibold text-slate-900"
          >
            Check Proposed Data Use
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-500">
            Deterministically verify whether an active, non-expired consent covers the
            proposed subject, organisation, purpose, and data category. Incomplete requests
            fail closed for human review.
          </p>
        </div>

        {/* Sample Fill Helpers */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500">Load example:</span>
          <button
            type="button"
            onClick={() => applySample('valid')}
            className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-teal-300 hover:bg-teal-50/50 hover:text-teal-800"
          >
            Valid active use
          </button>
          <button
            type="button"
            onClick={() => applySample('withdrawn')}
            className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-800"
          >
            Withdrawn consent
          </button>
          <button
            type="button"
            onClick={() => applySample('incomplete')}
            className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-800"
          >
            Incomplete request
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="verify-subjectId"
              className="block text-xs font-medium text-slate-700"
            >
              Subject ID
            </label>
            <input
              id="verify-subjectId"
              type="text"
              value={request.subjectId}
              onChange={(e) => setRequest({ ...request, subjectId: e.target.value })}
              placeholder="e.g. SUB-1001"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            />
          </div>

          <div>
            <label
              htmlFor="verify-organisation"
              className="block text-xs font-medium text-slate-700"
            >
              Organisation
            </label>
            <input
              id="verify-organisation"
              type="text"
              value={request.organisation}
              onChange={(e) => setRequest({ ...request, organisation: e.target.value })}
              placeholder="e.g. Northbridge Health Research Trust"
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            />
          </div>

          <div>
            <label
              htmlFor="verify-purpose"
              className="block text-xs font-medium text-slate-700"
            >
              Intended purpose
            </label>
            <select
              id="verify-purpose"
              value={request.purpose}
              onChange={(e) =>
                setRequest({
                  ...request,
                  purpose: e.target.value as VerificationRequest['purpose'],
                })
              }
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <option value="">Select intended purpose...</option>
              {CONSENT_PURPOSES.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="verify-category"
              className="block text-xs font-medium text-slate-700"
            >
              Requested data category
            </label>
            <select
              id="verify-category"
              value={request.dataCategory}
              onChange={(e) =>
                setRequest({
                  ...request,
                  dataCategory: e.target.value as VerificationRequest['dataCategory'],
                })
              }
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <option value="">Select data category...</option>
              {DATA_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={() => {
                setRequest(INITIAL_REQUEST);
                setResult(null);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              Clear Form
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Verify Consent
            </button>
          </div>
        </form>
      </section>

      {/* Deterministic Decision Panel */}
      <section
        aria-labelledby="verify-result-heading"
        className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-6"
      >
        <div className="border-b border-slate-200 pb-4">
          <h2
            id="verify-result-heading"
            className="font-display text-base font-semibold text-slate-900"
          >
            Verification Decision
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Every verification check is evaluated deterministically and recorded in the
            Audit Trail.
          </p>
        </div>

        {!result ? (
          <div className="py-12 text-center">
            <ShieldCheck className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
            <p className="mt-3 text-sm font-medium text-slate-900">
              Awaiting verification request
            </p>
            <p className="mt-1 max-w-sm mx-auto text-xs leading-relaxed text-slate-500">
              Submit the form to evaluate all six consent conditions and log the decision.
            </p>
          </div>
        ) : (
          <div className="mt-5 space-y-5">
            <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <VerificationOutcomeBadge outcome={result.outcome} />
                <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                  {formatTimestamp(result.checkedAt)}
                </span>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-800">{result.reason}</p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500">
                <span>
                  Audit Event: <span className="font-mono text-slate-800">{result.auditEventId}</span>
                </span>
                {result.matchedConsentId && (
                  <button
                    type="button"
                    onClick={handleInspectMatched}
                    className="font-mono font-medium text-teal-700 hover:text-teal-900 underline underline-offset-2"
                  >
                    Inspect {result.matchedConsentId}
                  </button>
                )}
              </div>
            </div>

            {/* Evaluation Checklist */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Rule Evaluation Breakdown
              </h3>
              <ul className="mt-2.5 divide-y divide-slate-100 rounded-lg border border-slate-200">
                {result.checks.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {item.passed === true && (
                        <CheckCircle2
                          className="h-4 w-4 shrink-0 text-teal-600"
                          aria-hidden="true"
                        />
                      )}
                      {item.passed === false && (
                        <XCircle
                          className="h-4 w-4 shrink-0 text-rose-600"
                          aria-hidden="true"
                        />
                      )}
                      {item.passed === 'pending' && (
                        <AlertTriangle
                          className="h-4 w-4 shrink-0 text-amber-600"
                          aria-hidden="true"
                        />
                      )}
                      <span className="font-medium text-slate-800">{item.label}</span>
                    </div>
                    <span className="truncate font-mono text-[11px] text-slate-500 max-w-[180px]">
                      {item.detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <Clock className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
              <span>Decision computed strictly from stored consent attributes without probabilistic scoring.</span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
