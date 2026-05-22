import { AppShell } from '@/components/back-office/app-shell';

export default function BackOfficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
