import { AuditEvent, AuditEventType, VerificationOutcome } from '../types/consent';
import { storageService } from './storageService';

export interface AppendAuditEventInput {
  consentId: string;
  subjectId: string;
  eventType: AuditEventType;
  actor: string;
  description: string;
  verificationOutcome?: VerificationOutcome;
  timestamp?: string;
}

function generateNextAuditId(existing: AuditEvent[]): string {
  let maxNum = 1000;
  for (const event of existing) {
    const match = /^AUD-(\d+)$/.exec(event.id);
    if (match) {
      const num = parseInt(match[1], 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `AUD-${maxNum + 1}`;
}

export const auditService = {
  getAllEvents(): AuditEvent[] {
    const events = storageService.getAuditEvents();
    return [...events].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  },

  getEventsForConsent(consentId: string): AuditEvent[] {
    return this.getAllEvents().filter((event) => event.consentId === consentId);
  },

  appendEvent(input: AppendAuditEventInput): AuditEvent {
    const existing = storageService.getAuditEvents();
    const newEvent: AuditEvent = {
      id: generateNextAuditId(existing),
      consentId: input.consentId,
      subjectId: input.subjectId,
      eventType: input.eventType,
      timestamp: input.timestamp ?? new Date().toISOString(),
      actor: input.actor,
      description: input.description,
      ...(input.verificationOutcome ? { verificationOutcome: input.verificationOutcome } : {}),
    };
    storageService.saveAuditEvents([newEvent, ...existing]);
    return newEvent;
  },

  filterEvents(
    events: AuditEvent[],
    options: { eventType: AuditEventType | 'ALL'; query: string },
  ): AuditEvent[] {
    const q = options.query.trim().toLowerCase();
    return events.filter((event) => {
      if (options.eventType !== 'ALL' && event.eventType !== options.eventType) {
        return false;
      }
      if (!q) return true;
      return (
        event.consentId.toLowerCase().includes(q) ||
        event.subjectId.toLowerCase().includes(q) ||
        event.id.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q)
      );
    });
  },
};
