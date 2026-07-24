import React, { createContext, useContext, useMemo } from 'react';
import { useAuth } from './AuthContext';

const FeatureContext = createContext(null);

// Centralized dictionary of feature flags and their evaluation rules.
// This allows complex rules, e.g., enabling features based on role, beta status, or global overrides.
const FEATURES = {
  BETA_DASHBOARD: (user) => user?.isBetaAdmitted === true,
  NEW_REWARDS_UI: (user) => user?.isBetaAdmitted === true,
  TEACHER_TOOLS: (user) => user?.role === 'teacher',
};

export const FeatureProvider = ({ children }) => {
  const { user } = useAuth();

  // Evaluate all flags based on current user state
  const flags = useMemo(() => {
    const evaluated = {};
    for (const [flag, rule] of Object.entries(FEATURES)) {
      evaluated[flag] = rule(user);
    }
    return evaluated;
  }, [user]);

  return (
    <FeatureContext.Provider value={{ flags }}>
      {children}
    </FeatureContext.Provider>
  );
};

export const useFeature = (flagName) => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeature must be used within a FeatureProvider');
  }
  return !!context.flags[flagName];
};
