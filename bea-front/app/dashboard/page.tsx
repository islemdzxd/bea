'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRightLeft, Banknote, BadgeEuro, CandlestickChart, ShieldCheck, Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CardsCarousel } from '@/components/dashboard/cards-carousel';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { WeeklyActivityChart } from '@/components/dashboard/weekly-activity-chart';
import { ExpenseStatisticsChart } from '@/components/dashboard/expense-statistics-chart';
import { BalanceHistoryChart } from '@/components/dashboard/balance-history-chart';
import { QuickTransfer } from '@/components/dashboard/quick-transfer';
import { mockCards, mockWeeklyActivity, mockExpenseStatistics, mockBalanceHistory, mockQuickTransferContacts } from '@/lib/mock-data';
import { useBanking } from '@/features/banking/banking-provider';

export default function DashboardPage() {
  const { state } = useBanking();
  const primaryAccount = state.accounts[0];
  const activeRequests = [...state.allocationRequests, ...state.creditRequests].filter((request) => request.status === 'pending');
  const latestNotifications = state.notifications.slice(0, 4);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Finance Hub</p>
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">Overview</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>Live account sync</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-white/70 px-3 py-1.5 text-xs font-medium text-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            <span>Protected banking session</span>
          </div>
        </div>
      </div>

      {/* Service Hub */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Link href="/dashboard/transactions" className="group rounded-3xl border border-border/70 bg-white/70 p-5 shadow-[0_16px_40px_-30px_rgba(26,36,86,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_45px_-30px_rgba(26,36,86,0.28)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Quick action</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">Transfer</h2>
              <p className="mt-2 text-sm text-muted-foreground">Bank transfer with beneficiary, RIB and confirmation.</p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3 text-primary"><ArrowRightLeft className="h-5 w-5" /></div>
          </div>
        </Link>

        <Link href="/dashboard/tourism" className="group rounded-3xl border border-border/70 bg-white/70 p-5 shadow-[0_16px_40px_-30px_rgba(26,36,86,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_45px_-30px_rgba(26,36,86,0.28)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Quick action</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">Allocation</h2>
              <p className="mt-2 text-sm text-muted-foreground">Tourist allocation request and history tracking.</p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3 text-primary"><BadgeEuro className="h-5 w-5" /></div>
          </div>
        </Link>

        <Link href="/dashboard/loans" className="group rounded-3xl border border-border/70 bg-white/70 p-5 shadow-[0_16px_40px_-30px_rgba(26,36,86,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_45px_-30px_rgba(26,36,86,0.28)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Quick action</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">Credit</h2>
              <p className="mt-2 text-sm text-muted-foreground">Loan application, uploads, and decision history.</p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3 text-primary"><Banknote className="h-5 w-5" /></div>
          </div>
        </Link>

        <Link href="/dashboard/investments" className="group rounded-3xl border border-border/70 bg-white/70 p-5 shadow-[0_16px_40px_-30px_rgba(26,36,86,0.22)] transition-all hover:-translate-y-0.5 hover:shadow-[0_22px_45px_-30px_rgba(26,36,86,0.28)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Quick action</p>
              <h2 className="mt-2 text-lg font-semibold tracking-tight text-foreground">Stocks</h2>
              <p className="mt-2 text-sm text-muted-foreground">Buy and sell orders with portfolio updates.</p>
            </div>
            <div className="rounded-2xl bg-primary/10 p-3 text-primary"><CandlestickChart className="h-5 w-5" /></div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card className="p-4 sm:p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold tracking-tight">Available balance</CardTitle>
            <CardDescription>Primary account balance in real time.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <p className="text-3xl font-semibold tracking-tight text-foreground">{primaryAccount?.balance.toLocaleString()} {primaryAccount?.currency}</p>
            <p className="mt-2 text-sm text-muted-foreground">{primaryAccount?.label} • {primaryAccount?.iban}</p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold tracking-tight">Active requests</CardTitle>
            <CardDescription>Pending credit and allocation requests.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <p className="text-3xl font-semibold tracking-tight text-foreground">{activeRequests.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Requests currently under bank review.</p>
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold tracking-tight">Notifications</CardTitle>
            <CardDescription>Latest system and banking alerts.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <p className="text-3xl font-semibold tracking-tight text-foreground">{latestNotifications.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Unread or recent account updates.</p>
          </CardContent>
        </Card>
      </div>

      {/* Cards Section */}
      <CardsCarousel cards={mockCards} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 sm:gap-6">
        {/* Left Column - Charts */}
        <div className="xl:col-span-2 space-y-6">
          {/* Weekly Activity Chart */}
          <WeeklyActivityChart data={mockWeeklyActivity} />

          {/* Charts Row */}
          <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-2 sm:gap-6">
            {/* Expense Statistics */}
            <ExpenseStatisticsChart data={mockExpenseStatistics} />

            {/* Balance History */}
            <BalanceHistoryChart data={mockBalanceHistory} />
          </div>

          {/* Quick Transfer */}
          <QuickTransfer contacts={mockQuickTransferContacts} />
        </div>

        {/* Right Column - Transactions */}
        <div className="xl:pt-0">
          <RecentTransactions transactions={state.transactions} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr] sm:gap-6">
        <Card className="p-4 sm:p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold tracking-tight">Active requests</CardTitle>
            <CardDescription>Requests waiting for review or requiring follow-up.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-3">
            {activeRequests.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No active requests right now.</div>
            ) : (
              activeRequests.slice(0, 4).map((request) => (
                <div key={request.id} className="rounded-2xl border border-border/70 bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{'creditType' in request ? `${request.creditType} credit` : `${request.destinationCountry} allocation`}</p>
                      <p className="text-xs text-muted-foreground">Submitted {new Date(request.submittedAt).toLocaleString()}</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="p-4 sm:p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-lg font-semibold tracking-tight">Notifications</CardTitle>
            <CardDescription>Operational updates from the banking hub.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0 space-y-3">
            {latestNotifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No notifications yet.</div>
            ) : (
              latestNotifications.map((notification) => (
                <div key={notification.id} className="rounded-2xl border border-border/70 bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    <Clock3 className="mt-1 h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
