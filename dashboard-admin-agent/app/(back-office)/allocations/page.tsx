'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { AllocationStatusBadge } from '@/components/back-office/status-badge';
import { useBackOfficeData } from '@/hooks/use-back-office-store';
import { formatAmountDzd, formatAmountEur, formatDate } from '@/lib/format';
import type { AllocationStatus } from '@/lib/types';
import { isPastAllocationDeadline } from '@/lib/workflow';

type Filter = 'all' | AllocationStatus;

export default function AllocationsPage() {
  const { allocations, loading, error } = useBackOfficeData();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(() => {
    return allocations
      .filter((a) => filter === 'all' || a.status === filter)
      .filter(
        (a) =>
          a.clientName.toLowerCase().includes(search.toLowerCase()) ||
          a.codeDeclaration.toLowerCase().includes(search.toLowerCase()) ||
          a.destination.toLowerCase().includes(search.toLowerCase())
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [allocations, search, filter]);

  if (loading) {
    return <p className="text-muted-foreground">Chargement des allocations…</p>;
  }

  if (error) {
    return <p className="text-destructive">{error}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Allocations touristiques</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Contrôle des documents — approbation, virement, reçu signé, ou rejet /
          sans suite (72 h avant départ).
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Rechercher client, code, destination…"
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
          <option value="approuve_attente_virement">Attente virement</option>
          <option value="virement_recu">Virement reçu</option>
          <option value="recu_envoye">Reçu envoyé</option>
          <option value="rejete">Rejeté</option>
          <option value="sans_suite">Sans suite</option>
        </select>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            Aucune demande trouvée.
          </Card>
        ) : (
          filtered.map((a) => {
            const urgent =
              !['rejete', 'sans_suite', 'recu_envoye'].includes(a.status) &&
              isPastAllocationDeadline(a.departureDate);
            return (
              <Card
                key={a.id}
                className={`p-4 ${urgent ? 'border-red-300' : ''}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{a.clientName}</h3>
                      <AllocationStatusBadge status={a.status} />
                      {urgent && (
                        <span className="text-xs font-medium text-red-600">
                          Échéance dépassée
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {a.codeDeclaration} — {a.destination}
                    </p>
                    <p className="text-sm mt-2">
                      Départ {formatDate(a.departureDate)} ·{' '}
                      {formatAmountEur(a.amountEur)} /{' '}
                      {formatAmountDzd(a.amountDzd)}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/allocations/${a.id}`}>Traiter</Link>
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
