import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, X, LogOut, Check } from 'lucide-react';
import ProgressBar from '../components/onboarding/ProgressBar';
import StepAccount from '../components/onboarding/StepAccount';
import StepProfile from '../components/onboarding/StepProfile';
import StepDetails from '../components/onboarding/StepDetails';
import StepFinish from '../components/onboarding/StepFinish';
import { useDemoAuth } from '../context/DemoAuthContext';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { logout } = useDemoAuth();

  // Step 1: Account
  // Step 2: Profile 
  // Step 3: Details
  // Step 4: Finish
  const [currentStep, setCurrentStep] = useState(1);
  const [isReviewCompleted, setIsReviewCompleted] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/?view=login');
  };

  // Form State preserved across all steps
  const [formData, setFormData] = useState({
    // Step 2: Profile
    customerName: '',
    businessName: '',
    gstin: '',
    iecCode: '',
    icegateId: '',
    adCode: '',

    // Step 3: Details (Contact & Locations)
    email: '',
    registeredAddress: '',
    registeredPin: '',
    isSameAddress: false,
    warehouseAddress: '',
    warehousePin: '',

    // Step 3: Supporting Documents (Local File objects)
    documents: {
      gstCertificate: null,
      iecCertificate: null,
      aadhaarCard: null,
      cancelledCheque: null,
      lutDocument: null,
    },
  });

  // Validation Errors state
  const [errors, setErrors] = useState({});

  // Field change handler
  const handleFieldChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // If same address is checked and registered fields are being edited, sync warehouse fields
      if (prev.isSameAddress) {
        if (field === 'registeredAddress') {
          updated.warehouseAddress = value;
        } else if (field === 'registeredPin') {
          updated.warehousePin = value;
        }
      }
      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[field];
        return nextErrors;
      });
    }
  };

  // Same Address Checkbox toggle
  const handleSameAddressToggle = (checked) => {
    setFormData((prev) => ({
      ...prev,
      isSameAddress: checked,
      warehouseAddress: checked ? prev.registeredAddress : prev.warehouseAddress,
      warehousePin: checked ? prev.registeredPin : prev.warehousePin,
    }));

    if (checked) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors.warehouseAddress;
        delete nextErrors.warehousePin;
        return nextErrors;
      });
    }
  };

  // Document file selection handler
  const handleFileChange = (docKey, file) => {
    setFormData((prev) => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docKey]: file,
      },
    }));

    const errorKey = `documents.${docKey}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[errorKey];
        return nextErrors;
      });
    }
  };

  // Document file error handler
  const handleFileError = (docKey, errorMessage) => {
    const errorKey = `documents.${docKey}`;
    setErrors((prev) => ({
      ...prev,
      [errorKey]: errorMessage,
    }));
  };

  // Client-side validation per step
  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep === 2) {
      // Step 2: Profile Validation
      if (!formData.customerName.trim()) {
        newErrors.customerName = 'Customer Name is required';
      }

      if (!formData.businessName.trim()) {
        newErrors.businessName = 'Business Name is required';
      }

      // GSTIN Validation (15 alphanumeric characters)
      const cleanGstin = formData.gstin.trim();
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
      const generalAlphanumeric15 = /^[A-Z0-9]{15}$/i;

      if (!cleanGstin) {
        newErrors.gstin = 'GSTIN is required';
      } else if (!generalAlphanumeric15.test(cleanGstin)) {
        newErrors.gstin = 'GSTIN must be exactly 15 alphanumeric characters';
      } else if (!gstinRegex.test(cleanGstin)) {
        newErrors.gstin = 'Please enter a valid GSTIN format (e.g. 27AAAAA0000A1Z5)';
      }

      // IEC Code Validation (10 alphanumeric characters)
      const cleanIec = formData.iecCode.trim();
      const iecRegex = /^[A-Z0-9]{10}$/i;

      if (!cleanIec) {
        newErrors.iecCode = 'IEC Code is required';
      } else if (!iecRegex.test(cleanIec)) {
        newErrors.iecCode = 'IEC Code must be 10 alphanumeric characters';
      }
    } else if (currentStep === 3) {
      // Step 3: Details Validation
      // Email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim()) {
        newErrors.email = 'Business Email Address is required';
      } else if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }

      // Registered Address & PIN
      if (!formData.registeredAddress.trim()) {
        newErrors.registeredAddress = 'Registered Office Address is required';
      }

      const pinRegex = /^[1-9][0-9]{5}$/;
      if (!formData.registeredPin.trim()) {
        newErrors.registeredPin = 'Registered Office PIN Code is required';
      } else if (!pinRegex.test(formData.registeredPin.trim())) {
        newErrors.registeredPin = 'Enter a valid 6-digit Indian PIN code';
      }

      // Warehouse Address & PIN
      const effectiveWarehouseAddress = formData.isSameAddress
        ? formData.registeredAddress
        : formData.warehouseAddress;
      const effectiveWarehousePin = formData.isSameAddress
        ? formData.registeredPin
        : formData.warehousePin;

      if (!effectiveWarehouseAddress.trim()) {
        newErrors.warehouseAddress = 'Warehouse Pickup Address is required';
      }

      if (!effectiveWarehousePin.trim()) {
        newErrors.warehousePin = 'Warehouse PIN Code is required';
      } else if (!pinRegex.test(effectiveWarehousePin.trim())) {
        newErrors.warehousePin = 'Enter a valid 6-digit Indian PIN code';
      }

      // Required Document Uploads
      if (!formData.documents?.gstCertificate) {
        newErrors['documents.gstCertificate'] = 'Please attach the GST Registration Certificate PDF';
      }

      if (!formData.documents?.iecCertificate) {
        newErrors['documents.iecCertificate'] = 'Please attach the IEC Certificate PDF';
      }

      if (!formData.documents?.aadhaarCard) {
        newErrors['documents.aadhaarCard'] = 'Please attach the Aadhaar Card PDF';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step progression
  const handleNext = () => {
    if (validateCurrentStep()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setCurrentStep((prev) => {
        const next = Math.min(prev + 1, 4);
        if (next < 4) {
          setIsReviewCompleted(false);
        }
        return next;
      });
    }
  };

  // Step regression
  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsReviewCompleted(false);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  // Direct step jump (used from Finish edit buttons or progress bar for completed steps)
  const handleNavigateStep = (targetStep) => {
    // Only allow navigating to visited/lower steps or next step if valid
    if (targetStep < currentStep) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsReviewCompleted(false);
      setCurrentStep(targetStep);
    } else if (targetStep === currentStep + 1) {
      handleNext();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Preserves layout spacing without displaying a logo graphic */}
          <div className="w-8" aria-hidden="true" />

          {/* Current Step Counter Badge */}
          <div className="hidden sm:flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            {isReviewCompleted ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                Completed
              </span>
            ) : (
              <span>Step {currentStep} of 4</span>
            )}
          </div>

          {/* Right Header Navigation: Help & Sign Out */}
          <div className="flex items-center space-x-2.5">
            {/* Minimal Help Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowHelpModal((prev) => !prev)}
                className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900"
                aria-expanded={showHelpModal}
                aria-label="Help and guidance"
              >
                <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-slate-500" aria-hidden="true" />
                Help
              </button>

              {/* Help Popover */}
              {showHelpModal && (
                <div
                  role="dialog"
                  aria-label="Onboarding Assistance"
                  className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-xl shadow-lg border border-slate-200 p-4 z-40 text-xs text-slate-600 space-y-2 animate-in fade-in"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-semibold text-slate-900">Onboarding Assistance</span>
                    <button
                      type="button"
                      onClick={() => setShowHelpModal(false)}
                      className="text-slate-400 hover:text-slate-600 rounded p-0.5"
                      aria-label="Close help"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p>
                    Need assistance with your export documentation?
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-500 text-[11px]">
                    <li>GSTIN is your 15-character Goods & Services Tax ID.</li>
                    <li>IEC is the 10-character code issued by DGFT.</li>
                    <li>Documents must be standard PDF format under 5 MB.</li>
                  </ul>
                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                    Support: support@elogisol.com
                  </div>
                </div>
              )}
            </div>

            {/* Restrained Sign Out Button */}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900"
              aria-label="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 mr-1.5 text-slate-500" aria-hidden="true" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Progress Stepper Bar */}
        <div className="mb-8 sm:mb-10">
          <ProgressBar
            currentStep={currentStep}
            isCompleted={isReviewCompleted}
            onStepClick={handleNavigateStep}
          />
        </div>

        {/* Step Form Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-10">
          {currentStep === 1 && (
            <StepAccount onProceed={() => setCurrentStep(2)} />
          )}

          {currentStep === 2 && (
            <StepProfile
              formData={formData}
              errors={errors}
              onChange={handleFieldChange}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 3 && (
            <StepDetails
              formData={formData}
              errors={errors}
              onChange={handleFieldChange}
              onSameAddressToggle={handleSameAddressToggle}
              onFileChange={handleFileChange}
              onFileError={handleFileError}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {currentStep === 4 && (
            <StepFinish
              formData={formData}
              onNavigateStep={handleNavigateStep}
              onBack={handleBack}
              isCompleted={isReviewCompleted}
              onComplete={() => setIsReviewCompleted(true)}
            />
          )}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="py-6 border-t border-slate-200/80 text-center text-xs text-slate-400 bg-white">
        <p>Elogisol Technologies &bull; Cross-Border Business Onboarding</p>
      </footer>
    </div>
  );
}
