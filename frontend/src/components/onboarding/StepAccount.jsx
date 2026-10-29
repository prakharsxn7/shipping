import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';

export default function StepAccount({ onProceed }) {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-xs tracking-wider uppercase">
          <ShieldCheck className="w-4 h-4" aria-hidden="true" />
          <span>Stage 1 Completed</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
          Account registration verified
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Your credentials and email verification were successfully established.
        </p>
      </div>

      {/* Account Status Card */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Registration & Workspace Setup
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Email verification completed. Your export workspace profile is ready for business onboarding.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-xs text-slate-600">
          <div>
            <span className="text-slate-400 block mb-0.5">Account Status</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-emerald-800 bg-emerald-50 font-medium border border-emerald-200">
              &bull; Active
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Next Requirement</span>
            <span className="font-medium text-slate-800">
              Indian Export Business Details (Profile)
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Actions */}
      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-5 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" aria-hidden="true" />
          Return to Sign In / Sign Up
        </Link>

        <button
          type="button"
          onClick={onProceed}
          className="w-full sm:w-auto inline-flex items-center justify-center min-h-[48px] px-6 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 transition-colors shadow-sm"
        >
          Continue to Business Profile
          <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
