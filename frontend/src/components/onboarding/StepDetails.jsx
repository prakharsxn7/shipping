import React from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, MapPin, FileCheck2 } from 'lucide-react';
import PdfUploadField from './PdfUploadField';

export default function StepDetails({
  formData,
  errors,
  onChange,
  onSameAddressToggle,
  onFileChange,
  onFileError,
  onNext,
  onBack,
}) {
  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-slate-500 font-semibold text-xs tracking-wider uppercase">
          <MapPin className="w-4 h-4 text-slate-700" aria-hidden="true" />
          <span>Stage 3 &bull; Details & Documents</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-1">
          Complete your business details
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add contact information and upload your supporting documents.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onNext();
        }}
        noValidate
        className="space-y-8"
      >
        {/* ================= SECTION A: CONTACT AND LOCATIONS ================= */}
        <section aria-labelledby="contact-locations-heading" className="space-y-5">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-2">
            <MapPin className="w-4 h-4 text-slate-700" aria-hidden="true" />
            <h3 id="contact-locations-heading" className="text-base font-semibold text-slate-900">
              A. Contact and Locations
            </h3>
          </div>

          {/* Business Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-800 mb-1.5"
            >
              Business Email Address <span className="text-red-500" aria-label="Required">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email || ''}
              onChange={(e) => onChange('email', e.target.value)}
              placeholder="export@company.com"
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                errors.email
                  ? 'border-red-400 bg-red-50/20'
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="flex items-center text-xs text-red-600 font-medium mt-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden="true" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Registered Office Address & PIN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <label
                htmlFor="registeredAddress"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Registered Office Address <span className="text-red-500" aria-label="Required">*</span>
              </label>
              <input
                id="registeredAddress"
                name="registeredAddress"
                type="text"
                autoComplete="street-address"
                value={formData.registeredAddress || ''}
                onChange={(e) => onChange('registeredAddress', e.target.value)}
                placeholder="Building, street name, area, city, state"
                aria-invalid={errors.registeredAddress ? 'true' : 'false'}
                aria-describedby={errors.registeredAddress ? 'registeredAddress-error' : undefined}
                className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  errors.registeredAddress
                    ? 'border-red-400 bg-red-50/20'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              />
              {errors.registeredAddress && (
                <p
                  id="registeredAddress-error"
                  role="alert"
                  className="flex items-center text-xs text-red-600 font-medium mt-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden="true" />
                  {errors.registeredAddress}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="registeredPin"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Registered Office PIN Code <span className="text-red-500" aria-label="Required">*</span>
              </label>
              <input
                id="registeredPin"
                name="registeredPin"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={formData.registeredPin || ''}
                onChange={(e) => onChange('registeredPin', e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="e.g. 400001"
                aria-invalid={errors.registeredPin ? 'true' : 'false'}
                aria-describedby={errors.registeredPin ? 'registeredPin-error' : undefined}
                className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  errors.registeredPin
                    ? 'border-red-400 bg-red-50/20'
                    : 'border-slate-300 hover:border-slate-400'
                }`}
              />
              {errors.registeredPin && (
                <p
                  id="registeredPin-error"
                  role="alert"
                  className="flex items-center text-xs text-red-600 font-medium mt-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden="true" />
                  {errors.registeredPin}
                </p>
              )}
            </div>
          </div>

          {/* Same Address Checkbox */}
          <div className="pt-1">
            <label className="relative flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                id="sameAddressCheckbox"
                checked={!!formData.isSameAddress}
                onChange={(e) => onSameAddressToggle(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 focus:ring-2 cursor-pointer"
              />
              <span className="text-sm font-medium text-slate-700">
                Warehouse address is the same as registered office address.
              </span>
            </label>
          </div>

          {/* Warehouse Pickup Address & PIN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="warehouseAddress"
                  className="block text-sm font-medium text-slate-800"
                >
                  Warehouse Pickup Address <span className="text-red-500" aria-label="Required">*</span>
                </label>
                {formData.isSameAddress && (
                  <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Same as registered office
                  </span>
                )}
              </div>
              <input
                id="warehouseAddress"
                name="warehouseAddress"
                type="text"
                disabled={formData.isSameAddress}
                value={formData.warehouseAddress || ''}
                onChange={(e) => onChange('warehouseAddress', e.target.value)}
                placeholder="Warehouse plot, industrial area, city, state"
                aria-invalid={errors.warehouseAddress ? 'true' : 'false'}
                aria-describedby={errors.warehouseAddress ? 'warehouseAddress-error' : undefined}
                className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  formData.isSameAddress
                    ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                    : errors.warehouseAddress
                    ? 'border-red-400 bg-red-50/20'
                    : 'bg-white border-slate-300 hover:border-slate-400'
                }`}
              />
              {errors.warehouseAddress && !formData.isSameAddress && (
                <p
                  id="warehouseAddress-error"
                  role="alert"
                  className="flex items-center text-xs text-red-600 font-medium mt-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden="true" />
                  {errors.warehouseAddress}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="warehousePin"
                className="block text-sm font-medium text-slate-800 mb-1.5"
              >
                Warehouse PIN Code <span className="text-red-500" aria-label="Required">*</span>
              </label>
              <input
                id="warehousePin"
                name="warehousePin"
                type="text"
                inputMode="numeric"
                maxLength={6}
                disabled={formData.isSameAddress}
                value={formData.warehousePin || ''}
                onChange={(e) => onChange('warehousePin', e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="e.g. 400001"
                aria-invalid={errors.warehousePin ? 'true' : 'false'}
                aria-describedby={errors.warehousePin ? 'warehousePin-error' : undefined}
                className={`w-full min-h-[48px] px-3.5 py-2.5 rounded-lg border text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                  formData.isSameAddress
                    ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                    : errors.warehousePin
                    ? 'border-red-400 bg-red-50/20'
                    : 'bg-white border-slate-300 hover:border-slate-400'
                }`}
              />
              {errors.warehousePin && !formData.isSameAddress && (
                <p
                  id="warehousePin-error"
                  role="alert"
                  className="flex items-center text-xs text-red-600 font-medium mt-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5 mr-1 shrink-0" aria-hidden="true" />
                  {errors.warehousePin}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* ================= SECTION B: SUPPORTING DOCUMENTS ================= */}
        <section aria-labelledby="supporting-documents-heading" className="space-y-5 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center space-x-2">
              <FileCheck2 className="w-4 h-4 text-slate-700" aria-hidden="true" />
              <h3 id="supporting-documents-heading" className="text-base font-semibold text-slate-900">
                B. Supporting Documents
              </h3>
            </div>
            <span className="text-xs text-slate-500">Client-side PDF validation</span>
          </div>

          <p className="text-xs text-slate-500">
            Select standard PDF files for document verification. Files are maintained strictly in local state for this form.
          </p>

          <div className="space-y-4">
            {/* 1. GST Registration Certificate */}
            <PdfUploadField
              id="doc-gstCertificate"
              label="GST Registration Certificate"
              required={true}
              file={formData.documents?.gstCertificate}
              error={errors['documents.gstCertificate']}
              onFileChange={(file) => onFileChange('gstCertificate', file)}
              onError={(msg) => onFileError('gstCertificate', msg)}
            />

            {/* 2. IEC Certificate */}
            <PdfUploadField
              id="doc-iecCertificate"
              label="IEC Certificate"
              required={true}
              file={formData.documents?.iecCertificate}
              error={errors['documents.iecCertificate']}
              onFileChange={(file) => onFileChange('iecCertificate', file)}
              onError={(msg) => onFileError('iecCertificate', msg)}
            />

            {/* 3. Aadhaar Card PDF */}
            <PdfUploadField
              id="doc-aadhaarCard"
              label="Aadhaar Card PDF"
              required={true}
              file={formData.documents?.aadhaarCard}
              error={errors['documents.aadhaarCard']}
              onFileChange={(file) => onFileChange('aadhaarCard', file)}
              onError={(msg) => onFileError('aadhaarCard', msg)}
            />

            {/* 4. Cancelled Cheque or Bank Passbook Copy */}
            <PdfUploadField
              id="doc-cancelledCheque"
              label="Cancelled Cheque or Bank Passbook Copy"
              required={false}
              file={formData.documents?.cancelledCheque}
              error={errors['documents.cancelledCheque']}
              onFileChange={(file) => onFileChange('cancelledCheque', file)}
              onError={(msg) => onFileError('cancelledCheque', msg)}
            />

            {/* 5. LUT (Letter of Undertaking) Document */}
            <PdfUploadField
              id="doc-lutDocument"
              label="LUT (Letter of Undertaking) Document"
              required={false}
              file={formData.documents?.lutDocument}
              error={errors['documents.lutDocument']}
              onFileChange={(file) => onFileChange('lutDocument', file)}
              onError={(msg) => onFileError('lutDocument', msg)}
            />
          </div>
        </section>

        {/* Form Navigation Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
            Back to Profile
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors shadow-sm"
          >
            Review Details
            <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}

