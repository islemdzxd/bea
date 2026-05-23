'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CreditStatusBadge } from '@/components/back-office/status-badge';
import { useBackOfficeData } from '@/hooks/use-back-office-store';
import { formatAmountDzd, formatDate } from '@/lib/format';
import type { CreditStatus } from '@/lib/types';

type Filter = 'all' | CreditStatus;

export default function CreditsPage() {
  const { credits, loading, error } = useBackOfficeData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    return credits
      .filter((c) => filter === 'all' || c.status === filter)
      .filter(
        (c) =>
          c.clientName.toLowerCase().includes(search.toLowerCase()) ||
          c.numeroDossier.toLowerCase().includes(search.toLowerCase()) ||
          c.typePret.toLowerCase().includes(search.toLowerCase())
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [credits, search, filter]);

  if (loading) {
    return <p className="text-muted-foreground">Chargement des dossiers crédit…</p>;
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Demandes de crédit</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Traitement selon les documents — approbation avec rendez-vous ou rejet
          avec observation.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Rechercher client, dossier, type…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value as Filter)}
        >
          <option value="all">Tous les statuts</option>
          <option value="en_attente">En attente</option>
          <option value="approuve_rdv">Approuvé (RDV)</option>
          <option value="rejete">Rejeté</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            Aucun dossier trouvé.
          </Card>
        ) : (
          filtered.map((c) => (
            <Card key={c.id} className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{c.clientName}</h3>
                    <CreditStatusBadge status={c.status} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {c.numeroDossier} — {c.typePret}
                  </p>
                  <p className="text-sm mt-2">
                    {formatAmountDzd(c.montantPret)} · {c.dureeMois} mois ·
                    Ouvert le {formatDate(c.createdAt)}
                  </p>
                  {c.appointmentAt && c.status === 'approuve_rdv' && (
                    <p className="text-sm text-green-800 mt-1">
                      RDV : {formatDate(c.appointmentAt)} à{' '}
                      {new Date(c.appointmentAt).toLocaleTimeString('fr-DZ', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {c.appointmentNote ? ` — ${c.appointmentNote}` : ''}
                    </p>
                  )}
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/credits/${c.id}`}>Traiter</Link>
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
