export type ConsentStatus = 'Active' | 'Withdrawn' | 'Expired';

export const CONSENT_PURPOSES = [
  'Academic research',
  'Mental-health research',
  'Public-health research',
  'AI model development',
  'Anonymous statistical analysis',
  'Commercial research',
] as const;

export type ConsentPurpose = (typeof CONSENT_PURPOSES)[number];

export const DATA_CATEGORIES = [
  'Demographic information',
  'Health records',
  'Mental-health information',
  'Genomic information',
  'Location information',
  'Survey responses',
  'Other research data',
] as const;

export type DataCategory = (typeof DATA_CATEGORIES)[number];

export interface Consent {
  id: string;
  subjectId: string;
  organisation: string;
  purpose: ConsentPurpose;
  dataCategories: DataCategory[];
  status: ConsentStatus;
  dateGranted: string; // YYYY-MM-DD
  expiryDate: string; // YYYY-MM-DD
  noticeVersion: string;
  method: string;
  createdAt: string; // ISO 8601
  withdrawnAt?: string; // ISO 8601
}

export type AuditEventType =
  | 'CONSENT_CREATED'
  | 'CONSENT_WITHDRAWN'
  | 'CONSENT_VERIFIED'
  | 'CONSENT_EXPIRED';

export type VerificationOutcome = 'APPROVED' | 'DENIED' | 'REVIEW';

export interface AuditEvent {
  id: string;
  consentId: string;
  subjectId: string;
  eventType: AuditEventType;
  timestamp: string; // ISO 8601
  actor: string;
  description: string;
  verificationOutcome?: VerificationOutcome;
}

export interface VerificationRequest {
  subjectId: string;
  organisation: string;
  purpose: ConsentPurpose | '';
  dataCategory: DataCategory | '';
}

export interface VerificationCheckItem {
  label: string;
  passed: boolean | 'pending';
  detail: string;
}

export interface VerificationResult {
  outcome: VerificationOutcome;
  reason: string;
  matchedConsentId?: string;
  checkedAt: string;
  auditEventId: string;
  checks: VerificationCheckItem[];
}

export interface CreateConsentInput {
  subjectId: string;
  organisation: string;
  purpose: ConsentPurpose | '';
  dataCategories: DataCategory[];
  expiryDate: string;
  noticeVersion: string;
  method: string;
}

export interface ConsentStats {
  total: number;
  active: number;
  withdrawn: number;
  expired: number;
}

export type AppPage =
  | 'overview'
  | 'records'
  | 'verify'
  | 'audit'
  | 'settings';
