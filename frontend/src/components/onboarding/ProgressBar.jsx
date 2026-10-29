import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { id: 1, name: 'Account', description: 'Registration completed' },
  { id: 2, name: 'Profile', description: 'Business identification' },
  { id: 3, name: 'Details', description: 'Contact & documents' },
  { id: 4, name: 'Finish', description: 'Review & complete' },
];

export default function ProgressBar({ currentStep, isCompleted = false, onStepClick }) {
  // Calculate completion percentage:
  // Step 1: 25%, Step 2: 50%, Step 3: 75%
  // Step 4 (Active, review pending): 90%
  // Step 4 (Review Completed): 100%
  let progressPercentage = 25;
  if (isCompleted) {
    progressPercentage = 100;
  } else if (currentStep === 2) {
    progressPercentage = 50;
  } else if (currentStep === 3) {
    progressPercentage = 75;
  } else if (currentStep === 4) {
    progressPercentage = 90;
  }

  return (
    <nav aria-label="Onboarding Progress" className="w-full">
      {/* Mobile Compact Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-white">
              {isCompleted ? 'Completed' : `Step ${currentStep} of ${STEPS.length}`}
            </span>
            <span className="text-sm font-semibold text-slate-900">
              {isCompleted ? 'Finish' : STEPS[currentStep - 1]?.name}
            </span>
          </div>
          <span className="text-xs font-medium text-slate-500">
            {progressPercentage}%
          </span>
        </div>

        {/* Progress track */}
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-slate-900 transition-all duration-300 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-between mt-2 px-1">
          {STEPS.map((step) => {
            const isStepCompleted = isCompleted || step.id < currentStep;
            const isStepActive = !isCompleted && step.id === currentStep;

            return (
              <button
                key={step.id}
                type="button"
                disabled={!isStepCompleted}
                onClick={() => isStepCompleted && onStepClick(step.id)}
                className={`text-xs flex items-center gap-1 ${
                  isStepActive
                    ? 'font-bold text-slate-900'
                    : isStepCompleted
                    ? 'text-slate-600 hover:text-slate-900 underline-offset-2 hover:underline cursor-pointer'
                    : 'text-slate-400 cursor-not-allowed'
                }`}
                aria-current={isStepActive ? 'step' : undefined}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isStepCompleted
                      ? 'bg-emerald-600'
                      : isStepActive
                      ? 'bg-slate-900 ring-2 ring-slate-300'
                      : 'bg-slate-300'
                  }`}
                />
                {step.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop / Tablet Full Stepper */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Background Track Line */}
          <div
            className="absolute top-5 left-10 right-10 h-0.5 bg-slate-200 -translate-y-1/2"
            aria-hidden="true"
          >
            {/* Filled Progress Bar Line */}
            <div
              className="h-full bg-slate-900 transition-all duration-300 ease-in-out"
              style={{
                width: isCompleted
                  ? '100%'
                  : `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Stepper items */}
          <ol className="relative z-10 flex justify-between">
            {STEPS.map((step) => {
              const isStepCompleted = isCompleted || step.id < currentStep;
              const isStepActive = !isCompleted && step.id === currentStep;
              const isStepUpcoming = !isCompleted && step.id > currentStep;

              return (
                <li key={step.id} className="flex flex-col items-center">
                  <button
                    type="button"
                    disabled={!isStepCompleted}
                    onClick={() => isStepCompleted && onStepClick(step.id)}
                    className={`group flex flex-col items-center focus:outline-none ${
                      isStepCompleted ? 'cursor-pointer' : 'cursor-default'
                    }`}
                    aria-current={isStepActive ? 'step' : undefined}
                    aria-label={`${step.name} - ${
                      isStepCompleted ? 'Completed' : isStepActive ? 'Current step' : 'Upcoming'
                    }`}
                  >
                    {/* Circle Indicator */}
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-200 ${
                        isStepCompleted
                          ? 'bg-slate-900 text-white shadow-sm group-hover:bg-slate-800'
                          : isStepActive
                          ? 'bg-white border-2 border-slate-900 text-slate-900 ring-4 ring-slate-100'
                          : 'bg-white border-2 border-slate-200 text-slate-400'
                      }`}
                    >
                      {isStepCompleted ? (
                        <Check className="w-5 h-5 stroke-[2.5]" aria-hidden="true" />
                      ) : (
                        <span>{step.id}</span>
                      )}
                    </div>

                    {/* Step Name & Status */}
                    <div className="mt-2.5 text-center">
                      <p
                        className={`text-xs font-semibold tracking-tight transition-colors ${
                          isStepActive
                            ? 'text-slate-900 font-bold'
                            : isStepCompleted
                            ? 'text-slate-800 group-hover:text-slate-900'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.name}
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 max-w-[110px] leading-tight ${
                          isStepCompleted
                            ? 'text-emerald-700 font-medium'
                            : isStepActive
                            ? 'text-slate-500 font-medium'
                            : 'text-slate-400'
                        }`}
                      >
                        {isStepCompleted ? 'Completed' : step.description}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </nav>
  );
}
