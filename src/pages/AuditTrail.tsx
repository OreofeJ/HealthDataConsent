import { useMemo, useState } from 'react';
import { Info, Search, X } from 'lucide-react';
import { EventTypeLabel } from '../components/StatusBadge';
import { auditService } from '../services/auditService';
import { AuditEvent, AuditEventType } from '../types/consent';
import { formatTimestamp } from '../utils/formatters';

interface AuditTrailProps {
  events: AuditEvent[];
  onInspectConsentId?: (consentId: string) => void;
}

const EVENT_TYPE_OPTIONS: { value: AuditEventType | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Events' },
  { value: 'CONSENT_CREATED', label: 'CONSENT_CREATED' },
  { value: 'CONSENT_WITHDRAWN', label: 'CONSENT_WITHDRAWN' },
  { value: 'CONSENT_VERIFIED', label: 'CONSENT_VERIFIED' },
  { value: 'CONSENT_EXPIRED', label: 'CONSENT_EXPIRED' },
];

export function AuditTrail({ events, onInspectConsentId }: AuditTrailProps) {
  const [eventType, setEventType] = useState<AuditEventType | 'ALL'>('ALL');
  const [query, setQuery] = useState('');

  const filteredEvents = useMemo(
    () => auditService.filterEvents(events, { eventType, query }),
    [events, eventType, query],
  );

  return (
    <div className="space-y-5">
      {/* Application-level Audit Notice */}
      <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
        <p className="text-xs leading-relaxed text-slate-600">
          <span className="font-semibold text-slate-900">
            Application-level audit history:
          </span>{' '}
          Audit events are append-only through the application interface with no edit or
          delete controls. Because demonstration data resides in browser{' '}
          <span className="font-mono">localStorage</span>, this register is a functional
          prototype log rather than a tamper-proof production audit system.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 sm:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Consent ID or Subject ID..."
              aria-label="Search audit events"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <label htmlFor="audit-event-filter" className="text-xs font-medium text-slate-600 whitespace-nowrap">
              Event type
            </label>
            <select
              id="audit-event-filter"
              value={eventType}
              onChange={(e) => setEventType(e.target.value as AuditEventType | 'ALL')}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              {EVENT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Chronological Register */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <p className="text-xs font-medium text-slate-600">
            Showing{' '}
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {filteredEvents.length}
            </span>{' '}
            of{' '}
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {events.length}
            </span>{' '}
            chronological events
          </p>
          {(query || eventType !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setEventType('ALL');
              }}
              className="text-xs font-medium text-teal-700 hover:text-teal-900"
            >
              Reset filters
            </button>
          )}
        </div>

        {filteredEvents.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-semibold text-slate-900">
              No matching audit events
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Adjust your event type filter or search term to view recorded activity.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-600">
                  <th scope="col" className="py-3 pl-5 pr-3 whitespace-nowrap">
                    Event ID
                  </th>
                  <th scope="col" className="px-3 py-3 whitespace-nowrap">
                    Consent ID
                  </th>
                  <th scope="col" className="px-3 py-3 whitespace-nowrap">
                    Subject ID
                  </th>
                  <th scope="col" className="px-3 py-3 whitespace-nowrap">
                    Event type
                  </th>
                  <th scope="col" className="px-3 py-3 whitespace-nowrap">
                    Timestamp
                  </th>
                  <th scope="col" className="px-3 py-3 whitespace-nowrap">
                    Actor
                  </th>
                  <th scope="col" className="py-3 pl-3 pr-5 whitespace-nowrap">
                    Event description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredEvents.map((event) => {
                  const canInspect =
                    onInspectConsentId &&
                    event.consentId !== 'NONE' &&
                    event.consentId !== 'UNRESOLVED';
                  return (
                    <tr key={event.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="py-3.5 pl-5 pr-3 font-mono text-xs font-medium text-slate-900 tabular-nums whitespace-nowrap">
                        {event.id}
                      </td>
                      <td className="px-3 py-3.5 font-mono text-xs tabular-nums whitespace-nowrap">
                        {canInspect ? (
                          <button
                            type="button"
                            onClick={() => onInspectConsentId(event.consentId)}
                            className="font-medium text-teal-700 hover:text-teal-900 underline underline-offset-2"
                          >
                            {event.consentId}
                          </button>
                        ) : (
                          <span className="text-slate-500">{event.consentId}</span>
                        )}
                      </td>
                      <td className="px-3 py-3.5 font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
                        {event.subjectId}
                      </td>
                      <td className="px-3 py-3.5 whitespace-nowrap">
                        <EventTypeLabel eventType={event.eventType} />
                      </td>
                      <td className="px-3 py-3.5 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                        {formatTimestamp(event.timestamp)}
                      </td>
                      <td className="px-3 py-3.5 text-xs text-slate-700 whitespace-nowrap">
                        {event.actor}
                      </td>
                      <td className="py-3.5 pl-3 pr-5 text-xs leading-relaxed text-slate-700 min-w-[260px]">
                        {event.description}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
