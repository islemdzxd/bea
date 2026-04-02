'use client';

import React from 'react';
import { BankingProvider } from '@/features/banking/banking-provider';

export function Providers({ children }: Readonly<{ children: React.ReactNode }>) {
  return <BankingProvider>{children}</BankingProvider>;
}