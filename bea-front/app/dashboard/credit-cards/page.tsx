'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BankCard } from '@/components/dashboard/bank-card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockCreditCards, mockCardExpenseStats } from '@/lib/mock-data';
import { formatNumber } from '@/lib/format';

export default function CreditCardsPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handlePreviousCard = () => {
    setCurrentCardIndex((prev) =>
      prev === 0 ? mockCreditCards.length - 1 : prev - 1
    );
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) =>
      prev === mockCreditCards.length - 1 ? 0 : prev + 1
    );
  };

  const currentCard = mockCreditCards[currentCardIndex];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Cards</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">Credit Cards</h1>
      </div>

      {/* My Cards Section */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        <div className="relative space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground">My Cards</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousCard}
                className="rounded-full border border-border/70 bg-white/70 p-2 transition-all hover:-translate-y-0.5 hover:shadow-md"
                aria-label="Previous card"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={handleNextCard}
                className="rounded-full border border-border/70 bg-white/70 p-2 transition-all hover:-translate-y-0.5 hover:shadow-md"
                aria-label="Next card"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>

          <BankCard
            card={{
              cardNumber: currentCard.cardNumber,
              cardHolder: currentCard.cardHolder,
              expiryDate: currentCard.expiryDate,
              balance: currentCard.balance,
              bank: currentCard.bank,
              type: currentCard.type,
            }}
            variant="hero"
          />

          <div className="flex items-center justify-center gap-2 pt-1">
            {mockCreditCards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => setCurrentCardIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentCardIndex ? 'bg-primary w-8' : 'bg-border w-2.5'
                }`}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Selected card</p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-foreground">{currentCard.bank}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{currentCard.cardHolder}</p>

          <div className="mt-5 grid gap-3 rounded-3xl border border-border/70 bg-white/60 p-4 shadow-[0_16px_40px_-30px_rgba(26,36,86,0.2)]">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Card number</span>
              <span className="font-medium text-foreground">{currentCard.cardNumber}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Expiry</span>
              <span className="font-medium text-foreground">{currentCard.expiryDate}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Balance</span>
              <span className="font-semibold text-foreground">${formatNumber(currentCard.balance)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Card Expense Statistics & Card List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card Expense Statistics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold tracking-tight text-foreground mb-4">
            Card Expense Statistics
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockCardExpenseStats}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {mockCardExpenseStats.map((entry) => (
                  <Cell key={entry.name} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value, entry) => entry.payload.name}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Card List */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold tracking-tight text-foreground mb-4">
            Card List
          </h3>
          <div className="space-y-4">
            {mockCreditCards.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border border-border/70 bg-white/70 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-24px_rgba(26,36,86,0.22)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {card.type === 'primary' ? '💳' : '🏦'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Card Type
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {card.type === 'primary' ? 'Primary' : 'Secondary'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Bank</p>
                    <p className="font-medium text-foreground">{card.bank}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Card Number
                    </p>
                    <p className="font-medium text-foreground">{card.cardNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Namain Card
                    </p>
                    <p className="font-medium text-foreground">{card.cardHolder}</p>
                  </div>
                </div>
                <div className="mt-3">
                  <button className="text-primary text-sm font-semibold hover:underline">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Add New Card & Card Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add New Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold tracking-tight text-foreground mb-4">
            Add New Card
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Credit Card generally means a plastic card issued by Scheduled Commercial
            Banks assigned to a Cardholder, with a credit limit, that can be used to
            purchase goods and services on credit or obtain cash advances.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="card-type" className="block text-sm font-medium text-foreground mb-2">
                Card Type
              </label>
              <select id="card-type" className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option>Classic</option>
                <option>Premium</option>
                <option>Gold</option>
              </select>
            </div>

            <div>
              <label htmlFor="name-on-card" className="block text-sm font-medium text-foreground mb-2">
                Name On Card
              </label>
              <Input
                id="name-on-card"
                placeholder="My Cards"
                className="border-border bg-background"
              />
            </div>

            <div>
              <label htmlFor="card-number" className="block text-sm font-medium text-foreground mb-2">
                Card Number
              </label>
              <Input
                id="card-number"
                placeholder="**** **** **** ****"
                className="border-border bg-background"
              />
            </div>

            <div>
              <label htmlFor="expiration-date" className="block text-sm font-medium text-foreground mb-2">
                Expiration Date
              </label>
              <Input
                id="expiration-date"
                type="date"
                defaultValue="2025-01-25"
                className="border-border bg-background"
              />
            </div>

            <Button className="w-full mt-6 bg-primary text-white hover:bg-primary/90">
              Add Card
            </Button>
          </div>
        </Card>

        {/* Card Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold tracking-tight text-foreground mb-6">
            Card Setting
          </h3>
          <div className="space-y-4">
            {/* Block Card */}
            <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-white/60 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-24px_rgba(26,36,86,0.18)] cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Block Card</p>
                <p className="text-sm text-muted-foreground">
                  Instantly block your card
                </p>
              </div>
            </div>

            {/* Change Pin Code */}
            <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-white/60 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-24px_rgba(26,36,86,0.18)] cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5s-5 2.24-5 5v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Change Pin Code</p>
                <p className="text-sm text-muted-foreground">
                  Choose another pin code
                </p>
              </div>
            </div>

            {/* Add to Google Pay */}
            <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-white/60 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-24px_rgba(26,36,86,0.18)] cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <span className="text-lg font-semibold text-primary">G</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Add to Google Pay</p>
                <p className="text-sm text-muted-foreground">
                  Withdraw without any card
                </p>
              </div>
            </div>

            {/* Add to Apple Pay */}
            <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-white/60 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-24px_rgba(26,36,86,0.18)] cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.05 13.5c0-1.47 1.2-2.62 2.75-2.62 1.54 0 2.73 1.15 2.73 2.62 0 1.5-1.19 2.62-2.73 2.62-1.55 0-2.75-1.12-2.75-2.62zm4.27 0c0-.88-.77-1.63-1.52-1.63-.76 0-1.52.75-1.52 1.63s.76 1.63 1.52 1.63c.75 0 1.52-.75 1.52-1.63z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Add to Apple Pay</p>
                <p className="text-sm text-muted-foreground">
                  Withdraw without any card
                </p>
              </div>
            </div>

            {/* Add to Apple Store */}
            <div className="flex items-start gap-4 rounded-2xl border border-border/70 bg-white/60 p-4 transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-24px_rgba(26,36,86,0.18)] cursor-pointer">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.05 13.5c0-1.47 1.2-2.62 2.75-2.62 1.54 0 2.73 1.15 2.73 2.62 0 1.5-1.19 2.62-2.73 2.62-1.55 0-2.75-1.12-2.75-2.62zm4.27 0c0-.88-.77-1.63-1.52-1.63-.76 0-1.52.75-1.52 1.63s.76 1.63 1.52 1.63c.75 0 1.52-.75 1.52-1.63z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Add to Apple Store</p>
                <p className="text-sm text-muted-foreground">
                  Withdraw without any card
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
