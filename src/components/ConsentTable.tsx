import { Eye } from 'lucide-react';
import { computeEffectiveStatus } from '../services/consentService';
import { Consent } from '../types/consent';
import { formatDateYmd } from '../utils/formatters';
import { StatusBadge } from './StatusBadge';

interface ConsentTableProps {
  consents: Consent[];
  variant?: 'preview' | 'full';
  onSelectConsent: (consent: Consent) => void;
}

export function ConsentTable({
  consents,
  variant = 'full',
  onSelectConsent,
}: ConsentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-600">
            <th scope="col" className="py-3 pl-5 pr-3 whitespace-nowrap">
              Consent ID
            </th>
            <th scope="col" className="px-3 py-3 whitespace-nowrap">
              Subject ID
            </th>
            <th scope="col" className="px-3 py-3 whitespace-nowrap">
              Organisation
            </th>
            <th scope="col" className="px-3 py-3 whitespace-nowrap">
              Purpose
            </th>
            {variant === 'full' && (
              <th scope="col" className="px-3 py-3 whitespace-nowrap">
                Data categories
              </th>
            )}
            <th scope="col" className="px-3 py-3 whitespace-nowrap">
              Status
            </th>
            <th scope="col" className="px-3 py-3 whitespace-nowrap">
              {variant === 'preview' ? 'Date created' : 'Date granted'}
            </th>
            {variant === 'full' && (
              <th scope="col" className="px-3 py-3 whitespace-nowrap">
                Expiry date
              </th>
            )}
            <th scope="col" className="py-3 pl-3 pr-5 text-right whitespace-nowrap">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {consents.map((consent) => {
            const effectiveStatus = computeEffectiveStatus(consent);
            return (
              <tr
                key={consent.id}
                className="transition-colors hover:bg-slate-50/80"
              >
                <td className="py-3.5 pl-5 pr-3 font-mono text-xs font-medium text-slate-900 tabular-nums whitespace-nowrap">
                  {consent.id}
                </td>
                <td className="px-3 py-3.5 font-mono text-xs text-slate-700 tabular-nums whitespace-nowrap">
                  {consent.subjectId}
                </td>
                <td className="px-3 py-3.5 text-slate-900 max-w-[220px] truncate">
                  {consent.organisation}
                </td>
                <td className="px-3 py-3.5 text-slate-600 whitespace-nowrap">
                  {consent.purpose}
                </td>
                {variant === 'full' && (
                  <td className="px-3 py-3.5 text-xs text-slate-600 max-w-[260px]">
                    <span className="line-clamp-2 leading-relaxed">
                      {consent.dataCategories.join(' · ')}
                    </span>
                  </td>
                )}
                <td className="px-3 py-3.5 whitespace-nowrap">
                  <StatusBadge status={effectiveStatus} />
                </td>
                <td className="px-3 py-3.5 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                  {formatDateYmd(consent.dateGranted)}
                </td>
                {variant === 'full' && (
                  <td className="px-3 py-3.5 font-mono text-xs text-slate-600 tabular-nums whitespace-nowrap">
                    {formatDateYmd(consent.expiryDate)}
                  </td>
                )}
                <td className="py-3.5 pl-3 pr-5 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onSelectConsent(consent)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:border-teal-300 hover:bg-teal-50/60 hover:text-teal-800 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  >
                    <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                    View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
