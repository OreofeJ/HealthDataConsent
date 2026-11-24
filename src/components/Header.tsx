import { Menu, User } from 'lucide-react';

interface HeaderProps {
  title: string;
  description: string;
  onOpenMobileMenu: () => void;
}

export function Header({ title, description, onOpenMobileMenu }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-semibold tracking-tight text-slate-900 sm:text-xl">
              {title}
            </h1>
            <p className="truncate text-xs text-slate-500 sm:text-sm">{description}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span
            className="inline-flex items-center rounded-md border border-slate-200 bg-slate-100 px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wider text-slate-700 whitespace-nowrap shrink-0"
            title="Demonstration environment using synthetic local data"
          >
            DEMO
          </span>

          <div className="flex items-center gap-2.5 border-l border-slate-200 pl-3">
            <div className="hidden text-right sm:block">
              <p className="text-xs font-medium text-slate-800 whitespace-nowrap">
                Community Steward
              </p>
              <p className="text-[11px] text-slate-500 whitespace-nowrap">
                Local Workspace
              </p>
            </div>
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600"
              aria-label="Profile placeholder"
            >
              <User className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
