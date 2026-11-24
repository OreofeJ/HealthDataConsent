import { useCallback, useEffect, useMemo, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { ConsentDetailDrawer } from './components/ConsentDetailDrawer';
import { CreateConsentModal } from './components/CreateConsentModal';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AuditTrail } from './pages/AuditTrail';
import { ConsentRecords } from './pages/ConsentRecords';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { VerifyConsent } from './pages/VerifyConsent';
import { auditService } from './services/auditService';
import { consentService } from './services/consentService';
import { AppPage, AuditEvent, Consent } from './types/consent';

const PAGE_META: Record<AppPage, { title: string; description: string }> = {
  overview: {
    title: 'Overview',
    description: 'Community health-data consent posture, recent records, and activity.',
  },
  records: {
    title: 'Consent Records',
    description: 'Searchable and filterable register of recorded data-use permissions.',
  },
  verify: {
    title: 'Verify Consent',
    description: 'Deterministic check to validate whether a proposed data use is authorised.',
  },
  audit: {
    title: 'Audit Trail',
    description: 'Chronological, append-only application log of consent lifecycle events.',
  },
  settings: {
    title: 'Settings',
    description: 'Prototype information, architecture notes, and demonstration data controls.',
  },
};

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [consents, setConsents] = useState<Consent[]>(() => consentService.getAllConsents());
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() =>
    auditService.getAllEvents(),
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedConsentId, setSelectedConsentId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshData = useCallback(() => {
    setConsents(consentService.getAllConsents());
    setAuditEvents(auditService.getAllEvents());
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const stats = useMemo(() => consentService.calculateStats(consents), [consents]);

  const selectedConsent = useMemo(
    () => consents.find((c) => c.id === selectedConsentId) ?? null,
    [consents, selectedConsentId],
  );

  const selectedConsentEvents = useMemo(
    () => (selectedConsentId ? auditEvents.filter((e) => e.consentId === selectedConsentId) : []),
    [auditEvents, selectedConsentId],
  );

  const handleCreatedConsent = (consent: Consent) => {
    refreshData();
    setCreateModalOpen(false);
    setToastMessage(`Consent ${consent.id} recorded for ${consent.subjectId} (${consent.organisation}).`);
  };

  const handleWithdrawConsent = (consentId: string) => {
    const updated = consentService.withdrawConsent(consentId);
    refreshData();
    if (updated) {
      setToastMessage(`Consent ${updated.id} has been withdrawn and logged to the Audit Trail.`);
    }
  };

  const handleInspectConsentId = (consentId: string) => {
    const found = consents.find((c) => c.id === consentId);
    if (found) {
      setSelectedConsentId(found.id);
    }
  };

  const handleResetDemoData = () => {
    consentService.resetDemoData();
    setSelectedConsentId(null);
    refreshData();
  };

  const meta = PAGE_META[activePage];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-h-screen flex-col lg:pl-64">
        <Header
          title={meta.title}
          description={meta.description}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {toastMessage && (
              <div
                role="status"
                aria-live="polite"
                className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-950"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                  <span>{toastMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setToastMessage(null)}
                  className="rounded p-1 text-teal-700 hover:bg-teal-100"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {activePage === 'overview' && (
              <Dashboard
                consents={consents}
                stats={stats}
                recentAuditEvents={auditEvents}
                onOpenCreate={() => setCreateModalOpen(true)}
                onSelectConsent={(c) => setSelectedConsentId(c.id)}
                onNavigate={setActivePage}
              />
            )}

            {activePage === 'records' && (
              <ConsentRecords
                consents={consents}
                onOpenCreate={() => setCreateModalOpen(true)}
                onSelectConsent={(c) => setSelectedConsentId(c.id)}
              />
            )}

            {activePage === 'verify' && (
              <VerifyConsent
                onVerificationLogged={refreshData}
                onInspectConsent={(c) => setSelectedConsentId(c.id)}
              />
            )}

            {activePage === 'audit' && (
              <AuditTrail
                events={auditEvents}
                onInspectConsentId={handleInspectConsentId}
              />
            )}

            {activePage === 'settings' && (
              <Settings
                totalConsents={consents.length}
                totalAuditEvents={auditEvents.length}
                onResetDemoData={handleResetDemoData}
              />
            )}
          </div>
        </main>
      </div>

      <CreateConsentModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={handleCreatedConsent}
      />

      <ConsentDetailDrawer
        consent={selectedConsent}
        relatedEvents={selectedConsentEvents}
        onClose={() => setSelectedConsentId(null)}
        onWithdraw={handleWithdrawConsent}
      />
    </div>
  );
}
