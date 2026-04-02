'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BankingTransaction } from '@/features/banking/types';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

interface RecentTransactionsProps {
  transactions: BankingTransaction[];
}

export function RecentTransactions({ transactions }: Readonly<RecentTransactionsProps>) {
  const getTransactionColor = (transaction: BankingTransaction) => {
    if (transaction.amount < 0) {
      return 'text-red-600';
    }

    return 'text-emerald-700';
  };

  return (
    <Card className="h-full p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">Recent Transactions</CardTitle>
        <CardDescription>Latest account movements with a clean, readable summary.</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        {transactions.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">•</EmptyMedia>
              <EmptyTitle>No transactions yet</EmptyTitle>
              <EmptyDescription>Your latest activity will appear here once payments start flowing.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="group rounded-3xl border border-border/70 bg-white/70 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-26px_rgba(26,36,86,0.24)] sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-3xl text-xl shadow-[0_12px_24px_-16px_rgba(26,36,86,0.35)] transition-transform duration-200 group-hover:scale-[1.03]"
                      style={{ backgroundColor: `${transaction.color}18` }}
                    >
                      {transaction.icon}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold text-foreground">{transaction.title}</p>
                        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-secondary-foreground">
                          {transaction.kind}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {transaction.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:text-right">
                    <p className={`text-lg font-semibold tracking-tight ${getTransactionColor(transaction)}`}>
                      {transaction.type === 'withdrawal' ? '-' : '+'}${transaction.amount}
                    </p>
                    <span className="inline-flex items-center rounded-full border border-border/70 bg-white/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                      {transaction.type === 'transfer' ? 'Transfer' : 'Payment'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
