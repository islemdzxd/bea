'use client';

import { BellRing, CheckCircle2, ShieldCheck, UserCog } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { getSession } from '@/lib/auth';

const preferenceItems = [
  {
    icon: BellRing,
    title: 'Notifications de suivi',
    description: 'Recevoir les mises à jour sur les allocations, crédits et RDV.',
  },
  {
    icon: ShieldCheck,
    title: 'Accès sécurisé',
    description: 'Garder la session active uniquement sur cet appareil.',
  },
  {
    icon: CheckCircle2,
    title: 'Confirmation rapide',
    description: 'Voir en priorité les statuts changés et les rendez-vous fixés.',
  },
];

export default function SettingsPage() {
  const [session, setSession] = useState<ReturnType<typeof getSession>>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Paramètres</h2>
        <p className="mt-1 text-muted-foreground">
          Réglages du compte et préférences de suivi pour les demandes en cours.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <UserCog className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Compte connecté</p>
              <p className="text-sm text-muted-foreground">
                {session?.name ?? 'Session en cours'}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Rôle</p>
              <p className="mt-1 text-sm font-medium text-foreground capitalize">
                {session?.role ?? 'agent'}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Agence</p>
              <p className="mt-1 text-sm font-medium text-foreground">
                {session?.agence ?? 'BEA'}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            Les notifications affichent les dernières demandes d’allocation, de crédit et les rendez-vous fixés.
          </div>
        </Card>

        <Card className="p-5">
          <p className="text-sm font-semibold text-foreground">Préférences</p>
          <div className="mt-4 space-y-4">
            {preferenceItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-3">
                  <div className="mt-0.5 rounded-full bg-secondary p-2 text-foreground">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
