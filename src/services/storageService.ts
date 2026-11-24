import { AuditEvent, Consent } from '../types/consent';

const CONSENTS_KEY = 'hdc_consents_v1';
const AUDIT_EVENTS_KEY = 'hdc_audit_events_v1';
const DEMO_INITIALIZED_KEY = 'hdc_demo_initialized_v1';

function toLocalYmd(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function addDays(base: Date, days: number): Date {
  const copy = new Date(base);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function createSeedDataset(): { consents: Consent[]; auditEvents: AuditEvent[] } {
  const now = new Date();

  const d = (offsetDays: number) => toLocalYmd(addDays(now, offsetDays));
  const iso = (offsetDays: number, hour = 10, minute = 15) => {
    const dt = addDays(now, offsetDays);
    dt.setHours(hour, minute, 0, 0);
    return dt.toISOString();
  };

  const consents: Consent[] = [
    {
      id: 'CNS-1001',
      subjectId: 'SUB-1001',
      organisation: 'Northbridge Health Research Trust',
      purpose: 'Academic research',
      dataCategories: ['Demographic information', 'Health records', 'Survey responses'],
      status: 'Active',
      dateGranted: d(-95),
      expiryDate: d(270),
      noticeVersion: '1.2',
      method: 'Explicit digital consent',
      createdAt: iso(-95, 9, 20),
    },
    {
      id: 'CNS-1002',
      subjectId: 'SUB-1002',
      organisation: 'Civic Mental Health Collaborative',
      purpose: 'Mental-health research',
      dataCategories: ['Mental-health information', 'Survey responses'],
      status: 'Active',
      dateGranted: d(-64),
      expiryDate: d(301),
      noticeVersion: '1.0',
      method: 'Explicit digital consent',
      createdAt: iso(-64, 14, 5),
    },
    {
      id: 'CNS-1003',
      subjectId: 'SUB-1003',
      organisation: 'Harbourview Public Health Lab',
      purpose: 'Public-health research',
      dataCategories: ['Demographic information', 'Health records', 'Location information'],
      status: 'Withdrawn',
      dateGranted: d(-140),
      expiryDate: d(225),
      noticeVersion: '1.0',
      method: 'Explicit digital consent',
      createdAt: iso(-140, 11, 30),
      withdrawnAt: iso(-28, 16, 42),
    },
    {
      id: 'CNS-1004',
      subjectId: 'SUB-1004',
      organisation: 'Midland Genomics Consortium',
      purpose: 'Academic research',
      dataCategories: ['Genomic information', 'Health records'],
      status: 'Expired',
      dateGranted: d(-410),
      expiryDate: d(-45),
      noticeVersion: '1.0',
      method: 'Signed community steward form',
      createdAt: iso(-410, 10, 0),
    },
    {
      id: 'CNS-1005',
      subjectId: 'SUB-1005',
      organisation: 'OpenBiomed Data Commons',
      purpose: 'AI model development',
      dataCategories: ['Health records', 'Other research data'],
      status: 'Active',
      dateGranted: d(-35),
      expiryDate: d(180),
      noticeVersion: '1.3',
      method: 'Explicit digital consent',
      createdAt: iso(-35, 13, 18),
    },
    {
      id: 'CNS-1006',
      subjectId: 'SUB-1006',
      organisation: 'Regional Epidemiology Institute',
      purpose: 'Anonymous statistical analysis',
      dataCategories: ['Demographic information', 'Location information', 'Survey responses'],
      status: 'Active',
      dateGranted: d(-18),
      expiryDate: d(347),
      noticeVersion: '1.2',
      method: 'Explicit digital consent',
      createdAt: iso(-18, 15, 50),
    },
    {
      id: 'CNS-1007',
      subjectId: 'SUB-1007',
      organisation: 'CareMetrics Analytics Group',
      purpose: 'Commercial research',
      dataCategories: ['Demographic information', 'Health records'],
      status: 'Withdrawn',
      dateGranted: d(-110),
      expiryDate: d(255),
      noticeVersion: '1.1',
      method: 'Explicit digital consent',
      createdAt: iso(-110, 9, 45),
      withdrawnAt: iso(-12, 11, 10),
    },
    {
      id: 'CNS-1008',
      subjectId: 'SUB-1008',
      organisation: 'Community Wellness Observatory',
      purpose: 'Public-health research',
      dataCategories: ['Survey responses', 'Other research data'],
      status: 'Expired',
      dateGranted: d(-390),
      expiryDate: d(-25),
      noticeVersion: '1.0',
      method: 'Explicit digital consent',
      createdAt: iso(-390, 8, 30),
    },
  ];

  const auditEvents: AuditEvent[] = [
    {
      id: 'AUD-1013',
      consentId: 'CNS-1005',
      subjectId: 'SUB-1005',
      eventType: 'CONSENT_VERIFIED',
      timestamp: iso(-5, 14, 22),
      actor: 'Verification Gateway',
      description: 'Verification APPROVED for OpenBiomed Data Commons (AI model development · Health records).',
      verificationOutcome: 'APPROVED',
    },
    {
      id: 'AUD-1012',
      consentId: 'CNS-1007',
      subjectId: 'SUB-1007',
      eventType: 'CONSENT_WITHDRAWN',
      timestamp: iso(-12, 11, 10),
      actor: 'Data Subject (SUB-1007)',
      description: 'Consent withdrawn for CareMetrics Analytics Group (Commercial research).',
    },
    {
      id: 'AUD-1011',
      consentId: 'CNS-1006',
      subjectId: 'SUB-1006',
      eventType: 'CONSENT_CREATED',
      timestamp: iso(-18, 15, 50),
      actor: 'Community Steward',
      description: 'Recorded active consent for Regional Epidemiology Institute (Anonymous statistical analysis).',
    },
    {
      id: 'AUD-1010',
      consentId: 'CNS-1008',
      subjectId: 'SUB-1008',
      eventType: 'CONSENT_EXPIRED',
      timestamp: iso(-25, 0, 5),
      actor: 'Policy Expiry Check',
      description: `Consent reached expiry date (${d(-25)}) and transitioned to Expired.`,
    },
    {
      id: 'AUD-1009',
      consentId: 'CNS-1003',
      subjectId: 'SUB-1003',
      eventType: 'CONSENT_WITHDRAWN',
      timestamp: iso(-28, 16, 42),
      actor: 'Data Subject (SUB-1003)',
      description: 'Consent withdrawn for Harbourview Public Health Lab (Public-health research).',
    },
    {
      id: 'AUD-1008',
      consentId: 'CNS-1005',
      subjectId: 'SUB-1005',
      eventType: 'CONSENT_CREATED',
      timestamp: iso(-35, 13, 18),
      actor: 'Community Steward',
      description: 'Recorded active consent for OpenBiomed Data Commons (AI model development).',
    },
    {
      id: 'AUD-1007',
      consentId: 'CNS-1004',
      subjectId: 'SUB-1004',
      eventType: 'CONSENT_EXPIRED',
      timestamp: iso(-45, 0, 5),
      actor: 'Policy Expiry Check',
      description: `Consent reached expiry date (${d(-45)}) and transitioned to Expired.`,
    },
    {
      id: 'AUD-1006',
      consentId: 'CNS-1002',
      subjectId: 'SUB-1002',
      eventType: 'CONSENT_CREATED',
      timestamp: iso(-64, 14, 5),
      actor: 'Community Steward',
      description: 'Recorded active consent for Civic Mental Health Collaborative (Mental-health research).',
    },
    {
      id: 'AUD-1005',
      consentId: 'CNS-1001',
      subjectId: 'SUB-1001',
      eventType: 'CONSENT_CREATED',
      timestamp: iso(-95, 9, 20),
      actor: 'Community Steward',
      description: 'Recorded active consent for Northbridge Health Research Trust (Academic research).',
    },
    {
      id: 'AUD-1004',
      consentId: 'CNS-1007',
      subjectId: 'SUB-1007',
      eventType: 'CONSENT_CREATED',
      timestamp: iso(-110, 9, 45),
      actor: 'Community Steward',
      description: 'Recorded active consent for CareMetrics Analytics Group (Commercial research).',
    },
    {
      id: 'AUD-1003',
      consentId: 'CNS-1003',
      subjectId: 'SUB-1003',
      eventType: 'CONSENT_CREATED',
      timestamp: iso(-140, 11, 30),
      actor: 'Community Steward',
      description: 'Recorded active consent for Harbourview Public Health Lab (Public-health research).',
    },
    {
      id: 'AUD-1002',
      consentId: 'CNS-1008',
      subjectId: 'SUB-1008',
      eventType: 'CONSENT_CREATED',
      timestamp: iso(-390, 8, 30),
      actor: 'Community Steward',
      description: 'Recorded active consent for Community Wellness Observatory (Public-health research).',
    },
    {
      id: 'AUD-1001',
      consentId: 'CNS-1004',
      subjectId: 'SUB-1004',
      eventType: 'CONSENT_CREATED',
      timestamp: iso(-410, 10, 0),
      actor: 'Community Steward',
      description: 'Recorded active consent for Midland Genomics Consortium (Academic research).',
    },
  ];

  return { consents, auditEvents };
}

function safeReadJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export const storageService = {
  ensureInitialized(): void {
    const isInitialized = window.localStorage.getItem(DEMO_INITIALIZED_KEY);
    if (!isInitialized) {
      const seed = createSeedDataset();
      safeWriteJson(CONSENTS_KEY, seed.consents);
      safeWriteJson(AUDIT_EVENTS_KEY, seed.auditEvents);
      window.localStorage.setItem(DEMO_INITIALIZED_KEY, 'true');
    }
  },

  getConsents(): Consent[] {
    this.ensureInitialized();
    return safeReadJson<Consent[]>(CONSENTS_KEY, []);
  },

  saveConsents(consents: Consent[]): void {
    safeWriteJson(CONSENTS_KEY, consents);
  },

  getAuditEvents(): AuditEvent[] {
    this.ensureInitialized();
    return safeReadJson<AuditEvent[]>(AUDIT_EVENTS_KEY, []);
  },

  saveAuditEvents(events: AuditEvent[]): void {
    safeWriteJson(AUDIT_EVENTS_KEY, events);
  },

  resetToDemoData(): void {
    const seed = createSeedDataset();
    safeWriteJson(CONSENTS_KEY, seed.consents);
    safeWriteJson(AUDIT_EVENTS_KEY, seed.auditEvents);
    window.localStorage.setItem(DEMO_INITIALIZED_KEY, 'true');
  },
};
