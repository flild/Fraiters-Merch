'use client'; // Error components must be Client Components

import React from 'react';
import ErrorContent from '@/components/ErrorContent';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorContent error={error} reset={reset} />;
}
