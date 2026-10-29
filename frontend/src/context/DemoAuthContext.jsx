import React, { createContext, useContext, useState } from 'react';

/**
 * In-Memory Frontend Authentication Store
 */

const DemoAuthContext = createContext(null);

const INITIAL_DEMO_ACCOUNTS = [
  {
    email: 'admin@elogisol.com',
    password: 'Password123',
    fullName: 'Administrator',
  },
  {
    email: 'demo@elogisol.com',
    password: 'Password123',
    fullName: 'Account Administrator',
  },
];

export function DemoAuthProvider({ children }) {
  // In-memory account registry (runtime only)
  const [accounts, setAccounts] = useState(INITIAL_DEMO_ACCOUNTS);

  // Active session: { fullName, email } or null
  const [currentSession, setCurrentSession] = useState(null);

  /**
   * Check if an email has already been registered
   */
  const emailExists = (email) => {
    const normalized = (email || '').trim().toLowerCase();
    return accounts.some((acc) => acc.email.toLowerCase() === normalized);
  };

  /**
   * Register a new account
   */
  const register = (fullName, email, password) => {
    const normalized = (email || '').trim().toLowerCase();

    if (emailExists(normalized)) {
      return {
        success: false,
        error: 'An account with this email already exists',
      };
    }

    const newAccount = {
      fullName: (fullName || '').trim(),
      email: normalized,
      password: password,
    };

    setAccounts((prev) => [...prev, newAccount]);

    // Establish active session
    const sessionUser = {
      fullName: newAccount.fullName,
      email: newAccount.email,
    };
    setCurrentSession(sessionUser);

    return {
      success: true,
      user: sessionUser,
    };
  };

  /**
   * Login with account credentials
   */
  const login = (email, password) => {
    const normalized = (email || '').trim().toLowerCase();
    const account = accounts.find((acc) => acc.email.toLowerCase() === normalized);

    if (!account) {
      return {
        success: false,
        field: 'email',
        error: 'No account found with this email. Please sign up first.',
      };
    }

    if (account.password !== password) {
      return {
        success: false,
        field: 'password',
        error: 'Incorrect password. Please try again.',
      };
    }

    // Set active session
    const sessionUser = {
      fullName: account.fullName,
      email: account.email,
    };
    setCurrentSession(sessionUser);

    return {
      success: true,
      user: sessionUser,
    };
  };

  /**
   * Sign Out: clears the active session
   */
  const logout = () => {
    setCurrentSession(null);
  };

  return (
    <DemoAuthContext.Provider
      value={{
        currentSession,
        isAuthenticated: !!currentSession,
        emailExists,
        register,
        login,
        logout,
      }}
    >
      {children}
    </DemoAuthContext.Provider>
  );
}

export function useDemoAuth() {
  const context = useContext(DemoAuthContext);
  if (!context) {
    throw new Error('useDemoAuth must be used within a DemoAuthProvider');
  }
  return context;
}
