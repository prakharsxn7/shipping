import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import OnboardingPage from './pages/OnboardingPage';
import { DemoAuthProvider } from './context/DemoAuthContext';

export default function App() {
  return (
    <DemoAuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </DemoAuthProvider>
  );
}
