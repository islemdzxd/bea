'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Plane,
  Wallet,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { clearSession, getSession } from '@/lib/auth';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/allocations', label: 'Allocations touristiques', icon: Plane },
  { href: '/credits', label: 'Demandes de crédit', icon: Wallet },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [session, setSessionState] = useState<ReturnType<typeof getSession>>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      router.replace('/');
      return;
    }
    setSessionState(s);
  }, [pathname, router]);

  const handleLogout = () => {
    clearSession();
    router.replace('/');
  };

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
          <div className="text-right">
            <p className="text-sm font-medium">{session.name}</p>
            <p className="text-xs capitalize text-muted-foreground">
              {session.role}
            </p>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
