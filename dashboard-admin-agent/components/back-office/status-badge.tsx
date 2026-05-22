import { cn } from '@/lib/utils';
import {
  ALLOCATION_STATUS_COLORS,
  ALLOCATION_STATUS_LABELS,
  CREDIT_STATUS_COLORS,
  CREDIT_STATUS_LABELS,
} from '@/lib/labels';
import type { AllocationStatus, CreditStatus } from '@/lib/types';

export function AllocationStatusBadge({ status }: { status: AllocationStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        ALLOCATION_STATUS_COLORS[status]
      )}
    >
      {ALLOCATION_STATUS_LABELS[status]}
    </span>
  );
}

export function CreditStatusBadge({ status }: { status: CreditStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        CREDIT_STATUS_COLORS[status]
      )}
    >
      {CREDIT_STATUS_LABELS[status]}
    </span>
  );
}
