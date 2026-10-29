import React from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Building2 } from 'lucide-react';

export default function StepProfile({
  formData,
  errors,
  onChange,
  onNext,
  onBack,
}) {
  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-slate-500 font-semibold text-xs tracking-wider uppercase">
          <Building2 className="w-4 h-4 text-slate-700" aria-hidden="true" />
          <span>Stage 2 &bull; Business Profile</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
          Tell us about your business
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Provide your business identification details.
        </p>
      </div>

      {/* Profile Form Fields */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
        noValidate
        className="space-y-5"
      >
        {/* Customer Name & Business Name Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Customer Name */}
          <div>
            <label
              htmlFor="customerName"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Customer Name <span className="text-red-500" aria-label="Required">*</span>
            </label>
            <input
              id="customerName"
              name="customerName"
              type="text"
              autoComplete="name"
              value={formData.customerName || ''}
              onChange={(e) => onChange('customerName', e.target.value)}
              placeholder="e.g. Rajesh Sharma"
              aria-invalid={errors.customerName ? 'true' : 'false'}
              aria-describedby={errors.customerName ? 'customerName-error' : undefined}
              className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                errors.customerName
                  ? 'border-red-400 bg-red-50/20'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            />
            {errors.customerName && (
              <p
                id="customerName-error"
                role="alert"
                className="flex items-center text-xs text-red-600 font-medium mt-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden="true" />
                {errors.customerName}
              </p>
            )}
          </div>

          {/* Business Name */}
          <div>
            <label
              htmlFor="businessName"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Business Name <span className="text-red-500" aria-label="Required">*</span>
            </label>
            <input
              id="businessName"
              name="businessName"
              type="text"
              autoComplete="organization"
              value={formData.businessName || ''}
              onChange={(e) => onChange('businessName', e.target.value)}
              placeholder="e.g. Apex Global Exports Pvt Ltd"
              aria-invalid={errors.businessName ? 'true' : 'false'}
              aria-describedby={errors.businessName ? 'businessName-error' : undefined}
              className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                errors.businessName
                  ? 'border-red-400 bg-red-50/20'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            />
            {errors.businessName && (
              <p
                id="businessName-error"
                role="alert"
                className="flex items-center text-xs text-red-600 font-medium mt-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden="true" />
                {errors.businessName}
              </p>
            )}
          </div>
        </div>

        {/* GSTIN & IEC Code Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* GSTIN */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="gstin"
                className="block text-sm font-medium text-slate-800"
              >
                GSTIN <span className="text-red-500" aria-label="Required">*</span>
              </label>
              <span className="text-xs text-slate-400">15 characters</span>
            </div>
            <input
              id="gstin"
              name="gstin"
              type="text"
              autoCapitalize="characters"
              value={formData.gstin || ''}
              onChange={(e) => onChange('gstin', e.target.value.toUpperCase())}
              placeholder="e.g. 27AAAAA0000A1Z5"
              maxLength={15}
              aria-invalid={errors.gstin ? 'true' : 'false'}
              aria-describedby={errors.gstin ? 'gstin-error' : undefined}
              className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border text-sm font-mono uppercase text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                errors.gstin
                  ? 'border-red-400 bg-red-50/20'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            />
            {errors.gstin ? (
              <p
                id="gstin-error"
                role="alert"
                className="flex items-center text-xs text-red-600 font-medium mt-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden="true" />
                {errors.gstin}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                Standard Indian Goods and Services Tax Identification Number.
              </p>
            )}
          </div>

          {/* IEC Code */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="iecCode"
                className="block text-sm font-medium text-slate-800"
              >
                IEC Code <span className="text-red-500" aria-label="Required">*</span>
              </label>
              <span className="text-xs text-slate-400">10 characters</span>
            </div>
            <input
              id="iecCode"
              name="iecCode"
              type="text"
              autoCapitalize="characters"
              value={formData.iecCode || ''}
              onChange={(e) => onChange('iecCode', e.target.value.toUpperCase())}
              placeholder="e.g. 0123456789"
              maxLength={10}
              aria-invalid={errors.iecCode ? 'true' : 'false'}
              aria-describedby={errors.iecCode ? 'iecCode-error' : undefined}
              className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border text-sm font-mono uppercase text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                errors.iecCode
                  ? 'border-red-400 bg-red-50/20'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            />
            {errors.iecCode ? (
              <p
                id="iecCode-error"
                role="alert"
                className="flex items-center text-xs text-red-600 font-medium mt-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden="true" />
                {errors.iecCode}
              </p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                10-character Importer-Exporter Code issued by DGFT.
              </p>
            )}
          </div>
        </div>

        {/* ICEGATE ID & AD Code Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* ICEGATE ID (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="icegateId"
                className="block text-sm font-medium text-slate-800"
              >
                ICEGATE ID
              </label>
              <span className="text-xs text-slate-400">(Optional)</span>
            </div>
            <input
              id="icegateId"
              name="icegateId"
              type="text"
              value={formData.icegateId || ''}
              onChange={(e) => onChange('icegateId', e.target.value)}
              placeholder="e.g. USER_EXPORTS"
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Indian Customs Electronic Gateway user identifier.
            </p>
          </div>

          {/* AD Code (Optional) */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="adCode"
                className="block text-sm font-medium text-slate-800"
              >
                AD Code
              </label>
              <span className="text-xs text-slate-400">(Optional)</span>
            </div>
            <input
              id="adCode"
              name="adCode"
              type="text"
              value={formData.adCode || ''}
              onChange={(e) => onChange('adCode', e.target.value)}
              placeholder="e.g. 01234567890123"
              className="w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Authorized Dealer Code provided by your bank.
            </p>
          </div>
        </div>

        

        {/* Form Navigation Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Account
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors shadow-sm"
          >
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}

