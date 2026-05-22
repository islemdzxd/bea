export type StaffRole = 'admin' | 'senior' | 'agent';

export interface StaffUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: StaffRole;
}

/** Allocation touristique — workflow back-office */
export type AllocationStatus =
  | 'en_attente'
  | 'approuve_attente_virement'
  | 'virement_recu'
  | 'recu_envoye'
  | 'rejete'
  | 'sans_suite';

/** Demande de crédit */
export type CreditStatus = 'en_attente' | 'approuve_rdv' | 'rejete';

export interface RequestDocument {
  id: string;
  label: string;
  fileName: string;
  downloadUrl?: string;
}

export interface AuditEntry {
  id: string;
  at: string;
  by: string;
  action: string;
  detail?: string;
}

export interface TourismAllocationRequest {
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
  status: AllocationStatus;
  documents: RequestDocument[];
  observation?: string;
  transferReference?: string;
  receiptSignedAt?: string;
  verifiedBy?: string;
  history: AuditEntry[];
  createdAt: string;
}

export interface CreditRequest {
  id: string;
  numeroDossier: string;
  clientName: string;
  clientEmail: string;
  codeClient: string;
  typePret: string;
  montantPret: number;
  dureeMois: number;
  salaireMensuel: number;
  status: CreditStatus;
  documents: RequestDocument[];
  motifRejet?: string;
  appointmentAt?: string;
  appointmentNote?: string;
  processedBy?: string;
  history: AuditEntry[];
  createdAt: string;
}

export interface StaffSession {
  token: string;
  matricule: string;
  name: string;
  role: StaffRole;
  agence?: string;
}
