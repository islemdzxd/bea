import type {
  AllocationStatus,
  AuditEntry,
  CreditRequest,
  CreditStatus,
  RequestDocument,
  TourismAllocationRequest,
} from './types';

export interface ApiAllocation {
  id: string;
  codeDeclaration: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  nin: string;
  passportNumber: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  amountEur: number;
  amountDzd: number;
  currency: string;
  status: string;
  documents: RequestDocument[];
  observation?: string;
  transferReference?: string;
  receiptSignedAt?: string;
  verifiedBy?: string;
  history: AuditEntry[];
  createdAt: string;
}

export interface ApiCredit {
  id: string;
  numeroDossier: string;
  clientName: string;
  clientEmail: string;
  codeClient: string;
  typePret: string;
  montantPret: number;
  dureeMois: number;
  salaireMensuel: number;
  status: string;
  documents: RequestDocument[];
  motifRejet?: string;
  appointmentAt?: string;
  appointmentNote?: string;
  processedBy?: string;
  history: AuditEntry[];
  createdAt: string;
}

export interface ApiDashboardStats {
  allocPending: number;
  allocAwaitingTransfer: number;
  allocTransferReceived: number;
  allocUrgent: number;
  creditPending: number;
  creditApproved: number;
  creditTotal: number;
}

export interface ApiAuthResponse {
  token: string;
  matricule: string;
  nom: string;
  prenom: string;
  profil: string;
  agence: string;
}

const ALLOCATION_STATUS_MAP: Record<string, AllocationStatus> = {
  EN_ATTENTE: 'en_attente',
  APPROUVE_ATTENTE_VIREMENT: 'approuve_attente_virement',
  APPROUVE_ATTENTE_VIR: 'approuve_attente_virement',
  VIREMENT_RECU: 'virement_recu',
  RECU_ENVOYE: 'recu_envoye',
  REJETE: 'rejete',
  SANS_SUITE: 'sans_suite',
};

const CREDIT_STATUS_MAP: Record<string, CreditStatus> = {
  EN_ATTENTE: 'en_attente',
  APPROUVE_RDV: 'approuve_rdv',
  REJETE: 'rejete',
};

export function mapAllocationStatus(status: string): AllocationStatus {
  return ALLOCATION_STATUS_MAP[status?.toUpperCase()] ?? 'en_attente';
}

export function mapCreditStatus(status: string): CreditStatus {
  return CREDIT_STATUS_MAP[status?.toUpperCase()] ?? 'en_attente';
}

export function mapAllocation(api: ApiAllocation): TourismAllocationRequest {
  return {
    id: api.id,
    codeDeclaration: api.codeDeclaration,
    clientName: api.clientName,
    clientEmail: api.clientEmail ?? '',
    clientPhone: api.clientPhone ?? '',
    nin: api.nin ?? '',
    passportNumber: api.passportNumber ?? '',
    destination: api.destination ?? '',
    departureDate: api.departureDate ?? '',
    returnDate: api.returnDate ?? '',
    amountEur: Number(api.amountEur ?? 0),
    amountDzd: Number(api.amountDzd ?? 0),
    currency: api.currency ?? 'EUR',
    status: mapAllocationStatus(api.status),
    documents: api.documents ?? [],
    observation: api.observation,
    transferReference: api.transferReference,
    receiptSignedAt: api.receiptSignedAt,
    verifiedBy: api.verifiedBy,
    history: api.history ?? [],
    createdAt: api.createdAt ?? '',
  };
}

export function mapCredit(api: ApiCredit): CreditRequest {
  return {
    id: api.id,
    numeroDossier: api.numeroDossier,
    clientName: api.clientName,
    clientEmail: api.clientEmail ?? '',
    codeClient: api.codeClient,
    typePret: api.typePret,
    montantPret: Number(api.montantPret ?? 0),
    dureeMois: api.dureeMois,
    salaireMensuel: Number(api.salaireMensuel ?? 0),
    status: mapCreditStatus(api.status),
    documents: api.documents ?? [],
    motifRejet: api.motifRejet,
    appointmentAt: api.appointmentAt,
    appointmentNote: api.appointmentNote,
    processedBy: api.processedBy,
    history: api.history ?? [],
    createdAt: api.createdAt ?? '',
  };
}

export function mapProfilToRole(profil: string): 'admin' | 'senior' | 'agent' {
  const p = profil?.toUpperCase() ?? '';
  if (p.includes('ADMIN')) return 'admin';
  if (p.includes('SENIOR') || p.includes('CHEF')) return 'senior';
  return 'agent';
}
