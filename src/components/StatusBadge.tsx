import {
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';
import { AuditEventType, ConsentStatus, VerificationOutcome } from '../types/consent';

interface StatusBadgeProps {
  status: ConsentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-800 whitespace-nowrap shrink-0">
        <CheckCircle2 className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
        Active
      </span>
    );
  }

  if (status === 'Withdrawn') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-800 whitespace-nowrap shrink-0">
        <Ban className="h-3.5 w-3.5 text-rose-700" aria-hidden="true" />
        Withdrawn
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 whitespace-nowrap shrink-0">
      <Clock className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
      Expired
    </span>
  );
}

interface OutcomeBadgeProps {
  outcome: VerificationOutcome;
}

export function VerificationOutcomeBadge({ outcome }: OutcomeBadgeProps) {
  if (outcome === 'APPROVED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-teal-300 bg-teal-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-teal-900 whitespace-nowrap shrink-0">
        <ShieldCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
        APPROVED
      </span>
    );
  }

  if (outcome === 'DENIED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-rose-300 bg-rose-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-rose-900 whitespace-nowrap shrink-0">
        <ShieldAlert className="h-4 w-4 text-rose-700" aria-hidden="true" />
        DENIED
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1 text-xs font-semibold tracking-wide text-amber-900 whitespace-nowrap shrink-0">
      <AlertTriangle className="h-4 w-4 text-amber-700" aria-hidden="true" />
      REVIEW
    </span>
  );
}

interface EventTypeLabelProps {
  eventType: AuditEventType;
}

export function EventTypeLabel({ eventType }: EventTypeLabelProps) {
  const styles: Record<AuditEventType, string> = {
    CONSENT_CREATED: 'border-teal-200 bg-teal-50 text-teal-800',
    CONSENT_WITHDRAWN: 'border-rose-200 bg-rose-50 text-rose-800',
    CONSENT_VERIFIED: 'border-sky-200 bg-sky-50 text-sky-800',
    CONSENT_EXPIRED: 'border-amber-200 bg-amber-50 text-amber-800',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[11px] font-medium whitespace-nowrap shrink-0 ${styles[eventType]}`}
    >
      {eventType}
    </span>
  );
}
