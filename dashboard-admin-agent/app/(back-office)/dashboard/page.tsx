'use client';

import Link from 'next/link';
import { Plane, Wallet, AlertCircle, Clock, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBackOfficeData } from '@/hooks/use-back-office-store';

export default function DashboardPage() {
  const { stats, loading, error } = useBackOfficeData();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        Chargement depuis la base de données…
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6 border-red-200 bg-red-50">
        <p className="text-red-900 font-medium">Impossible de joindre bea-admin</p>
        <p className="text-sm text-red-800 mt-2">{error}</p>
        <p className="text-xs text-red-700 mt-2">
          Vérifiez que le backend tourne sur{' '}
          {process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ?? 'http://localhost:8080'}
        </p>
      </Card>
    );
  }

  const allocUrgent = stats?.allocUrgent ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Tableau de bord</h2>
        <p className="text-muted-foreground mt-1">
          Données en temps réel — base PostgreSQL partagée avec bea-admin
        </p>
      </div>

      {allocUrgent > 0 && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">
              {allocUrgent} allocation(s) à risque de classement sans suite
            </p>
            <p className="text-sm text-red-800 mt-1">
              Délai de 72 h avant la date de départ dépassé.
            </p>
          </div>
        </div>
      )}

      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plane className="h-5 w-5 text-primary" />
          Allocations touristiques
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="En attente de vérification" value={stats?.allocPending ?? 0} />
          <StatCard
            label="En attente de virement"
            value={stats?.allocAwaitingTransfer ?? 0}
            hint="Client instruit"
          />
          <StatCard
            label="Virement reçu"
            value={stats?.allocTransferReceived ?? 0}
            hint="Reçu à émettre"
          />
          <StatCard
            label="Échéance dépassée"
            value={allocUrgent}
            variant="warning"
          />
        </div>
        <Button asChild className="mt-4">
          <Link href="/allocations">Voir toutes les allocations</Link>
        </Button>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          Demandes de crédit
        </h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="En attente de traitement" value={stats?.creditPending ?? 0} />
          <StatCard label="Approuvées (RDV fixé)" value={stats?.creditApproved ?? 0} />
          <StatCard label="Total dossiers" value={stats?.creditTotal ?? 0} />
        </div>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/credits">Voir tous les crédits</Link>
        </Button>
      </section>

      <Card className="p-4 border-dashed">
        <div className="flex gap-3 text-sm text-muted-foreground">
          <Clock className="h-5 w-5 shrink-0 text-primary" />
          <p>
            <strong className="text-foreground">Règle métier :</strong> classement
            sans suite automatique si le délai de 72 h avant le départ est dépassé.
          </p>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  variant,
}: {
  label: string;
  value: number;
  hint?: string;
  variant?: 'warning';
}) {
  return (
    <Card
      className={`p-4 ${
        variant === 'warning' && value > 0
          ? 'border-red-200 bg-red-50/50'
          : ''
      }`}
    >
      <p className="text-3xl font-bold text-foreground">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
      {hint && <p className="text-xs text-muted-foreground mt-2">{hint}</p>}
    </Card>
  );
}
