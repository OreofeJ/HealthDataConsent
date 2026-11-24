import {
  AuditEvent,
  CONSENT_PURPOSES,
  Consent,
  ConsentPurpose,
  ConsentStatus,
  DATA_CATEGORIES,
  DataCategory,
} from '../types/consent';

const CONSENTS_KEY = 'hdc_consents_v1';
const AUDIT_EVENTS_KEY = 'hdc_audit_events_v1';
const DEMO_INITIALIZED_KEY = 'hdc_demo_initialized_v1';
const MIGRATION_120_KEY = 'hdc_seed_120_migrated_v1';

const FICTIONAL_ORGANISATIONS = [
  'Northbridge Health Research Trust',
  'Civic Mental Health Collaborative',
  'Harbourview Public Health Lab',
  'Midland Genomics Consortium',
  'OpenBiomed Data Commons',
  'Regional Epidemiology Institute',
  'CareMetrics Analytics Group',
  'Community Wellness Observatory',
  'Alderbrook Clinical Data Trust',
  'St. Jude Community Health Network',
  'Northern Population Health Archive',
  'Bridgewater Longitudinal Study Group',
] as const;

const CONSENT_METHODS = [
  'Explicit digital consent',
  'Explicit digital consent',
  'Signed community steward form',
  'Clinic intake digital consent',
] as const;

const NOTICE_VERSIONS = ['1.0', '1.1', '1.2', '1.3', '2.0'] as const;

// Exact distribution across the 6 existing purposes summing to 120 records:
// Research (26 + 18 + 24 = 68), AI Development (18), Data Analysis & Commercial (20 + 14 = 34)
const PURPOSE_SCHEDULE: ConsentPurpose[] = [
  ...Array<ConsentPurpose>(26).fill('Academic research'),
  ...Array<ConsentPurpose>(18).fill('Mental-health research'),
  ...Array<ConsentPurpose>(24).fill('Public-health research'),
  ...Array<ConsentPurpose>(18).fill('AI model development'),
  ...Array<ConsentPurpose>(20).fill('Anonymous statistical analysis'),
  ...Array<ConsentPurpose>(14).fill('Commercial research'),
];

const CATEGORIES_BY_PURPOSE: Record<ConsentPurpose, DataCategory[][]> = {
  'Academic research': [
    ['Demographic information', 'Health records'],
    ['Health records', 'Genomic information', 'Survey responses'],
    ['Demographic information', 'Health records', 'Survey responses'],
    ['Health records', 'Other research data'],
  ],
  'Mental-health research': [
    ['Mental-health information', 'Survey responses'],
    ['Demographic information', 'Mental-health information'],
    ['Mental-health information', 'Health records', 'Survey responses'],
  ],
  'Public-health research': [
    ['Demographic information', 'Health records', 'Location information'],
    ['Demographic information', 'Location information', 'Survey responses'],
    ['Health records', 'Survey responses', 'Other research data'],
  ],
  'AI model development': [
    ['Health records', 'Other research data'],
    ['Demographic information', 'Health records', 'Other research data'],
    ['Health records', 'Mental-health information', 'Other research data'],
  ],
  'Anonymous statistical analysis': [
    ['Demographic information', 'Survey responses'],
    ['Demographic information', 'Location information', 'Survey responses'],
    ['Survey responses', 'Other research data'],
  ],
  'Commercial research': [
    ['Demographic information', 'Health records'],
    ['Health records', 'Genomic information'],
    ['Survey responses', 'Other research data'],
  ],
};

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

function extractMaxNumericSuffix(items: { id: string }[], prefix: string, floor: number): number {
  let maxVal = floor;
  const pattern = new RegExp(`^${prefix}-(\\d+)$`);
  for (const item of items) {
    const match = pattern.exec(item.id);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxVal) maxVal = num;
    }
  }
  return maxVal;
}

function extractMaxSubjectSuffix(items: Consent[], floor: number): number {
  let maxVal = floor;
  const pattern = /^SUB-(\d+)$/;
  for (const item of items) {
    const match = pattern.exec(item.subjectId);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxVal) maxVal = num;
    }
  }
  return maxVal;
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

