import {
  Consent,
  ConsentPurpose,
  ConsentStats,
  ConsentStatus,
  CreateConsentInput,
  DataCategory,
  VerificationCheckItem,
  VerificationRequest,
  VerificationResult,
} from '../types/consent';
import { auditService } from './auditService';
import { storageService } from './storageService';

export function getTodayYmd(now: Date = new Date()): string {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isDateExpired(expiryDate: string, now: Date = new Date()): boolean {
  if (!expiryDate) return true;
  return expiryDate < getTodayYmd(now);
}

export function computeEffectiveStatus(consent: Consent, now: Date = new Date()): ConsentStatus {
  if (consent.status === 'Withdrawn') {
    return 'Withdrawn';
  }
  if (isDateExpired(consent.expiryDate, now)) {
    return 'Expired';
  }
  return 'Active';
}

function generateNextConsentId(existing: Consent[]): string {
  let maxNum = 1000;
  for (const record of existing) {
    const match = /^CNS-(\d+)$/.exec(record.id);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `CNS-${maxNum + 1}`;
}

function isAmbiguousValue(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  if (normalized.length < 3) return true;
  if (
    normalized === 'any' ||
    normalized === 'all' ||
    normalized === 'unknown' ||
    normalized === 'tbd' ||
    normalized === 'n/a' ||
    normalized === 'na' ||
    normalized.includes('*') ||
    normalized.includes('?')
  ) {
    return true;
  }
  return false;
}

export type ValidationErrors = Partial<Record<keyof CreateConsentInput, string>>;

export const consentService = {
  syncExpiredConsents(): Consent[] {
    const now = new Date();
    const stored = storageService.getConsents();
    let changed = false;

    const updated = stored.map((record) => {
      const effective = computeEffectiveStatus(record, now);
      if (record.status === 'Active' && effective === 'Expired') {
        changed = true;
        auditService.appendEvent({
          consentId: record.id,
          subjectId: record.subjectId,
          eventType: 'CONSENT_EXPIRED',
          actor: 'Policy Expiry Check',
          description: `Consent reached expiry date (${record.expiryDate}) and transitioned to Expired.`,
        });
        return { ...record, status: 'Expired' as ConsentStatus };
      }
      if (record.status !== effective) {
        changed = true;
        return { ...record, status: effective };
      }
      return record;
    });

    if (changed) {
      storageService.saveConsents(updated);
    }

    return updated;
  },

  getAllConsents(): Consent[] {
    const synced = this.syncExpiredConsents();
    return [...synced].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  },

  getConsentById(id: string): Consent | undefined {
    return this.getAllConsents().find((c) => c.id === id);
  },

  calculateStats(consents: Consent[]): ConsentStats {
    const now = new Date();
    let active = 0;
    let withdrawn = 0;
    let expired = 0;

    for (const consent of consents) {
      const status = computeEffectiveStatus(consent, now);
      if (status === 'Active') active += 1;
      else if (status === 'Withdrawn') withdrawn += 1;
      else expired += 1;
    }

    return {
      total: consents.length,
      active,
      withdrawn,
      expired,
    };
  },

  validateCreateConsent(input: CreateConsentInput): ValidationErrors {
    const errors: ValidationErrors = {};

    if (!input.subjectId.trim()) {
      errors.subjectId = 'Pseudonymous Subject ID is required.';
    }
    if (!input.organisation.trim()) {
      errors.organisation = 'Organisation name is required.';
    }
    if (!input.purpose) {
      errors.purpose = 'Please select a consent purpose.';
    }
    if (input.dataCategories.length === 0) {
      errors.dataCategories = 'Select at least one data category.';
    }
    if (!input.expiryDate) {
      errors.expiryDate = 'Expiry date is required.';
    } else if (input.expiryDate < getTodayYmd()) {
      errors.expiryDate = 'Expiry date cannot be in the past.';
    }
    if (!input.noticeVersion.trim()) {
      errors.noticeVersion = 'Consent notice version is required.';
    }
    if (!input.method.trim()) {
      errors.method = 'Consent method is required.';
    }

    return errors;
  },

  createConsent(input: CreateConsentInput): { consent?: Consent; errors?: ValidationErrors } {
    const errors = this.validateCreateConsent(input);
    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    const existing = storageService.getConsents();
    const now = new Date();
    const todayYmd = getTodayYmd(now);

    const newConsent: Consent = {
      id: generateNextConsentId(existing),
      subjectId: input.subjectId.trim(),
      organisation: input.organisation.trim(),
      purpose: input.purpose as ConsentPurpose,
      dataCategories: [...input.dataCategories],
      status: 'Active',
      dateGranted: todayYmd,
      expiryDate: input.expiryDate,
      noticeVersion: input.noticeVersion.trim() || '1.0',
      method: input.method.trim() || 'Explicit digital consent',
      createdAt: now.toISOString(),
    };

    storageService.saveConsents([newConsent, ...existing]);

    auditService.appendEvent({
      consentId: newConsent.id,
      subjectId: newConsent.subjectId,
      eventType: 'CONSENT_CREATED',
      actor: 'Community Steward',
      description: `Recorded active consent for ${newConsent.organisation} (${newConsent.purpose}).`,
      timestamp: now.toISOString(),
    });

    return { consent: newConsent };
  },

  withdrawConsent(consentId: string): Consent | null {
    const existing = this.syncExpiredConsents();
    const target = existing.find((c) => c.id === consentId);
    if (!target) return null;

    if (computeEffectiveStatus(target) !== 'Active') {
      return target;
    }

    const withdrawnAt = new Date().toISOString();
    const updatedConsent: Consent = {
      ...target,
      status: 'Withdrawn',
      withdrawnAt,
    };

    const nextList = existing.map((c) => (c.id === consentId ? updatedConsent : c));
    storageService.saveConsents(nextList);

    auditService.appendEvent({
      consentId: updatedConsent.id,
      subjectId: updatedConsent.subjectId,
      eventType: 'CONSENT_WITHDRAWN',
      actor: `Data Subject (${updatedConsent.subjectId})`,
      description: `Consent withdrawn for ${updatedConsent.organisation} (${updatedConsent.purpose}).`,
      timestamp: withdrawnAt,
    });

    return updatedConsent;
  },

  verifyConsent(request: VerificationRequest): VerificationResult {
    const now = new Date();
    const checkedAt = now.toISOString();
    const subjectId = request.subjectId.trim();
    const organisation = request.organisation.trim();
    const purpose = request.purpose;
    const dataCategory = request.dataCategory;

    // 1. Fail-closed check for incomplete or ambiguous inputs -> REVIEW
    const missingFields: string[] = [];
    if (!subjectId) missingFields.push('Subject ID');
    if (!organisation) missingFields.push('Organisation');
    if (!purpose) missingFields.push('Intended purpose');
    if (!dataCategory) missingFields.push('Requested data category');

    const ambiguousFields: string[] = [];
    if (subjectId && isAmbiguousValue(subjectId)) ambiguousFields.push('Subject ID');
    if (organisation && isAmbiguousValue(organisation)) ambiguousFields.push('Organisation');

    if (missingFields.length > 0 || ambiguousFields.length > 0) {
      const reasons: string[] = [];
      if (missingFields.length > 0) {
        reasons.push(`Missing required fields: ${missingFields.join(', ')}.`);
      }
      if (ambiguousFields.length > 0) {
        reasons.push(
          `Ambiguous or underspecified values in: ${ambiguousFields.join(', ')}.`,
        );
      }
      const reason = `${reasons.join(' ')} Verification fails closed until complete, unambiguous details are reviewed by a human steward.`;

      const checks: VerificationCheckItem[] = [
        {
          label: 'Subject ID provided',
          passed: subjectId && !isAmbiguousValue(subjectId) ? true : 'pending',
          detail: subjectId || 'Not provided',
        },
        {
          label: 'Organisation provided',
          passed: organisation && !isAmbiguousValue(organisation) ? true : 'pending',
          detail: organisation || 'Not provided',
        },
        {
          label: 'Intended purpose specified',
          passed: purpose ? true : 'pending',
          detail: purpose || 'Not specified',
        },
        {
          label: 'Data category specified',
          passed: dataCategory ? true : 'pending',
          detail: dataCategory || 'Not specified',
        },
      ];

      const auditEvent = auditService.appendEvent({
        consentId: 'UNRESOLVED',
        subjectId: subjectId || 'UNSPECIFIED',
        eventType: 'CONSENT_VERIFIED',
        actor: 'Verification Gateway',
        description: `Verification marked REVIEW (${reason})`,
        verificationOutcome: 'REVIEW',
        timestamp: checkedAt,
      });

      return {
        outcome: 'REVIEW',
        reason,
        checkedAt,
        auditEventId: auditEvent.id,
        checks,
      };
    }

    // 2. Evaluation against synced records
    const allConsents = this.syncExpiredConsents();
    const subjectMatches = allConsents.filter(
      (c) => c.subjectId.toLowerCase() === subjectId.toLowerCase(),
    );

    const orgMatches = subjectMatches.filter(
      (c) => c.organisation.toLowerCase() === organisation.toLowerCase(),
    );

    const purposeMatches = orgMatches.filter((c) => c.purpose === purpose);

    const categoryMatches = purposeMatches.filter((c) =>
      c.dataCategories.includes(dataCategory as DataCategory),
    );

    const activeValidMatches = categoryMatches.filter(
      (c) => computeEffectiveStatus(c, now) === 'Active',
    );

    if (activeValidMatches.length > 0) {
      const matched = activeValidMatches[0];
      const reason = `Active consent ${matched.id} covers ${matched.purpose} for ${matched.organisation} including "${dataCategory}", valid through ${matched.expiryDate}.`;

      const checks: VerificationCheckItem[] = [
        { label: 'Subject ID match', passed: true, detail: matched.subjectId },
        { label: 'Organisation match', passed: true, detail: matched.organisation },
        { label: 'Purpose match', passed: true, detail: matched.purpose },
        { label: 'Data category covered', passed: true, detail: dataCategory },
        { label: 'Consent status is Active', passed: true, detail: 'Active' },
        { label: 'Expiry date not passed', passed: true, detail: `Expires ${matched.expiryDate}` },
      ];

      const auditEvent = auditService.appendEvent({
        consentId: matched.id,
        subjectId: matched.subjectId,
        eventType: 'CONSENT_VERIFIED',
        actor: 'Verification Gateway',
        description: `Verification APPROVED for ${matched.organisation} (${matched.purpose} · ${dataCategory}).`,
        verificationOutcome: 'APPROVED',
        timestamp: checkedAt,
      });

      return {
        outcome: 'APPROVED',
        reason,
        matchedConsentId: matched.id,
        checkedAt,
        auditEventId: auditEvent.id,
        checks,
      };
    }

    // 3. Determine exact deterministic denial reason
    let reason = '';
    let referenceConsent: Consent | undefined;

    if (subjectMatches.length === 0) {
      reason = `No consent records found for Subject ID "${subjectId}".`;
    } else if (orgMatches.length === 0) {
      reason = `Subject "${subjectId}" has no consent records granted to "${organisation}".`;
    } else if (purposeMatches.length === 0) {
      referenceConsent = orgMatches[0];
      reason = `Consent ${referenceConsent.id} for "${organisation}" does not authorise the purpose "${purpose}".`;
    } else if (categoryMatches.length === 0) {
      referenceConsent = purposeMatches[0];
      reason = `Consent ${referenceConsent.id} does not include the requested data category "${dataCategory}".`;
    } else {
      referenceConsent = categoryMatches[0];
      const effectiveStatus = computeEffectiveStatus(referenceConsent, now);
      if (effectiveStatus === 'Withdrawn') {
        reason = `Matching consent ${referenceConsent.id} was withdrawn on ${referenceConsent.withdrawnAt?.slice(0, 10) ?? 'record'} and cannot authorise data access.`;
      } else {
        reason = `Matching consent ${referenceConsent.id} expired on ${referenceConsent.expiryDate} and is no longer active.`;
      }
    }

    const refStatus = referenceConsent ? computeEffectiveStatus(referenceConsent, now) : null;
    const checks: VerificationCheckItem[] = [
      {
        label: 'Subject ID match',
        passed: subjectMatches.length > 0,
        detail: subjectMatches.length > 0 ? subjectId : 'No record for subject',
      },
      {
        label: 'Organisation match',
        passed: orgMatches.length > 0,
        detail: orgMatches.length > 0 ? organisation : 'No record for organisation',
      },
      {
        label: 'Purpose match',
        passed: purposeMatches.length > 0,
        detail: purposeMatches.length > 0 ? purpose : `Purpose "${purpose}" not covered`,
      },
      {
        label: 'Data category covered',
        passed: categoryMatches.length > 0,
        detail:
          categoryMatches.length > 0
            ? dataCategory
            : `Category "${dataCategory}" not permitted`,
      },
      {
        label: 'Consent status is Active',
        passed: refStatus === 'Active',
        detail: refStatus ?? 'No matching active record',
      },
      {
        label: 'Expiry date not passed',
        passed: referenceConsent ? !isDateExpired(referenceConsent.expiryDate, now) : false,
        detail: referenceConsent ? `Expiry ${referenceConsent.expiryDate}` : 'Not applicable',
      },
    ];

    const auditEvent = auditService.appendEvent({
      consentId: referenceConsent?.id ?? 'NONE',
      subjectId,
      eventType: 'CONSENT_VERIFIED',
      actor: 'Verification Gateway',
      description: `Verification DENIED for ${organisation} (${purpose} · ${dataCategory}). ${reason}`,
      verificationOutcome: 'DENIED',
      timestamp: checkedAt,
    });

    return {
      outcome: 'DENIED',
      reason,
      matchedConsentId: referenceConsent?.id,
      checkedAt,
      auditEventId: auditEvent.id,
      checks,
    };
  },

  resetDemoData(): void {
    storageService.resetToDemoData();
  },
};
