import React from 'react';

export default function BrandingPane() {
  return (
    <div
      className="hidden lg:flex lg:w-1/2 flex-col justify-between min-h-screen p-12 xl:p-20 relative overflow-hidden text-white select-none"
      style={{
        background: 'linear-gradient(135deg, #3730a3 0%, #4338ca 25%, #4f46e5 50%, #6366f1 75%, #7c3aed 100%)',
      }}
      aria-label="Branding Pane"
    >
      {/* Soft ambient radial illumination for smooth visual depth */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 mix-blend-soft-light"
        style={{
          background: 'radial-gradient(circle at 18% 22%, rgba(255, 255, 255, 0.25) 0%, transparent 60%)',
        }}
      />

      {/* Subtle organic light curves in background */}
      <div
        className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl pointer-events-none"
      />
      <div
        className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl pointer-events-none"
      />

      {/* Center: Large Clear Introductory Heading & Supporting Description */}
      <div className="relative z-10 my-auto py-12 max-w-lg space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-[1.12]">
            Cross-Border Trade, Simplified.
          </h1>
          <p className="text-xl font-medium text-indigo-100/95 leading-snug">
            Integrated export documentation and logistics workflow.
          </p>
        </div>

        <p className="text-sm text-indigo-100/80 leading-relaxed max-w-md">
          Streamline Indian business registration, customs identification, and warehouse pickup coordination in one unified workspace.
        </p>
      </div>

      {/* Bottom Footer Attribution */}
      <div className="relative z-10 flex items-center justify-between text-xs text-indigo-200/80 font-medium tracking-wide">
        <span>&copy; {new Date().getFullYear()} Elogisol Technologies</span>
        <span>Export Operations</span>
      </div>
    </div>
  );
}