function createAdditional120SyntheticRecords(
  existingConsents: Consent[],
  existingAuditEvents: AuditEvent[],
): { consents: Consent[]; auditEvents: AuditEvent[] } {
  const now = new Date();
  const d = (offsetDays: number) => toLocalYmd(addDays(now, offsetDays));
  const iso = (offsetDays: number, hour: number, minute: number) => {
    const dt = addDays(now, offsetDays);
    dt.setHours(hour, minute, 0, 0);
    return dt.toISOString();
  };

  let nextConsentNum = extractMaxNumericSuffix(existingConsents, 'CNS', 1008) + 1;
  let nextSubjectNum = extractMaxSubjectSuffix(existingConsents, 1008) + 1;
  let nextAuditNum = extractMaxNumericSuffix(existingAuditEvents, 'AUD', 1013) + 1;

  const newConsents: Consent[] = [];
  const newAuditEvents: AuditEvent[] = [];

  for (let i = 0; i < 120; i += 1) {
    // Spread purpose deterministically using coprime stride across PURPOSE_SCHEDULE (120 items)
    const scheduleIndex = (i * 7) % PURPOSE_SCHEDULE.length;
    const purpose = PURPOSE_SCHEDULE[scheduleIndex] ?? CONSENT_PURPOSES[i % CONSENT_PURPOSES.length];

    const categoryPresets = CATEGORIES_BY_PURPOSE[purpose];
    const baseCategories = categoryPresets[i % categoryPresets.length];
    const dataCategories: DataCategory[] =
      i % 11 === 0 && !baseCategories.includes(DATA_CATEGORIES[i % DATA_CATEGORIES.length])
        ? [...baseCategories, DATA_CATEGORIES[i % DATA_CATEGORIES.length]]
        : [...baseCategories];

    // Status mixture across 120 records: 78 Active (~65%), 22 Withdrawn (~18.3%), 20 Expired (~16.7%)
    let status: ConsentStatus = 'Active';
    if (i % 6 === 2) {
      status = 'Expired';
    } else if (i % 5 === 4) {
      status = 'Withdrawn';
    }

    const organisation = FICTIONAL_ORGANISATIONS[(i * 5 + 3) % FICTIONAL_ORGANISATIONS.length];
    const method = CONSENT_METHODS[i % CONSENT_METHODS.length];
    const noticeVersion = NOTICE_VERSIONS[i % NOTICE_VERSIONS.length];

    const consentId = `CNS-${nextConsentNum++}`;
    const subjectId = `SUB-${nextSubjectNum++}`;

    const hour = 8 + (i % 10);
    const minute = (i * 7) % 60;

    let grantedOffsetDays: number;
    let expiryOffsetDays: number;
    let withdrawnAt: string | undefined;

    if (status === 'Active') {
      grantedOffsetDays = -((i * 3) % 175) - 3; // 3 to 177 days ago
      expiryOffsetDays = ((i * 11) % 360) + 30; // 30 to 389 days in future
    } else if (status === 'Withdrawn') {
      grantedOffsetDays = -((i * 4) % 210) - 45; // 45 to 254 days ago
      expiryOffsetDays = ((i * 9) % 280) + 40; // originally granted for future expiry
      const withdrawnOffsetDays = -Math.max(2, Math.floor(Math.abs(grantedOffsetDays) / 3));
      withdrawnAt = iso(withdrawnOffsetDays, (hour + 2) % 24, (minute + 17) % 60);
    } else {
      // Expired: expiry date strictly in the past
      expiryOffsetDays = -((i * 5) % 165) - 6; // 6 to 170 days in past
      grantedOffsetDays = expiryOffsetDays - 365;
    }

    const createdAt = iso(grantedOffsetDays, hour, minute);

    const consent: Consent = {
      id: consentId,
      subjectId,
      organisation,
      purpose,
      dataCategories,
      status,
      dateGranted: d(grantedOffsetDays),
      expiryDate: d(expiryOffsetDays),
      noticeVersion,
      method,
      createdAt,
      ...(withdrawnAt ? { withdrawnAt } : {}),
    };

    newConsents.push(consent);

    // 1. Creation audit event
    newAuditEvents.push({
      id: `AUD-${nextAuditNum++}`,
      consentId,
      subjectId,
      eventType: 'CONSENT_CREATED',
      timestamp: createdAt,
      actor: 'Community Steward',
      description: `Recorded active consent for ${organisation} (${purpose}).`,
    });

    // 2. Lifecycle audit event for Withdrawn or Expired records
    if (status === 'Withdrawn' && withdrawnAt) {
      newAuditEvents.push({
        id: `AUD-${nextAuditNum++}`,
        consentId,
        subjectId,
        eventType: 'CONSENT_WITHDRAWN',
        timestamp: withdrawnAt,
        actor: `Data Subject (${subjectId})`,
        description: `Consent withdrawn for ${organisation} (${purpose}).`,
      });
    } else if (status === 'Expired') {
      newAuditEvents.push({
        id: `AUD-${nextAuditNum++}`,
        consentId,
        subjectId,
        eventType: 'CONSENT_EXPIRED',
        timestamp: iso(expiryOffsetDays, 0, 5),
        actor: 'Policy Expiry Check',
        description: `Consent reached expiry date (${consent.expiryDate}) and transitioned to Expired.`,
      });
    }

    // 3. Synthetic verification events on select records
    if (i % 10 === 0) {
      const verifyOffset = status === 'Active' ? Math.max(grantedOffsetDays + 1, -14) : grantedOffsetDays + 5;
      newAuditEvents.push({
        id: `AUD-${nextAuditNum++}`,
        consentId,
        subjectId,
        eventType: 'CONSENT_VERIFIED',
        timestamp: iso(verifyOffset, 14, (minute + 11) % 60),
        actor: 'Verification Gateway',
        description: `Verification APPROVED for ${organisation} (${purpose} · ${dataCategories[0]}).`,
        verificationOutcome: 'APPROVED',
      });
    } else if (status === 'Withdrawn' && i % 15 === 4) {
      newAuditEvents.push({
        id: `AUD-${nextAuditNum++}`,
        consentId,
        subjectId,
        eventType: 'CONSENT_VERIFIED',
        timestamp: iso(-1, 11, (minute + 9) % 60),
        actor: 'Verification Gateway',
        description: `Verification DENIED for ${organisation} (${purpose} · ${dataCategories[0]}). Matching consent ${consentId} was withdrawn.`,
        verificationOutcome: 'DENIED',
      });
    }
  }

  return { consents: newConsents, auditEvents: newAuditEvents };
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

    // One-time migration adding 120 synthetic records without overwriting existing or user-created records
    const hasMigrated120 = window.localStorage.getItem(MIGRATION_120_KEY);
    if (!hasMigrated120) {
      const existingConsents = safeReadJson<Consent[]>(CONSENTS_KEY, []);
      const existingAuditEvents = safeReadJson<AuditEvent[]>(AUDIT_EVENTS_KEY, []);
      const batch = createAdditional120SyntheticRecords(
        existingConsents,
        existingAuditEvents,
      );
      safeWriteJson(CONSENTS_KEY, [...existingConsents, ...batch.consents]);
      safeWriteJson(AUDIT_EVENTS_KEY, [...existingAuditEvents, ...batch.auditEvents]);
      window.localStorage.setItem(MIGRATION_120_KEY, 'true');
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
    const base = createSeedDataset();
    const batch = createAdditional120SyntheticRecords(base.consents, base.auditEvents);
    safeWriteJson(CONSENTS_KEY, [...base.consents, ...batch.consents]);
    safeWriteJson(AUDIT_EVENTS_KEY, [...base.auditEvents, ...batch.auditEvents]);
    window.localStorage.setItem(DEMO_INITIALIZED_KEY, 'true');
    window.localStorage.setItem(MIGRATION_120_KEY, 'true');
  },
};
