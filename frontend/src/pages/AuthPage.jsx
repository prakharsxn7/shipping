import React from 'react';
import BrandingPane from '../components/BrandingPane';
import AuthCard from '../components/AuthCard';

export default function AuthPage() {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Left Section — Desktop 50% Branding Panel with Blue-to-Purple Gradient */}
      <BrandingPane />

      {/* Right Section — Desktop 50% Centered Card / Mobile Stack */}
      <section
        className="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-12 xl:px-16 min-h-screen bg-slate-50/80"
        aria-label="Authentication Form"
      >
        {/* Mobile Simplified Gradient Branding Banner (without logo graphic) */}
        <div
          className="lg:hidden w-full max-w-md mx-auto mb-6 p-6 rounded-2xl text-white shadow-md"
          style={{
            background: 'linear-gradient(135deg, #3730a3 0%, #4338ca 35%, #6366f1 70%, #7c3aed 100%)',
          }}
        >
          <h2 className="text-lg font-bold tracking-tight text-white">
            Cross-Border Trade, Simplified.
          </h2>
          <p className="text-xs text-indigo-100/90 mt-1">
            Integrated export logistics & compliance workspace.
          </p>
        </div>

        {/* Centered White Authentication Card */}
        <AuthCard initialView="login" />
      </section>
    </main>
  );
}

