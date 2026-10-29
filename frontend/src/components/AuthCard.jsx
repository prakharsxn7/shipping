import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useDemoAuth } from '../context/DemoAuthContext';

export default function AuthCard({ initialView = 'login' }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultView = searchParams?.get('view') || initialView;
  const [view, setView] = useState(defaultView); // 'login' | 'signup' | 'otp'
  const [showPassword, setShowPassword] = useState(false);
  const [infoNotice, setInfoNotice] = useState('');
  const { login, register, emailExists } = useDemoAuth();

  // Controlled form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // OTP state (for sign-up verification)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [countdown, setCountdown] = useState(30);
  const otpInputRefs = useRef([]);

  // Transition & Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Creating your space...');
  const shouldReduceMotion = useReducedMotion();

  // Countdown timer for OTP resend simulation
  useEffect(() => {
    let timer;
    if (view === 'otp' && countdown > 0 && !isLoading) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [view, countdown, isLoading]);

  // Sync view state if URL query param changes (e.g. from sign out)
  useEffect(() => {
    const paramView = searchParams?.get('view');
    if (paramView && (paramView === 'login' || paramView === 'signup')) {
      setView(paramView);
      setErrors({});
      setOtpError('');
      setInfoNotice('');
    }
  }, [searchParams]);

  // Loading overlay transition and client-side navigation effect
  useEffect(() => {
    if (!isLoading) return;

    // Transition from status message 1 to status message 2
    const statusTimer = setTimeout(() => {
      setLoadingStatus('Setting up workspace...');
    }, 900);

    // Navigate to /onboarding after the sequence
    const navTimer = setTimeout(() => {
      navigate('/onboarding');
    }, 1800);

    return () => {
      clearTimeout(statusTimer);
      clearTimeout(navTimer);
    };
  }, [isLoading, navigate]);

  // Switch between login and signup
  const handleSwitchView = (newView) => {
    if (isLoading) return;
    setView(newView);
    setErrors({});
    setOtpError('');
    setInfoNotice('');
    setIsLoading(false);
    setLoadingStatus('Creating your space...');
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (infoNotice) setInfoNotice('');
  };

  // Basic client-side validation
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (view === 'signup') {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      } else if (formData.fullName.trim().length < 2) {
        newErrors.fullName = 'Full name must be at least 2 characters';
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler: validates inputs
  // Sign-up goes to OTP email verification; Sign-in validates directly against demo store
  const handleSubmit = (e) => {
    e.preventDefault();
    setInfoNotice('');

    if (!validateForm()) {
      return;
    }

    if (view === 'signup') {
      // Prevent duplicate demo registrations for the same email
      if (emailExists(formData.email)) {
        setErrors((prev) => ({
          ...prev,
          email: 'An account with this email already exists',
        }));
        return;
      }

      // Registration triggers email verification (OTP)
      setView('otp');
      setOtpDigits(['', '', '', '', '', '']);
      setCountdown(30);
      setOtpError('');
    } else if (view === 'login') {
      // Frontend-only demo authentication
      const result = login(formData.email, formData.password);
      if (!result.success) {
        if (result.field === 'email') {
          setErrors({ email: result.error });
        } else if (result.field === 'password') {
          setErrors({ password: result.error });
        } else {
          setErrors({ form: result.error });
        }
        return;
      }

      // Successful demo login: navigate to onboarding
      setLoadingStatus('Signing in...');
      setIsLoading(true);
    }
  };

  // OTP Input handlers
  const handleOtpChange = (index, value) => {
    if (isLoading) return;
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otpDigits];
    newOtp[index] = digit;
    setOtpDigits(newOtp);
    setOtpError('');

    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (isLoading) return;
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    if (isLoading) return;
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otpDigits];
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    setOtpDigits(newOtp);
    setOtpError('');

    const nextIndex = Math.min(pastedData.length, 5);
    otpInputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent duplicate submissions

    // Validate that all six OTP input fields contain digits
    const isComplete =
      otpDigits.length === 6 &&
      otpDigits.every((digit) => /^\d$/.test(digit));

    if (!isComplete) {
      setOtpError('Please enter all 6 digits of the verification code');
      return;
    }

    // Register demo account in memory
    const regResult = register(formData.fullName, formData.email, formData.password);
    if (!regResult.success) {
      setOtpError(regResult.error);
      return;
    }

    setOtpError('');
    setInfoNotice('');
    setLoadingStatus('Creating your space...');
    setIsLoading(true);
  };

  const handleResendOtp = () => {
    if (isLoading || countdown > 0) return;
    setOtpDigits(['', '', '', '', '', '']);
    setCountdown(30);
    setOtpError('');
    setInfoNotice('A new verification code has been sent to your email.');
    otpInputRefs.current[0]?.focus();
  };

  const handleBackToSignup = () => {
    if (isLoading) return;
    setView('signup');
    setOtpError('');
    setInfoNotice('');
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main Card with Refined White Elevation and Soft Curves */}
      <div className="relative bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 sm:p-10 overflow-hidden">
        {/* Loading Overlay */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-30 bg-white/95 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center p-8 select-none"
              role="status"
              aria-live="polite"
              aria-busy="true"
            >
              <div className="flex flex-col items-center max-w-xs text-center space-y-4">
                {/* Spinner */}
                <div className="relative w-10 h-10 flex items-center justify-center">
                  {shouldReduceMotion ? (
                    <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-indigo-600" />
                  ) : (
                    <motion.div
                      className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-indigo-600"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
                    />
                  )}
                </div>

                {/* Dynamic status text */}
                <div className="h-6 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingStatus}
                      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -3 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium text-slate-700 tracking-tight"
                    >
                      {loadingStatus}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info / Notice banner */}
        {infoNotice && (
          <div
            className="mb-6 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
            role="status"
          >
            <span className="font-semibold text-slate-900 shrink-0">Note:</span>
            <span>{infoNotice}</span>
          </div>
        )}

        {/* ===================== LOGIN VIEW ===================== */}
        {view === 'login' && (
          <div>
            <div className="mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Welcome Back
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Enter your credentials to access your workspace.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="name@company.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'login-email-error' : undefined}
                  className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                />
                {errors.email && (
                  <p id="login-email-error" role="alert" className="mt-1.5 text-xs text-red-600 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="login-password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Enter your password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'login-password-error' : undefined}
                    className={`w-full min-h-[48px] px-4 pr-12 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${errors.password ? 'border-red-400 bg-red-50/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="login-password-error" role="alert" className="mt-1.5 text-xs text-red-600 font-medium">
                    {errors.password}
                  </p>
                )}

                {/* Right-aligned Forgot Password link matching reference layout */}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    tabIndex={-1}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                    onClick={() => setInfoNotice('Password recovery instructions will be sent to your verified email.')}
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>

              {/* Submit Button with Indigo Styling */}
              <button
                type="submit"
                className="w-full min-h-[48px] mt-4 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Login
              </button>
            </form>

            {/* Switch to Sign-Up */}
            <div className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => handleSwitchView('signup')}
                className="font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline"
              >
                Sign Up
              </button>
            </div>

          </div>
        )}

        {/* ===================== SIGN-UP / REGISTER VIEW ===================== */}
        {view === 'signup' && (
          <div>
            <div className="mb-8 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Enter your details to register.
              </p>
            </div>

            {/* Sign-Up Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="signup-name" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Full name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Alex Morgan"
                  aria-invalid={errors.fullName ? 'true' : 'false'}
                  aria-describedby={errors.fullName ? 'signup-name-error' : undefined}
                  className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${errors.fullName ? 'border-red-400 bg-red-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                />
                {errors.fullName && (
                  <p id="signup-name-error" role="alert" className="mt-1.5 text-xs text-red-600 font-medium">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="name@company.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'signup-email-error' : undefined}
                  className={`w-full min-h-[48px] px-4 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${errors.email ? 'border-red-400 bg-red-50/20' : 'border-slate-200 hover:border-slate-300'
                    }`}
                />
                {errors.email && (
                  <p id="signup-email-error" role="alert" className="mt-1.5 text-xs text-red-600 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a password (min. 8 characters)"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'signup-password-error' : undefined}
                    className={`w-full min-h-[48px] px-4 pr-12 py-2.5 rounded-xl border text-sm text-slate-900 bg-white placeholder-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 ${errors.password ? 'border-red-400 bg-red-50/20' : 'border-slate-200 hover:border-slate-300'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="signup-password-error" role="alert" className="mt-1.5 text-xs text-red-600 font-medium">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full min-h-[48px] mt-4 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create account
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => handleSwitchView('login')}
                className="font-semibold text-indigo-600 hover:text-indigo-700 underline-offset-2 hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ===================== OTP VERIFICATION VIEW (FOR REGISTRATION) ===================== */}
        {view === 'otp' && (
          <div>
            <div className="mb-6 text-center">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Verify your email
              </h1>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Enter the 6-digit confirmation code sent to{' '}
                <span className="font-semibold text-slate-800">
                  {formData.email || 'your email'}
                </span>{' '}
                to complete your registration.
              </p>
            </div>

            <form
              onSubmit={handleVerifyOtp}
              noValidate
              className="space-y-6"
              aria-busy={isLoading}
            >
              {/* 6 Individual Digit Inputs */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-3 text-center">
                  Verification Code
                </label>
                <div className="flex justify-between gap-2 sm:gap-2.5">
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (otpInputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      disabled={isLoading}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      aria-label={`Digit ${index + 1}`}
                      className={`w-11 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold text-slate-900 rounded-xl border bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${otpError ? 'border-red-400 bg-red-50/20' : 'border-slate-200 hover:border-slate-300'
                        }`}
                    />
                  ))}
                </div>
                {otpError && (
                  <p role="alert" className="mt-2.5 text-center text-xs text-red-600 font-medium">
                    {otpError}
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full min-h-[48px] px-4 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold tracking-wide shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Verify & Complete Registration
              </button>

              {/* Resend OTP Section */}
              <div className="pt-2 text-center">
                <p className="text-xs text-slate-500 mb-1">Didn't receive the code?</p>
                {countdown > 0 ? (
                  <span className="text-xs font-medium text-slate-400">
                    Resend code in <span className="font-semibold text-slate-700">{countdown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={handleResendOtp}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed underline-offset-2 hover:underline focus:outline-none"
                  >
                    Resend verification code
                  </button>
                )}
              </div>
            </form>

            {/* Back to register */}
            <div className="mt-8 pt-4 border-t border-slate-100 text-center">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleBackToSignup}
                className="text-xs font-medium text-slate-500 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5 transition-colors"
              >
                <span>&larr;</span> Back to Register
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
