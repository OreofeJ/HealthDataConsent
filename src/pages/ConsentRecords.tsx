import { useMemo, useState } from 'react';
import { ArrowUpDown, Plus, Search, X } from 'lucide-react';
import { ConsentTable } from '../components/ConsentTable';
import { computeEffectiveStatus } from '../services/consentService';
import { Consent, ConsentStatus } from '../types/consent';

interface ConsentRecordsProps {
  consents: Consent[];
  onOpenCreate: () => void;
  onSelectConsent: (consent: Consent) => void;
}

type StatusFilter = 'All' | ConsentStatus;
type SortOrder = 'newest' | 'oldest' | 'expiry_asc';

const STATUS_FILTERS: StatusFilter[] = ['All', 'Active', 'Withdrawn', 'Expired'];

export function ConsentRecords({
  consents,
  onOpenCreate,
  onSelectConsent,
}: ConsentRecordsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const filteredConsents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = consents.filter((record) => {
      const effectiveStatus = computeEffectiveStatus(record);
      if (statusFilter !== 'All' && effectiveStatus !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        record.id.toLowerCase().includes(q) ||
        record.subjectId.toLowerCase().includes(q) ||
        record.organisation.toLowerCase().includes(q)
      );
    });

    return [...filtered].sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.dateGranted.localeCompare(a.dateGranted) || b.createdAt.localeCompare(a.createdAt);
      }
      if (sortOrder === 'oldest') {
        return a.dateGranted.localeCompare(b.dateGranted) || a.createdAt.localeCompare(b.createdAt);
      }
      return a.expiryDate.localeCompare(b.expiryDate);
    });
  }, [consents, searchQuery, statusFilter, sortOrder]);

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setSortOrder('newest');
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <div className="relative flex-1 lg:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Consent ID, Subject ID, or organisation..."
              aria-label="Search consent records"
              className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-8 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-slate-400 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Status Filter Segmented Controls */}
            <div
              className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 p-1"
              role="group"
              aria-label="Filter consents by status"
            >
              {STATUS_FILTERS.map((status) => {
                const active = statusFilter === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    aria-pressed={active}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                      active
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {status}
                  </button>
                );
              })}
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 shrink-0" aria-hidden="true" />
              <select
                aria-label="Sort consent records"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
              >
                <option value="newest">Date granted: Newest</option>
                <option value="oldest">Date granted: Oldest</option>
                <option value="expiry_asc">Expiry date: Soonest</option>
              </select>
            </div>

            <button
              type="button"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3.5 py-2 text-xs font-medium text-white hover:bg-teal-800 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Create Consent
            </button>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
          <p className="text-xs font-medium text-slate-600">
            Showing{' '}
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {filteredConsents.length}
            </span>{' '}
            of{' '}
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {consents.length}
            </span>{' '}
            records
          </p>
          {(searchQuery || statusFilter !== 'All') && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs font-medium text-teal-700 hover:text-teal-900"
            >
              Reset filters
            </button>
          )}
        </div>

        {filteredConsents.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm font-semibold text-slate-900">
              No matching consent records
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Try adjusting your search query or status filter, or record a new consent.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Clear filters
              </button>
              <button
                type="button"
                onClick={onOpenCreate}
                className="inline-flex items-center gap-1.5 rounded-lg bg-teal-700 px-3.5 py-2 text-xs font-medium text-white hover:bg-teal-800"
              >
                <Plus className="h-3.5 w-3.5" />
                Create Consent
              </button>
            </div>
          </div>
        ) : (
          <ConsentTable
            consents={filteredConsents}
            variant="full"
            onSelectConsent={onSelectConsent}
          />
        )}
      </div>
    </div>
  );
}
