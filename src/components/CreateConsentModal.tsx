import { useState, type FormEvent } from 'react';
import { Check, X } from 'lucide-react';
import {
  consentService,
  getTodayYmd,
  ValidationErrors,
} from '../services/consentService';
import {
  CONSENT_PURPOSES,
  Consent,
  CreateConsentInput,
  DATA_CATEGORIES,
  DataCategory,
} from '../types/consent';

interface CreateConsentModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: (consent: Consent) => void;
}

function getDefaultExpiryDate(): string {
  const dt = new Date();
  dt.setFullYear(dt.getFullYear() + 1);
  return getTodayYmd(dt);
}

const INITIAL_FORM = (): CreateConsentInput => ({
  subjectId: '',
  organisation: '',
  purpose: '',
  dataCategories: [],
  expiryDate: getDefaultExpiryDate(),
  noticeVersion: '1.0',
  method: 'Explicit digital consent',
});

export function CreateConsentModal({
  open,
  onClose,
  onCreated,
}: CreateConsentModalProps) {
  const [form, setForm] = useState<CreateConsentInput>(INITIAL_FORM);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const todayYmd = getTodayYmd();

  if (!open) return null;

  const toggleCategory = (category: DataCategory) => {
    setForm((prev) => {
      const exists = prev.dataCategories.includes(category);
      const next = exists
        ? prev.dataCategories.filter((item) => item !== category)
        : [...prev.dataCategories, category];
      return { ...prev, dataCategories: next };
    });
    if (errors.dataCategories) {
      setErrors((prev) => ({ ...prev, dataCategories: undefined }));
    }
  };

  const handleClose = () => {
    setForm(INITIAL_FORM());
    setErrors({});
    onClose();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = consentService.createConsent(form);
    if (result.errors) {
      setErrors(result.errors);
      return;
    }
    if (result.consent) {
      setForm(INITIAL_FORM());
      setErrors({});
      onCreated(result.consent);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-consent-title"
    >
      <div
        className="fixed inset-0 bg-slate-950/50 backdrop-blur-[1px]"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-4">
          <div>
            <h2
              id="create-consent-title"
              className="font-display text-lg font-semibold text-slate-900"
            >
              Record New Consent
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Capture granular, purpose-specific data permission using a pseudonymous identifier.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="subjectId"
                  className="block text-xs font-medium text-slate-700"
                >
                  Pseudonymous Subject ID <span className="text-rose-600">*</span>
                </label>
                <input
                  id="subjectId"
                  type="text"
                  value={form.subjectId}
                  onChange={(e) => {
                    setForm({ ...form, subjectId: e.target.value });
                    if (errors.subjectId) setErrors({ ...errors, subjectId: undefined });
                  }}
                  placeholder="e.g. SUB-1009"
                  className={`mt-1.5 w-full rounded-lg border px-3 py-2 font-mono text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                    errors.subjectId ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.subjectId && (
                  <p className="mt-1 text-xs text-rose-700">{errors.subjectId}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="organisation"
                  className="block text-xs font-medium text-slate-700"
                >
                  Organisation <span className="text-rose-600">*</span>
                </label>
                <input
                  id="organisation"
                  type="text"
                  value={form.organisation}
                  onChange={(e) => {
                    setForm({ ...form, organisation: e.target.value });
                    if (errors.organisation) setErrors({ ...errors, organisation: undefined });
                  }}
                  placeholder="e.g. Northbridge Health Research Trust"
                  className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                    errors.organisation
                      ? 'border-rose-400 bg-rose-50/40'
                      : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.organisation && (
                  <p className="mt-1 text-xs text-rose-700">{errors.organisation}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="purpose"
                  className="block text-xs font-medium text-slate-700"
                >
                  Consent purpose <span className="text-rose-600">*</span>
                </label>
                <select
                  id="purpose"
                  value={form.purpose}
                  onChange={(e) => {
                    setForm({ ...form, purpose: e.target.value as CreateConsentInput['purpose'] });
                    if (errors.purpose) setErrors({ ...errors, purpose: undefined });
                  }}
                  className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                    errors.purpose ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300 bg-white'
                  }`}
                >
                  <option value="">Select a purpose...</option>
                  {CONSENT_PURPOSES.map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
                {errors.purpose && (
                  <p className="mt-1 text-xs text-rose-700">{errors.purpose}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="expiryDate"
                  className="block text-xs font-medium text-slate-700"
                >
                  Expiry date <span className="text-rose-600">*</span>
                </label>
                <input
                  id="expiryDate"
                  type="date"
                  min={todayYmd}
                  value={form.expiryDate}
                  onChange={(e) => {
                    setForm({ ...form, expiryDate: e.target.value });
                    if (errors.expiryDate) setErrors({ ...errors, expiryDate: undefined });
                  }}
                  className={`mt-1.5 w-full rounded-lg border px-3 py-2 font-mono text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                    errors.expiryDate ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.expiryDate && (
                  <p className="mt-1 text-xs text-rose-700">{errors.expiryDate}</p>
                )}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-700">
                Data categories <span className="text-rose-600">*</span>
              </span>
              <p className="mt-0.5 text-xs text-slate-500">
                Select one or more data categories covered by this consent.
              </p>

              <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
                {DATA_CATEGORIES.map((category) => {
                  const checked = form.dataCategories.includes(category);
                  return (
                    <label
                      key={category}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                        checked
                          ? 'border-teal-600 bg-teal-50/70 text-teal-950'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(category)}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          checked
                            ? 'border-teal-700 bg-teal-700 text-white'
                            : 'border-slate-300 bg-white'
                        }`}
                        aria-hidden="true"
                      >
                        {checked && <Check className="h-3 w-3" strokeWidth={2.5} />}
                      </span>
                      <span className="text-xs font-medium">{category}</span>
                    </label>
                  );
                })}
              </div>
              {errors.dataCategories && (
                <p className="mt-1.5 text-xs text-rose-700">{errors.dataCategories}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="noticeVersion"
                  className="block text-xs font-medium text-slate-700"
                >
                  Consent notice version
                </label>
                <input
                  id="noticeVersion"
                  type="text"
                  value={form.noticeVersion}
                  onChange={(e) => {
                    setForm({ ...form, noticeVersion: e.target.value });
                    if (errors.noticeVersion) setErrors({ ...errors, noticeVersion: undefined });
                  }}
                  className={`mt-1.5 w-full rounded-lg border px-3 py-2 font-mono text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                    errors.noticeVersion
                      ? 'border-rose-400 bg-rose-50/40'
                      : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.noticeVersion && (
                  <p className="mt-1 text-xs text-rose-700">{errors.noticeVersion}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="method"
                  className="block text-xs font-medium text-slate-700"
                >
                  Consent method
                </label>
                <input
                  id="method"
                  type="text"
                  value={form.method}
                  onChange={(e) => {
                    setForm({ ...form, method: e.target.value });
                    if (errors.method) setErrors({ ...errors, method: undefined });
                  }}
                  className={`mt-1.5 w-full rounded-lg border px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                    errors.method ? 'border-rose-400 bg-rose-50/40' : 'border-slate-300 bg-white'
                  }`}
                />
                {errors.method && (
                  <p className="mt-1 text-xs text-rose-700">{errors.method}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-1"
            >
              Save Consent Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
