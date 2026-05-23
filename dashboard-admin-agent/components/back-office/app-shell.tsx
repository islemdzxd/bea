'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Plane,
  Settings2,
  Wallet,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { clearSession, getSession } from '@/lib/auth';
import { formatDateTime } from '@/lib/format';
import { useBackOfficeData } from '@/hooks/use-back-office-store';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/allocations', label: 'Allocations touristiques', icon: Plane },
  { href: '/credits', label: 'Demandes de crédit', icon: Wallet },
];

function getAllocationStatusLabel(status: string) {
  if (status === 'en_attente') return 'Demande d’allocation reçue';
  if (status === 'approuve_attente_virement') return 'Allocation approuvée, virement attendu';
  if (status === 'virement_recu') return 'Virement reçu pour allocation';
  if (status === 'recu_envoye') return 'Reçu envoyé';
  if (status === 'rejete') return 'Allocation rejetée';
  return 'Allocation mise à jour';
}

function getCreditStatusLabel(status: string) {
  if (status === 'approuve_rdv') return 'RDV fixé pour la demande de crédit';
  if (status === 'rejete') return 'Demande de crédit rejetée';
  return 'Demande de crédit mise à jour';
}

export function AppShell({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [session, setSession] = useState<ReturnType<typeof getSession> | null>(null);
  const { allocations, credits } = useBackOfficeData();

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace('/');
      return;
    }
    setSession(s);
  }, [pathname, router]);

  const handleLogout = () => {
    clearSession();
    router.replace('/');
  };

  const notifications = useMemo(() => {
    const allocationItems = allocations.map((allocation) => {
      const latestHistory = allocation.history
        .slice()
        .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())[0];

      return {
        id: `allocation-${allocation.id}`,
        title: allocation.clientName,
        category: 'Allocation touristique',
        message: latestHistory?.detail || getAllocationStatusLabel(allocation.status),
        at: latestHistory?.at || allocation.createdAt,
        href: `/allocations/${allocation.id}`,
      };
    });

    const creditItems = credits.flatMap((credit) => {
      const latestHistory = credit.history
        .slice()
        .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())[0];

      const items = [
        {
          id: `credit-${credit.id}`,
          title: credit.clientName,
          category: 'Demande de crédit',
          message:
            latestHistory?.detail ||
            getCreditStatusLabel(credit.status),
          at: latestHistory?.at || credit.createdAt,
          href: `/credits/${credit.id}`,
        },
      ];

      if (credit.status === 'approuve_rdv' && credit.appointmentAt) {
        items.unshift({
          id: `credit-rdv-${credit.id}`,
          title: credit.clientName,
          category: 'Rendez-vous',
          message: `RDV le ${formatDateTime(credit.appointmentAt)}${
            credit.appointmentNote ? ` — ${credit.appointmentNote}` : ''
          }`,
          at: credit.appointmentAt,
          href: `/credits/${credit.id}`,
        });
      }

      return items;
    });

    return [...allocationItems, ...creditItems]
      .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
      .slice(0, 6);
  }, [allocations, credits]);

  const unreadCount = notifications.length;

  if (!session) return null;

  return (
    <div className="flex h-screen bg-background">
      <aside
        className={cn(
          'flex flex-col border-r border-border bg-card transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-[4.5rem]'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {sidebarOpen ? (
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src="/bank-logo.svg"
                alt="BEA"
                width={36}
                height={36}
                className="h-9 w-9 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">Back-office</p>
                <p className="text-[10px] text-muted-foreground">Agents & admin</p>
              </div>
            </div>
          ) : (
            <Image
              src="/bank-logo.svg"
              alt="BEA"
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 object-contain"
            />
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-1.5 hover:bg-secondary"
            aria-label="Menu"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary"
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <h1 className="text-lg font-semibold text-foreground">
            Banque Extérieure d&apos;Algérie
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((value) => !value)}
                className="relative rounded-full border border-border bg-background p-2 text-foreground transition-colors hover:bg-secondary"
                aria-label="Notifications récentes"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="fixed right-6 top-20 z-50 w-[24rem] overflow-hidden rounded-2xl border border-border bg-card shadow-xl">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-semibold text-foreground">Notifications récentes</p>
                    <p className="text-xs text-muted-foreground">
                      Suivi des allocations, crédits et rendez-vous
                    </p>
                  </div>
                  <div className="max-h-[24rem] overflow-auto">
                    {notifications.length > 0 ? (
                      notifications.map((item) => (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setNotificationsOpen(false)}
                          className="block border-b border-border px-4 py-3 transition-colors last:border-b-0 hover:bg-secondary/70"
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                              <ChevronRight className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                                {item.category}
                              </p>
                              <p className="truncate text-sm font-medium text-foreground">
                                {item.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {item.message}
                              </p>
                              <time className="mt-1 block text-xs text-muted-foreground">
                                {formatDateTime(item.at)}
                              </time>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-sm text-muted-foreground">
                        Aucune notification récente.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/settings"
              className="rounded-full border border-border bg-background p-2 text-foreground transition-colors hover:bg-secondary"
              aria-label="Paramètres"
            >
              <Settings2 className="h-5 w-5" />
            </Link>

            <div className="text-right">
              <p className="text-sm font-medium">{session.name}</p>
              <p className="text-xs capitalize text-muted-foreground">
                {session.role}
              </p>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
