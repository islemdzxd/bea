'use client';

import React from 'react';
import { formatCurrency } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface BankCardData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  balance: number;
  bank?: string;
  type?: string;
}

interface BankCardProps {
  card: BankCardData;
  className?: string;
  variant?: 'hero' | 'compact';
}

function normalizeCardNumber(cardNumber: string) {
  return cardNumber.replace(/\s+/g, ' ').trim();
}

function CardChip() {
  return (
    <div className="relative h-10 w-14 overflow-hidden rounded-xl border border-white/35 bg-[linear-gradient(145deg,rgba(255,255,255,0.92),rgba(224,224,224,0.55))] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_8px_20px_-14px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-x-2 top-2 h-px rounded-full bg-white/70" />
      <div className="absolute inset-x-2 bottom-2 h-px rounded-full bg-white/50" />
      <div className="absolute left-2 top-2 bottom-2 w-px rounded-full bg-white/55" />
      <div className="absolute right-2 top-2 bottom-2 w-px rounded-full bg-white/55" />
    </div>
  );
}

function ContactlessMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 text-white/85" fill="none" aria-hidden="true">
      <path
        d="M7 8.5c2 1.7 3.2 3.6 3.2 7.5M5 6c3.9 2.9 6.2 6.3 6.2 10.8M3 3.5c5.6 4.4 8.8 9.3 8.8 16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BankCard({ card, className, variant = 'hero' }: BankCardProps) {
  const isHero = variant === 'hero';

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-[2rem] border border-white/20 bg-[linear-gradient(135deg,#003da5_0%,#1a2456_100%)] text-white shadow-[0_28px_55px_-30px_rgba(26,36,86,0.72)] transition-transform duration-300 hover:-translate-y-1 hover:rotate-[0.25deg] hover:shadow-[0_34px_65px_-30px_rgba(26,36,86,0.82)]',
        isHero ? 'min-h-[230px] p-6 sm:p-7' : 'min-h-[180px] p-5',
        className,
      )}
      style={{ perspective: '1200px' }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%)] opacity-100" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_0%,rgba(255,255,255,0.12)_45%,transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-12 bottom-0 h-40 w-40 rounded-full bg-black/10 blur-3xl" />

      <div className="relative flex h-full flex-col justify-between gap-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/70">{card.bank ?? 'Bank Card'}</p>
            <p className="mt-2 text-sm font-medium text-white/90">Available balance</p>
            <p className="text-3xl font-semibold tracking-tight sm:text-4xl">{formatCurrency(card.balance)}</p>
          </div>
          <div className="flex items-center gap-3">
            <CardChip />
            <ContactlessMark />
          </div>
        </div>

        <div className="space-y-5">
          <div className="font-mono text-[1.15rem] tracking-[0.28em] text-white/95 sm:text-[1.2rem]">
            {normalizeCardNumber(card.cardNumber)}
          </div>

          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/65">Card holder</p>
              <p className="mt-1 text-sm font-semibold tracking-wide text-white">{card.cardHolder}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/65">Expires</p>
              <p className="mt-1 text-sm font-semibold tracking-wide text-white">{card.expiryDate}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}