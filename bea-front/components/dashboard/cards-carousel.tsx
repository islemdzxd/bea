'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Card as CardType } from '@/lib/mock-data';
import { BankCard } from '@/components/dashboard/bank-card';
import { formatCurrency } from '@/lib/format';

interface CardsCarouselProps {
  cards: CardType[];
}

export function CardsCarousel({ cards }: Readonly<CardsCarouselProps>) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentCardIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentCardIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  const currentCard = cards[currentCardIndex];

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Accounts</p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">My Cards</h2>
        </div>
        <a href="/dashboard/credit-cards" className="text-primary hover:underline text-sm font-semibold">
          See All
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <div className="space-y-4">
          <BankCard
            card={{
              ...currentCard,
              bank: currentCard.type === 'visa' ? 'Premium Visa' : 'Premium Mastercard',
            }}
            variant="hero"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border/70 bg-white/60 p-3 shadow-[0_16px_40px_-30px_rgba(26,36,86,0.22)] backdrop-blur-xl sm:p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Current balance</p>
              <p className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {formatCurrency(currentCard.balance)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={goToPrevious}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToNext}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <Card className="p-4 sm:p-6">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Portfolio</p>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Card overview</h3>
            </div>
            <div className="flex gap-2">
              {cards.map((card, idx) => (
                <button
                  key={card.id}
                  onClick={() => setCurrentCardIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentCardIndex ? 'bg-primary w-6' : 'bg-border w-2'
                  }`}
                  aria-label={`Switch to card ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => setCurrentCardIndex(index)}
                className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all ${
                  index === currentCardIndex
                    ? 'border-primary/35 bg-primary/5 shadow-[0_12px_30px_-24px_rgba(0,61,165,0.4)]'
                    : 'border-border/70 bg-white/50 hover:bg-secondary/60'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{card.cardHolder}</p>
                  <p className="text-xs text-muted-foreground">{card.cardNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">{formatCurrency(card.balance)}</p>
                  <p className="text-xs text-muted-foreground">{card.expiryDate}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
