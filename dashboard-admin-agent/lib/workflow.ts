import type { AllocationStatus, TourismAllocationRequest } from './types';

const MS_72H = 72 * 60 * 60 * 1000;

/** Délai limite : 72 h avant la date de départ */
export function allocationDeadline(departureDate: string): Date {
  return new Date(new Date(departureDate).getTime() - MS_72H);
}

export function isPastAllocationDeadline(
  departureDate: string,
  now: Date = new Date()
): boolean {
  return now.getTime() > allocationDeadline(departureDate).getTime();
}

export function hoursUntilAllocationDeadline(
  departureDate: string,
  now: Date = new Date()
): number {
  const ms = allocationDeadline(departureDate).getTime() - now.getTime();
  return Math.max(0, Math.floor(ms / (60 * 60 * 1000)));
}

const TERMINAL_ALLOCATION: AllocationStatus[] = [
  'rejete',
  'sans_suite',
  'recu_envoye',
];

/** Classement automatique sans suite si délai dépassé */
export function shouldAutoCloseAllocation(
  request: TourismAllocationRequest,
  now: Date = new Date()
): boolean {
  if (TERMINAL_ALLOCATION.includes(request.status)) return false;
  if (!isPastAllocationDeadline(request.departureDate, now)) return false;
  return true;
}

export function canApproveAllocation(status: AllocationStatus): boolean {
  return status === 'en_attente';
}

export function canRejectAllocation(status: AllocationStatus): boolean {
  return status === 'en_attente';
}

export function canConfirmTransferReceived(status: AllocationStatus): boolean {
  return status === 'approuve_attente_virement';
}

export function canSendSignedReceipt(status: AllocationStatus): boolean {
  return status === 'virement_recu';
}
