'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreditStatusBadge } from '@/components/back-office/status-badge';
import { DocumentList } from '@/components/back-office/document-list';
import { AuditTimeline } from '@/components/back-office/audit-timeline';
import { useCredit } from '@/hooks/use-back-office-store';
import { adminPost } from '@/lib/bea-admin-api';
import { formatAmountDzd, formatDate, formatDateTime } from '@/lib/format';

export default function CreditDetailPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { request, loading, error, refresh } = useCredit(id);

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [appointmentAt, setAppointmentAt] = useState('');
  const [appointmentNote, setAppointmentNote] = useState('');
  const [motifRejet, setMotifRejet] = useState('');
  const [actionError, setActionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const runAction = async (fn: () => Promise<void>) => {
    setActionError('');
    setSubmitting(true);
    try {
      await fn();
      await refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Action échouée');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <p className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Chargement…
      </p>
    );
  }

  if (error || !request) {
    return (
      <Card className="p-8 text-center">
        <p>{error ?? 'Dossier introuvable.'}</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/credits">Retour</Link>
        </Button>
      </Card>
    );
  }

  const numero = request.numeroDossier;
  const pending = request.status === 'en_attente';

  const handleApprove = () =>
    runAction(async () => {
      if (!appointmentAt || !appointmentNote.trim()) return;
      const iso = new Date(appointmentAt).toISOString();
      await adminPost(`/api/credits/${encodeURIComponent(numero)}/approve`, {
        appointmentAt: iso,
        appointmentNote,
      });
      setApproveOpen(false);
    });

  const handleReject = () =>
    runAction(async () => {
      if (!motifRejet.trim()) return;
      await adminPost(`/api/credits/${encodeURIComponent(numero)}/reject`, {
        observation: motifRejet,
      });
      setRejectOpen(false);
      setMotifRejet('');
    });

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/credits">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Crédits
        </Link>
      </Button>

      {actionError && (
        <div className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {actionError}
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">{request.clientName}</h2>
          <p className="text-muted-foreground">{request.numeroDossier}</p>
        </div>
        <CreditStatusBadge status={request.status} />
      </div>

      <Card className="p-5 space-y-3">
        <h3 className="font-semibold">Dossier crédit</h3>
        <dl className="grid sm:grid-cols-2 gap-3 text-sm">
          <Item label="Code client" value={request.codeClient} />
          <Item label="Type de prêt" value={request.typePret} />
          <Item label="Montant" value={formatAmountDzd(request.montantPret)} />
          <Item label="Durée" value={`${request.dureeMois} mois`} />
          <Item
            label="Salaire mensuel"
            value={formatAmountDzd(request.salaireMensuel)}
          />
          <Item label="Ouvert le" value={formatDate(request.createdAt)} />
        </dl>
        {request.appointmentAt && request.status === 'approuve_rdv' && (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4 mt-2">
            <p className="font-semibold text-green-900 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Rendez-vous client
            </p>
            <p className="text-sm text-green-800 mt-1">
              {formatDateTime(request.appointmentAt)}
            </p>
            {request.appointmentNote && (
              <p className="text-sm text-green-800 mt-2">{request.appointmentNote}</p>
            )}
          </div>
        )}
        {request.motifRejet && (
          <p className="text-sm border-t pt-3 text-red-800">
            <span className="font-medium">Motif de rejet :</span> {request.motifRejet}
          </p>
        )}
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Documents transmis</h3>
        <DocumentList documents={request.documents} />
      </Card>

      {pending && (
        <Card className="p-5">
          <h3 className="font-semibold mb-4">Décision</h3>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setApproveOpen(true)} disabled={submitting}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver et fixer un RDV
            </Button>
            <Button
              variant="destructive"
              onClick={() => setRejectOpen(true)}
              disabled={submitting}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </Button>
          </div>
        </Card>
      )}

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Historique</h3>
        <AuditTimeline entries={request.history} />
      </Card>

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approuver — fixer un rendez-vous</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label htmlFor="credit-appointment-at" className="text-sm font-medium">
                Date et heure du RDV
              </label>
              <Input
                id="credit-appointment-at"
                type="datetime-local"
                value={appointmentAt}
                onChange={(e) => setAppointmentAt(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="credit-appointment-note" className="text-sm font-medium">
                Instructions client
              </label>
              <Textarea
                id="credit-appointment-note"
                className="mt-1"
                rows={3}
                value={appointmentNote}
                onChange={(e) => setAppointmentNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleApprove}
              disabled={!appointmentAt || !appointmentNote.trim() || submitting}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter le dossier</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Motif de rejet…"
            value={motifRejet}
            onChange={(e) => setMotifRejet(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!motifRejet.trim() || submitting}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Item({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
