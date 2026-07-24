import React from 'react';
import { useFeature } from '../context/FeatureContext';

/**
 * A wrapper component that only renders its children if the specified feature flag is enabled.
 */
export default function FeatureGate({ flag, children, fallback = null }) {
  const isEnabled = useFeature(flag);

  if (!isEnabled) {
    return fallback;
  }

  return <>{children}</>;
}
