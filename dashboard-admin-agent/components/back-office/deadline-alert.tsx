import { AlertTriangle, Clock } from 'lucide-react';
import {
  allocationDeadline,
  hoursUntilAllocationDeadline,
  isPastAllocationDeadline,
} from '@/lib/workflow';
import { formatDate, formatDateTime } from '@/lib/format';
import type { TourismAllocationRequest } from '@/lib/types';

export function AllocationDeadlineAlert({
  request,
}: {
  request: TourismAllocationRequest;
}) {
  if (['rejete', 'sans_suite', 'recu_envoye'].includes(request.status)) {
    return null;
  }

  const past = isPastAllocationDeadline(request.departureDate);
  const hoursLeft = hoursUntilAllocationDeadline(request.departureDate);
  const deadline = allocationDeadline(request.departureDate);

  if (past) {
    return (
      <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900">
        <AlertTriangle className="h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold text-sm">Délai réglementaire dépassé</p>
          <p className="text-sm mt-1">
            La date limite (72 h avant le départ du{' '}
            {formatDate(request.departureDate)}) était le{' '}
            {formatDateTime(deadline.toISOString())}. La demande peut être
            classée sans suite automatiquement.
          </p>
        </div>
      </div>
    );
  }

  if (hoursLeft <= 48) {
    return (
      <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <Clock className="h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold text-sm">Échéance proche</p>
          <p className="text-sm mt-1">
            Il reste environ {hoursLeft} h avant la limite (72 h avant départ).
            Date limite : {formatDateTime(deadline.toISOString())}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 rounded-lg border border-border bg-secondary/50 p-4 text-muted-foreground">
      <Clock className="h-5 w-5 shrink-0 text-primary" />
      <p className="text-sm">
        Date de départ : {formatDate(request.departureDate)} — limite de traitement
        : {formatDateTime(deadline.toISOString())} ({hoursLeft} h restantes).
      </p>
    </div>
  );
}
