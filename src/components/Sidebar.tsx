import {
  FileCheck2,
  History,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';
import { AppPage } from '../types/consent';

interface SidebarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: { id: AppPage; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'records', label: 'Consent Records', icon: FileCheck2 },
  { id: 'verify', label: 'Verify Consent', icon: ShieldCheck },
  { id: 'audit', label: 'Audit Trail', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function Sidebar({
  activePage,
  onNavigate,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const handleSelect = (page: AppPage) => {
    onNavigate(page);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col bg-[#0B2536] text-slate-100">
      {/* Brand Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <button
          type="button"
          onClick={() => handleSelect('overview')}
          className="flex items-center gap-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-lg"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-600/20 border border-teal-400/30">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-teal-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2.5L4.5 5.8v5.5c0 5 3.2 9.4 7.5 10.7 4.3-1.3 7.5-5.7 7.5-10.7V5.8L12 2.5z" />
              <path d="M9 12.2l2 2 4-4.2" />
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block font-display text-[15px] font-semibold tracking-tight text-white whitespace-nowrap">
              HealthDataConsent
            </span>
            <span className="block text-[11px] text-slate-300/80 whitespace-nowrap">
              Community Governance
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={onCloseMobile}
          className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
          aria-label="Close navigation menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Primary navigation" className="flex-1 space-y-1 px-3 py-5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                isActive
                  ? 'bg-teal-600/25 text-white border border-teal-400/30'
                  : 'text-slate-300 hover:bg-white/8 hover:text-white border border-transparent'
              }`}
            >
              <Icon
                className={`h-4 w-4 shrink-0 ${
                  isActive ? 'text-teal-300' : 'text-slate-400'
                }`}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Quiet Prototype Attribution */}
      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-xs font-medium text-slate-300">Open-Source MVP</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
          Synthetic data only.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop persistent sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-64 lg:flex-col border-r border-slate-900/10">
        {navContent}
      </aside>

      {/* Mobile/Tablet overlay drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-slate-950/50 transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative z-10 flex w-68 max-w-[85vw] flex-col shadow-xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
