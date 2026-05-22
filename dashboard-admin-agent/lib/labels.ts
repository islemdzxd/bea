import type { AllocationStatus, CreditStatus } from './types';

export const ALLOCATION_STATUS_LABELS: Record<AllocationStatus, string> = {
  en_attente: 'En attente de vérification',
  approuve_attente_virement: 'Approuvé — en attente de virement',
  virement_recu: 'Virement reçu',
  recu_envoye: 'Reçu de versement envoyé',
  rejete: 'Rejeté',
  sans_suite: 'Classé sans suite',
};

export const CREDIT_STATUS_LABELS: Record<CreditStatus, string> = {
  en_attente: 'En attente de traitement',
  approuve_rdv: 'Approuvé — rendez-vous fixé',
  rejete: 'Rejeté',
};

export const ALLOCATION_STATUS_COLORS: Record<AllocationStatus, string> = {
  en_attente: 'bg-amber-100 text-amber-900 border-amber-200',
  approuve_attente_virement: 'bg-blue-100 text-blue-900 border-blue-200',
  virement_recu: 'bg-indigo-100 text-indigo-900 border-indigo-200',
  recu_envoye: 'bg-green-100 text-green-900 border-green-200',
  rejete: 'bg-red-100 text-red-900 border-red-200',
  sans_suite: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const CREDIT_STATUS_COLORS: Record<CreditStatus, string> = {
  en_attente: 'bg-amber-100 text-amber-900 border-amber-200',
  approuve_rdv: 'bg-green-100 text-green-900 border-green-200',
  rejete: 'bg-red-100 text-red-900 border-red-200',
};
