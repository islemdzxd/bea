'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Bell, Settings, LogOut, Menu, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getSessionClientProfile } from '@/lib/client-session';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  id: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
      </svg>
    ),
  },
  {
    id: 'transactions',
    label: 'Transfer',
    href: '/dashboard/transactions',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      </svg>
    ),
  },
  {
    id: 'investments',
    label: 'Stocks',
    href: '/dashboard/investments',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
      </svg>
    ),
  },
  {
    id: 'credit-cards',
    label: 'Credit Cards',
    href: '/dashboard/credit-cards',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 8H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H4V10h16v10zm-1-9h-4c-.55 0-1 .45-1 1s.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1z" />
      </svg>
    ),
  },
  {
    id: 'loans',
    label: 'Credit',
    href: '/dashboard/loans',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
      </svg>
    ),
  },
  {
    id: 'tourism',
    label: 'Allocation',
    href: '/dashboard/tourism',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: (
      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.62l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.48.1.62l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.1.62l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.48-.12-.62l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
      </svg>
    ),
  },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [clientName, setClientName] = useState('Client');
  const [clientEmail, setClientEmail] = useState('client@bea.local');
  const [avatarSrc, setAvatarSrc] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Client');

  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const profile = getSessionClientProfile();
    if (!profile) return;

    const resolvedName = [profile.prenom ?? profile.firstName, profile.nom ?? profile.lastName]
      .filter(Boolean)
      .join(' ')
      .trim();

    const fallbackEmail = profile.cli ? `${profile.cli.toLowerCase()}@bea.local` : 'client@bea.local';
    const avatarSeed = (resolvedName || profile.cli || 'Client').replaceAll(' ', '-');

    setClientName(resolvedName || profile.cli || 'Client');
    setClientEmail(profile.email || fallbackEmail);
    setAvatarSrc(profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`);
  }, []);

  const avatarFallback = useMemo(() => clientName.slice(0, 1).toUpperCase() || 'C', [clientName]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('bea_client_token');
    localStorage.removeItem('bea_client_profile');
    sessionStorage.removeItem('bea_client_token');
    sessionStorage.removeItem('bea_client_profile');
    localStorage.removeItem('bea-banking-state-v1');
    router.push('/');
  };

  const isSidebarItemActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background p-3 md:p-4">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } h-full glass-surface apple-ring rounded-3xl transition-all duration-300 hidden lg:flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-border/70 flex items-center justify-center">
          <Image
            src="/logo%202.svg"
            alt="BEA logo"
            width={sidebarOpen ? 230 : 72}
            height={72}
            className={sidebarOpen ? 'h-[72px] w-[230px] object-contain' : 'h-[72px] w-[72px] object-contain'}
            priority
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2.5">
          {sidebarItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-200 ${
                isSidebarItemActive(item.href)
                  ? 'bg-primary text-white shadow-lg shadow-blue-500/25'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/80'
              }`}
              title={sidebarOpen ? '' : item.label}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Toggle */}
        <div className="p-4 border-t border-border/70">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full rounded-xl bg-white/60"
          >
            {sidebarOpen ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col overflow-hidden rounded-3xl glass-surface apple-ring ml-0 lg:ml-4">
        {/* Top Header */}
        <header className="border-b border-border/70 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex-1 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
            <div className="hidden md:block w-full max-w-sm">
              <input
                type="text"
                placeholder="Search for something"
                className="w-full bg-white/70 border border-border/80 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Right Header Items */}
          <div className="flex items-center gap-2 md:gap-3">
            <Button variant="ghost" size="icon" className="relative rounded-xl">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={handleLogout} title="Logout">
              <LogOut className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2 pl-4 border-l border-border/70">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{clientName}</p>
                <p className="text-xs text-muted-foreground">{clientEmail}</p>
              </div>
              <Avatar className="h-10 w-10">
                <AvatarImage src={avatarSrc} alt={clientName} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white/70 border-b border-border/70 p-4">
            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
                    isSidebarItemActive(item.href)
                      ? 'bg-primary text-white shadow-lg shadow-blue-500/25'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/80'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
