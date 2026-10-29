import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Edit2, FileText, Check } from 'lucide-react';

export default function StepFinish({
  formData,
  onNavigateStep,
  onBack,
  isCompleted = false,
  onComplete,
}) {
  const [localCompleted, setLocalCompleted] = useState(false);
  const isDone = isCompleted || localCompleted;

  const formatFileSize = (bytes) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleReviewComplete = () => {
    setLocalCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-slate-500 font-semibold text-xs tracking-wider uppercase">
          <CheckCircle2 className="w-4 h-4 text-slate-700" aria-hidden="true" />
          <span>Stage 4 &bull; Final Review</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
          Review your business information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Check the details you entered before continuing.
        </p>
      </div>

      {/* Completion Success Message Banner */}
      {isDone && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 shadow-sm flex items-center space-x-3"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-emerald-700 stroke-[2.5]" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-emerald-900">
            Onboarding review completed successfully.
          </p>
        </div>
      )}

      {/* Read-Only Summary Sections */}
      <div className="space-y-6">
        {/* 1. Business Identification Details */}
        <section
          aria-labelledby="review-business-heading"
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3
              id="review-business-heading"
              className="text-sm font-semibold text-slate-900 uppercase tracking-wider"
            >
              Business Identification Details
            </h3>
            <button
              type="button"
              onClick={() => onNavigateStep(2)}
              className="inline-flex items-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-md transition-colors"
              aria-label="Edit Business Identification Details"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              Edit
            </button>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 pt-3 text-xs">
            <div>
              <dt className="text-slate-400 font-medium">Customer Name</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {formData.customerName || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 font-medium">Business Name</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {formData.businessName || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 font-medium">GSTIN</dt>
              <dd className="mt-0.5 text-sm font-mono font-medium text-slate-900">
                {formData.gstin || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 font-medium">IEC Code</dt>
              <dd className="mt-0.5 text-sm font-mono font-medium text-slate-900">
                {formData.iecCode || '—'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 font-medium">ICEGATE ID</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {formData.icegateId || <span className="text-slate-400 italic">Not provided</span>}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400 font-medium">AD Code</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {formData.adCode || <span className="text-slate-400 italic">Not provided</span>}
              </dd>
            </div>
          </dl>
        </section>

        {/* 2. Contact and Location Details */}
        <section
          aria-labelledby="review-locations-heading"
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3
              id="review-locations-heading"
              className="text-sm font-semibold text-slate-900 uppercase tracking-wider"
            >
              Contact & Location Details
            </h3>
            <button
              type="button"
              onClick={() => onNavigateStep(3)}
              className="inline-flex items-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-md transition-colors"
              aria-label="Edit Contact and Location Details"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              Edit
            </button>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 pt-3 text-xs">
            <div className="sm:col-span-2">
              <dt className="text-slate-400 font-medium">Business Email Address</dt>
              <dd className="mt-0.5 text-sm font-medium text-slate-900">
                {formData.email || '—'}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-400 font-medium">Registered Office Address</dt>
              <dd className="mt-0.5 text-sm text-slate-900">
                {formData.registeredAddress || '—'}
                {formData.registeredPin && (
                  <span className="font-semibold text-slate-800 ml-1">
                    — PIN: {formData.registeredPin}
                  </span>
                )}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-400 font-medium flex items-center gap-2">
                <span>Warehouse Pickup Address</span>
                {formData.isSameAddress && (
                  <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    Same as registered office
                  </span>
                )}
              </dt>
              <dd className="mt-0.5 text-sm text-slate-900">
                {formData.warehouseAddress || '—'}
                {formData.warehousePin && (
                  <span className="font-semibold text-slate-800 ml-1">
                    — PIN: {formData.warehousePin}
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </section>

        {/* 3. Supporting Documents */}
        <section
          aria-labelledby="review-documents-heading"
          className="rounded-xl border border-slate-200 bg-white p-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3
              id="review-documents-heading"
              className="text-sm font-semibold text-slate-900 uppercase tracking-wider"
            >
              Supporting Documents
            </h3>
            <button
              type="button"
              onClick={() => onNavigateStep(3)}
              className="inline-flex items-center text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1.5 rounded-md transition-colors"
              aria-label="Edit Supporting Documents"
            >
              <Edit2 className="w-3.5 h-3.5 mr-1" aria-hidden="true" />
              Edit
            </button>
          </div>

          <div className="divide-y divide-slate-100 pt-1 text-xs">
            {/* GST */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">GST Registration Certificate</p>
                <p className="text-[11px] text-slate-400">Mandatory identification</p>
              </div>
              <div className="text-right">
                {formData.documents?.gstCertificate ? (
                  <span className="inline-flex items-center text-xs font-medium text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                    <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" aria-hidden="true" />
                    {formData.documents.gstCertificate.name} (
                    {formatFileSize(formData.documents.gstCertificate.size)})
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">Missing</span>
                )}
              </div>
            </div>

            {/* IEC */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">IEC Certificate</p>
                <p className="text-[11px] text-slate-400">DGFT export code document</p>
              </div>
              <div className="text-right">
                {formData.documents?.iecCertificate ? (
                  <span className="inline-flex items-center text-xs font-medium text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                    <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" aria-hidden="true" />
                    {formData.documents.iecCertificate.name} (
                    {formatFileSize(formData.documents.iecCertificate.size)})
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">Missing</span>
                )}
              </div>
            </div>

            {/* Aadhaar */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Aadhaar Card PDF</p>
                <p className="text-[11px] text-slate-400">Authorized signatory identity</p>
              </div>
              <div className="text-right">
                {formData.documents?.aadhaarCard ? (
                  <span className="inline-flex items-center text-xs font-medium text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                    <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" aria-hidden="true" />
                    {formData.documents.aadhaarCard.name} (
                    {formatFileSize(formData.documents.aadhaarCard.size)})
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">Missing</span>
                )}
              </div>
            </div>

            {/* Cheque / Passbook */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">Cancelled Cheque or Bank Passbook Copy</p>
                <p className="text-[11px] text-slate-400">Bank account confirmation</p>
              </div>
              <div className="text-right">
                {formData.documents?.cancelledCheque ? (
                  <span className="inline-flex items-center text-xs font-medium text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                    <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" aria-hidden="true" />
                    {formData.documents.cancelledCheque.name} (
                    {formatFileSize(formData.documents.cancelledCheque.size)})
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Not uploaded (Optional)</span>
                )}
              </div>
            </div>

            {/* LUT */}
            <div className="py-2.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-800">LUT (Letter of Undertaking) Document</p>
                <p className="text-[11px] text-slate-400">Zero-rated export GST undertaking</p>
              </div>
              <div className="text-right">
                {formData.documents?.lutDocument ? (
                  <span className="inline-flex items-center text-xs font-medium text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                    <FileText className="w-3.5 h-3.5 mr-1 text-blue-600" aria-hidden="true" />
                    {formData.documents.lutDocument.name} (
                    {formatFileSize(formData.documents.lutDocument.size)})
                  </span>
                ) : (
                  <span className="text-slate-400 italic">Not uploaded (Optional)</span>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Form Navigation Controls */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Back to Details
        </button>

        <button
          type="button"
          onClick={handleReviewComplete}
          className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors shadow-sm"
        >
          <Check className="w-4 h-4 mr-2" aria-hidden="true" />
          Review Complete
        </button>
      </div>
    </div>
  );
}
