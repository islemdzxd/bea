'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Send, FileSignature, Loader2 } from 'lucide-react';
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
import { AllocationStatusBadge } from '@/components/back-office/status-badge';
import { DocumentList } from '@/components/back-office/document-list';
import { AuditTimeline } from '@/components/back-office/audit-timeline';
import { AllocationDeadlineAlert } from '@/components/back-office/deadline-alert';
import { useAllocation } from '@/hooks/use-back-office-store';
import { adminPost } from '@/lib/bea-admin-api';
import {
  canApproveAllocation,
  canConfirmTransferReceived,
  canRejectAllocation,
  canSendSignedReceipt,
} from '@/lib/workflow';
import { formatAmountDzd, formatAmountEur, formatDate, formatDateTime } from '@/lib/format';

export default function AllocationDetailPage({
  params,
}: {
  readonly params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { request, loading, error, refresh } = useAllocation(id);

  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [observation, setObservation] = useState('');
  const [transferRef, setTransferRef] = useState('');
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
        <p>{error ?? 'Demande introuvable.'}</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/allocations">Retour</Link>
        </Button>
      </Card>
    );
  }

  const code = request.codeDeclaration;

  const handleApprove = () =>
    runAction(async () => {
      if (!observation.trim()) return;
      await adminPost(`/api/allocations/${encodeURIComponent(code)}/approve`, {
        observation,
      });
      setApproveOpen(false);
      setObservation('');
    });

  const handleReject = () =>
    runAction(async () => {
      if (!observation.trim()) return;
      await adminPost(`/api/allocations/${encodeURIComponent(code)}/reject`, {
        observation,
      });
      setRejectOpen(false);
      setObservation('');
    });

  const handleTransferReceived = () =>
    runAction(async () => {
      if (!transferRef.trim()) return;
      await adminPost(
        `/api/allocations/${encodeURIComponent(code)}/transfer-received`,
        { transferReference: transferRef }
      );
      setTransferOpen(false);
      setTransferRef('');
    });

  const handleSendReceipt = () =>
    runAction(async () => {
      await adminPost(`/api/allocations/${encodeURIComponent(code)}/send-receipt`);
      setReceiptOpen(false);
    });

  const handleClassSansSuite = () =>
    runAction(async () => {
      await adminPost(
        `/api/allocations/${encodeURIComponent(code)}/close-without-followup`
      );
    });

  return (
    <div className="space-y-6 max-w-4xl">
      <Button variant="ghost" asChild className="-ml-2">
        <Link href="/allocations">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Allocations
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
          <p className="text-muted-foreground">{request.codeDeclaration}</p>
        </div>
        <AllocationStatusBadge status={request.status} />
      </div>

      <AllocationDeadlineAlert request={request} />

      <Card className="p-5 space-y-3">
        <h3 className="font-semibold">Informations client & voyage</h3>
        <dl className="grid sm:grid-cols-2 gap-3 text-sm">
          <Item label="NIN" value={request.nin} />
          <Item label="Passeport" value={request.passportNumber} />
          <Item label="Destination" value={request.destination} />
          <Item label="Départ" value={formatDate(request.departureDate)} />
          <Item label="Retour" value={formatDate(request.returnDate)} />
          <Item
            label="Montants"
            value={`${formatAmountEur(request.amountEur)} · ${formatAmountDzd(request.amountDzd)}`}
          />
        </dl>
        {request.observation && (
          <p className="text-sm border-t pt-3">
            <span className="font-medium">Observation :</span> {request.observation}
          </p>
        )}
        {request.transferReference && (
          <p className="text-sm">
            <span className="font-medium">Réf. virement :</span>{' '}
            {request.transferReference}
          </p>
        )}
        {request.receiptSignedAt && (
          <p className="text-sm text-green-800">
            Reçu signé envoyé le {formatDateTime(request.receiptSignedAt)}
          </p>
        )}
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Documents transmis</h3>
        <DocumentList documents={request.documents} />
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Actions</h3>
        <div className="flex flex-wrap gap-2">
          {canApproveAllocation(request.status) && (
            <Button onClick={() => setApproveOpen(true)} disabled={submitting}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approuver
            </Button>
          )}
          {canRejectAllocation(request.status) && (
            <Button
              variant="destructive"
              onClick={() => setRejectOpen(true)}
              disabled={submitting}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Rejeter
            </Button>
          )}
          {canConfirmTransferReceived(request.status) && (
            <Button
              variant="secondary"
              onClick={() => setTransferOpen(true)}
              disabled={submitting}
            >
              <Send className="h-4 w-4 mr-2" />
              Virement reçu
            </Button>
          )}
          {canSendSignedReceipt(request.status) && (
            <Button onClick={() => setReceiptOpen(true)} disabled={submitting}>
              <FileSignature className="h-4 w-4 mr-2" />
              Envoyer reçu signé
            </Button>
          )}
          {!['rejete', 'sans_suite', 'recu_envoye'].includes(request.status) && (
            <Button
              variant="outline"
              onClick={handleClassSansSuite}
              disabled={submitting}
            >
              Classer sans suite
            </Button>
          )}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-4">Historique</h3>
        <AuditTimeline entries={request.history} />
      </Card>

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approuver la demande</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Observation (obligatoire)…"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleApprove} disabled={!observation.trim() || submitting}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Motif / observation…"
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!observation.trim() || submitting}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer le virement reçu</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Référence du virement"
            value={transferRef}
            onChange={(e) => setTransferRef(e.target.value)}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setTransferOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleTransferReceived}
              disabled={!transferRef.trim() || submitting}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reçu de versement — signature électronique</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Reçu signé transmis au client ({request.clientEmail}).
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiptOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSendReceipt} disabled={submitting}>
              Émettre et envoyer
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
