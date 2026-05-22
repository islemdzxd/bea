'use client';

import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { getJson, postFormData, postJson } from '@/lib/bea-api';
import {
  AllocationRequest,
  AllocationSubmissionInput,
  BankingState,
  BankingTransaction,
  CreditRequest,
  CreditSubmissionInput,
  MarketStock,
  StockOrder,
  StockOrderSubmissionInput,
  TransferOrder,
  TransferSubmissionInput,
} from './types';

type BankingAction =
  | { type: 'HYDRATE'; payload: BankingState }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'UPDATE_ACCOUNT_BALANCE'; payload: { accountId: string; balance: number } };

interface BankingContextValue {
  state: BankingState;
  hydrated: boolean;
  submitAllocationRequest: (input: AllocationSubmissionInput) => Promise<AllocationRequest>;
  submitCreditRequest: (input: CreditSubmissionInput) => Promise<CreditRequest>;
  submitTransferOrder: (input: TransferSubmissionInput) => Promise<{ ok: boolean; order?: TransferOrder; error?: string }>;
  submitStockOrder: (input: StockOrderSubmissionInput) => Promise<{ ok: boolean; order?: StockOrder; error?: string }>;
  markNotificationRead: (id: string) => void;
}

type DashboardAccountResponse = {
  numeroCompte: string;
  agence: string;
  codeDevise: string;
  dateOuverture?: string | null;
  dateFermeture?: string | null;
  compteFerme?: string | null;
  soldeComptable?: number | null;
  soldeIndicatif?: number | null;
  cleRib?: string | null;
  sensCompte?: string | null;
};

type DashboardMovementResponse = {
  numeroMouvement: number;
  numeroCompte: string;
  agence?: string | null;
  codeAgenceDestinatrice?: string | null;
  codeAgenceEmetrice?: string | null;
  codeDevise?: string | null;
  dateComptable?: string | null;
  dateValeur?: string | null;
  libelle?: string | null;
  montant?: number | null;
  sens?: string | null;
  codeOperation?: string | null;
};

type DashboardResponse = {
  cli: string;
  nom: string;
  prenom: string;
  totalBalance: number;
  totalIndicativeBalance: number;
  totalAccounts: number;
  primaryAccount?: DashboardAccountResponse | null;
  accounts: DashboardAccountResponse[];
  recentMovements: DashboardMovementResponse[];
  generatedAt: string;
};

type AllocationContextResponse = {
  cli: string;
  nin?: string | null;
  nom: string;
  prenom: string;
  dateNaissance?: string | null;
  lieuNaissance?: string | null;
  agence?: string | null;
  alreadyUsedThisYear: boolean;
  latestRequest?: AllocationRequestResponse | null;
};

type AllocationRequestResponse = {
  codeDeclaration: string;
  cli: string;
  nin?: string | null;
  nomBenefi?: string | null;
  prenom?: string | null;
  communeNaissanceBenf?: string | null;
  dateNaissanceBenf?: string | null;
  numPasseport?: string | null;
  delivPassp?: string | null;
  dExpPassp?: string | null;
  dateAllez?: string | null;
  dateRetour?: string | null;
  codePays?: string | null;
  nomPays?: string | null;
  codeMonnaie?: string | null;
  cdMoyenTrans?: string | null;
  moyenTrans?: string | null;
  codePostFrontalier?: string | null;
  designationPostFr?: string | null;
  montantTotal?: number | null;
  etat?: string | null;
  statu?: string | null;
  dateSaisie?: string | null;
  observation?: string | null;
  passportMainPagePath?: string | null;
  passportVisaPagePath?: string | null;
  passportNeantPagePath?: string | null;
  ticketCopyPath?: string | null;
};

type CreditContextResponse = {
  cli: string;
  nom: string;
  prenom: string;
  nin?: string | null;
  agence?: string | null;
  dateNaissance?: string | null;
  lieuNaissance?: string | null;
  latestRequest?: CreditRequestResponse | null;
  hasPendingRequest: boolean;
  averageMonthlySalary?: number | null;
};

type CreditRequestResponse = {
  numeroDossier: string;
  cli: string;
  codeClient?: string | null;
  agence?: string | null;
  numeroConvention?: string | null;
  creditType?: string | null;
  requestedAmount?: number | null;
  propertyValue?: number | null;
  monthlySalary?: number | null;
  workStatus?: string | null;
  durationMonths?: number | null;
  estimatedMonthlyPayment?: number | null;
  etatDossier?: string | null;
  dateOuvertureDossier?: string | null;
  dateModificationDossier?: string | null;
  dateDernierEtat?: string | null;
  motifRejet?: string | null;
  salarySlipPath?: string | null;
  workCertificatePath?: string | null;
  idDocumentPath?: string | null;
};

type VirementContextResponse = {
  cli: string;
  nom: string;
  prenom: string;
  accounts: VirementAccountResponse[];
  latestOrder?: VirementResponse | null;
};

type VirementAccountResponse = {
  numeroCompte: string;
  agence?: string | null;
  codeDevise?: string | null;
  soldeComptable?: number | null;
  soldeIndicatif?: number | null;
  cleRib?: string | null;
  sensCompte?: string | null;
  compteFerme?: string | null;
};

type VirementResponse = {
  reference: string;
  codeUtilisateur: string;
  debitAccountNumber: string;
  beneficiaryLastName: string;
  beneficiaryFirstName: string;
  beneficiaryAddress: string;
  beneficiaryRib: string;
  amount: number;
  reason?: string | null;
  donorSignature: string;
  status: string;
  failureReason?: string | null;
  submittedAt?: string | null;
  processedAt?: string | null;
};

type OrdreBourseContextResponse = {
  cli: string;
  nom: string;
  prenom: string;
  accounts: OrdreBourseAccountResponse[];
  latestOrder?: OrdreBourseResponse | null;
};

type OrdreBourseAccountResponse = {
  numeroCompte: string;
  agence?: string | null;
  codeDevise?: string | null;
  soldeComptable?: number | null;
  soldeIndicatif?: number | null;
  cleRib?: string | null;
  sensCompte?: string | null;
  compteFerme?: string | null;
};

type OrdreBourseResponse = {
  reference: string;
  codeUtilisateur: string;
  numeroCompte: string;
  symbol: string;
  stockName: string;
  side: string;
  quantity: number;
  price: number;
  total: number;
  status: string;
  failureReason?: string | null;
  submittedAt?: string | null;
  processedAt?: string | null;
};

const marketStocksSeed: MarketStock[] = [
  { symbol: 'AAPL', name: 'Apple', exchange: 'NASDAQ', sector: 'Technology', price: 196.24, change: 2.14, changePercent: 1.1, volume: '48.2M', marketCap: '3.1T', description: 'Consumer devices and digital services' },
  { symbol: 'TSLA', name: 'Tesla', exchange: 'NASDAQ', sector: 'Automotive', price: 231.48, change: -4.28, changePercent: -1.82, volume: '62.7M', marketCap: '720B', description: 'Electric vehicles and clean energy' },
  { symbol: 'MSFT', name: 'Microsoft', exchange: 'NASDAQ', sector: 'Technology', price: 415.11, change: 3.05, changePercent: 0.74, volume: '21.4M', marketCap: '3.0T', description: 'Cloud, productivity, and AI platforms' },
  { symbol: 'NKE', name: 'Nike', exchange: 'NYSE', sector: 'Consumer', price: 102.67, change: 1.2, changePercent: 1.18, volume: '10.9M', marketCap: '156B', description: 'Global sportswear and retail brand' },
];

const emptyState: BankingState = {
  accounts: [],
  totalBalance: 0,
  totalIndicativeBalance: 0,
  totalAccounts: 0,
  allocationRequests: [],
  creditRequests: [],
  transferOrders: [],
  stockOrders: [],
  holdings: [],
  marketStocks: marketStocksSeed,
  transactions: [],
  notifications: [],
};

const BankingContext = createContext<BankingContextValue | undefined>(undefined);

function asRequestStatus(status?: string | null): 'pending' | 'approved' | 'rejected' {
  const normalized = (status || '').toUpperCase();
  if (normalized.includes('REJ')) return 'rejected';
  if (normalized.includes('APP') || normalized === 'COMPLETED') return 'approved';
  return 'pending';
}

function asTransferStatus(status?: string | null): 'pending' | 'completed' | 'failed' {
  const normalized = (status || '').toUpperCase();
  if (normalized.includes('FAIL') || normalized.includes('REJ')) return 'failed';
  if (normalized.includes('COMP')) return 'completed';
  return 'pending';
}

function asStockOrderStatus(status?: string | null): 'pending' | 'completed' | 'failed' {
  const normalized = (status || '').toUpperCase();
  if (normalized.includes('FAIL') || normalized.includes('REJ')) {
    return 'failed';
  }

  if (normalized.includes('COMP')) {
    return 'completed';
  }

  return 'pending';
}

function mapMovementKind(codeOperation?: string | null): BankingTransaction['kind'] {
  const normalized = (codeOperation || '').toUpperCase();
  if (normalized === 'ACH') return 'stock-buy';
  if (normalized === 'VTE') return 'stock-sell';
  if (normalized === 'VIR') return 'transfer';
  return 'withdrawal';
}

function safeFileName(path?: string | null) {
  if (!path) return '';
  return path.split(/[/\\]/).pop() || '';
}

function mapAccount(account: DashboardAccountResponse | VirementAccountResponse | OrdreBourseAccountResponse): BankingState['accounts'][number] {
  const balance = Number((account.soldeIndicatif ?? account.soldeComptable ?? 0));

  return {
    id: account.numeroCompte,
    label: `Compte ${account.numeroCompte}`,
    holderName: 'Client BEA',
    iban: account.numeroCompte,
    rib: account.cleRib || account.numeroCompte,
    balance,
    currency: account.codeDevise || 'DZD',
    type: account.sensCompte === 'C' ? 'savings' : 'checking',
  };
}

function mapMovement(movement: DashboardMovementResponse): BankingTransaction {
  const amount = Number(movement.montant ?? 0);
  const kind = mapMovementKind(movement.codeOperation);
  const referenceSuffix = movement.codeOperation ? ` • ${movement.codeOperation}` : '';

  return {
    id: String(movement.numeroMouvement),
    kind,
    title: movement.libelle || `Movement ${movement.numeroMouvement}`,
    subtitle: `${movement.numeroCompte}${referenceSuffix}`,
    amount: movement.sens === 'D' ? -amount : amount,
    date: movement.dateValeur || movement.dateComptable || new Date().toISOString(),
    icon: movement.sens === 'D' ? '↘' : '↗',
    color: movement.sens === 'D' ? '#003DA5' : '#0F9D58',
    status: 'completed',
    reference: `${movement.codeOperation || 'MOV'}-${movement.numeroMouvement}`,
    accountId: movement.numeroCompte,
  };
}

function mapAllocation(response: AllocationRequestResponse): AllocationRequest {
  const departureDate = response.dateAllez || '';
  const dateOfBirth = response.dateNaissanceBenf || '';
  const ageAtDeparture = departureDate && dateOfBirth ? Math.max(0, new Date(departureDate).getFullYear() - new Date(dateOfBirth).getFullYear()) : 0;

  return {
    id: response.codeDeclaration,
    nin: response.nin || '',
    lastName: response.nomBenefi || '',
    firstName: response.prenom || '',
    dateOfBirth,
    placeOfBirth: response.communeNaissanceBenf || '',
    passportNumber: response.numPasseport || '',
    passportExpiryDate: response.dExpPassp || '',
    travelType: response.cdMoyenTrans === 'MAR' ? 'maritime' : 'airline',
    departureDate,
    returnDate: response.dateRetour || '',
    destinationCountry: response.nomPays || '',
    currency: (response.codeMonnaie || 'EUR') as AllocationRequest['currency'],
    amount: Number(response.montantTotal ?? 0),
    passportFileName: safeFileName(response.passportMainPagePath),
    ticketFileName: safeFileName(response.ticketCopyPath),
    status: asRequestStatus(response.etat || response.statu),
    submittedAt: response.dateSaisie || new Date().toISOString(),
    decisionReason: response.observation || undefined,
    ageAtDeparture,
  };
}

function mapCredit(response: CreditRequestResponse): CreditRequest {
  return {
    id: response.numeroDossier,
    creditType: (response.creditType || 'consommation').toLowerCase() as CreditRequest['creditType'],
    requestedAmount: Number(response.requestedAmount ?? 0),
    propertyValue: response.propertyValue == null ? undefined : Number(response.propertyValue),
    monthlySalary: Number(response.monthlySalary ?? 0),
    workStatus: (response.workStatus || 'employed') as CreditRequest['workStatus'],
    durationMonths: Number(response.durationMonths ?? 0),
    salarySlipFileName: safeFileName(response.salarySlipPath),
    workCertificateFileName: safeFileName(response.workCertificatePath),
    idDocumentFileName: safeFileName(response.idDocumentPath),
    status: asRequestStatus(response.etatDossier),
    submittedAt: response.dateOuvertureDossier || new Date().toISOString(),
    decisionReason: response.motifRejet || undefined,
    estimatedMonthlyPayment: Number(response.estimatedMonthlyPayment ?? 0),
  };
}

function mapTransfer(response: VirementResponse): TransferOrder {
  return {
    id: response.reference,
    debitAccountId: response.debitAccountNumber,
    beneficiaryLastName: response.beneficiaryLastName,
    beneficiaryFirstName: response.beneficiaryFirstName,
    address: response.beneficiaryAddress,
    rib: response.beneficiaryRib,
    amount: Number(response.amount ?? 0),
    reason: response.reason || undefined,
    signature: response.donorSignature,
    status: asTransferStatus(response.status),
    submittedAt: response.submittedAt || new Date().toISOString(),
    failureReason: response.failureReason || undefined,
    reference: response.reference,
  };
}

function mapStockOrder(response: OrdreBourseResponse): StockOrder {
  return {
    id: response.reference,
    accountId: response.numeroCompte,
    symbol: response.symbol,
    name: response.stockName,
    side: response.side as StockOrder['side'],
    quantity: Number(response.quantity ?? 0),
    price: Number(response.price ?? 0),
    total: Number(response.total ?? 0),
    status: asStockOrderStatus(response.status),
    submittedAt: response.submittedAt || new Date().toISOString(),
    reference: response.reference,
  };
}

function reducer(state: BankingState, action: BankingAction): BankingState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, read: true } : notification,
        ),
      };
    case 'UPDATE_ACCOUNT_BALANCE':
      return {
        ...state,
        accounts: state.accounts.map((account) =>
          account.id === action.payload.accountId ? { ...account, balance: action.payload.balance } : account,
        ),
      };
    default:
      return state;
  }
}

async function loadBankingState(): Promise<BankingState> {
  const token = globalThis.window === undefined
    ? null
    : globalThis.window.localStorage.getItem('bea_client_token') || globalThis.window.sessionStorage.getItem('bea_client_token');

  if (!token) {
    return emptyState;
  }

  const [dashboard, allocationHistory, creditHistory, transferHistory, stockHistory] = await Promise.all([
    getJson<DashboardResponse>('/api/dashboard/me'),
    getJson<AllocationRequestResponse[]>('/api/allocation/me/requests'),
    getJson<CreditRequestResponse[]>('/api/credit/me/requests'),
    getJson<VirementResponse[]>('/api/virement/me/orders'),
    getJson<OrdreBourseResponse[]>('/api/bourse/me/orders'),
  ]);

  return {
    accounts: dashboard.accounts.map(mapAccount),
    totalBalance: Number(dashboard.totalBalance ?? dashboard.totalIndicativeBalance ?? 0),
    totalIndicativeBalance: Number(dashboard.totalIndicativeBalance ?? dashboard.totalBalance ?? 0),
    totalAccounts: Number(dashboard.totalAccounts ?? 0),
    allocationRequests: allocationHistory.map(mapAllocation),
    creditRequests: creditHistory.map(mapCredit),
    transferOrders: transferHistory.map(mapTransfer),
    stockOrders: stockHistory.map(mapStockOrder),
    holdings: [],
    marketStocks: marketStocksSeed,
    transactions: dashboard.recentMovements.map(mapMovement),
    notifications: [],
  };
}

export function BankingProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [state, dispatch] = useReducer(reducer, emptyState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const loadedState = await loadBankingState();
        if (!cancelled) {
          dispatch({ type: 'HYDRATE', payload: loadedState });
        }
      } catch {
        if (!cancelled) {
          dispatch({ type: 'HYDRATE', payload: emptyState });
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    };

    run();

    const handleAuthChanged = () => {
      void refresh();
    };

    globalThis.window?.addEventListener('bea-auth-changed', handleAuthChanged);

    return () => {
      cancelled = true;
      globalThis.window?.removeEventListener('bea-auth-changed', handleAuthChanged);
    };
  }, []);

  const refresh = async () => {
    const loadedState = await loadBankingState();
    dispatch({ type: 'HYDRATE', payload: loadedState });
  };

  const submitAllocationRequest = async (input: AllocationSubmissionInput) => {
    const formData = new FormData();
    formData.append('dateAllez', input.departureDate);
    formData.append('dateRetour', input.returnDate);
    formData.append('codePays', input.destinationCountry.slice(0, 2).toUpperCase());
    formData.append('nomPays', input.destinationCountry);
    formData.append('codeMonnaie', input.currency);
    formData.append('montantTotal', String(input.amount));
    formData.append('cdMoyenTrans', input.travelType === 'maritime' ? 'MAR' : 'AIR');
    formData.append('moyenTrans', input.travelType === 'maritime' ? 'MARITIME' : 'AERIEN');
    formData.append('codePostFrontalier', 'WEB');
    formData.append('designationPostFr', 'WEB');
    formData.append('passportNumber', input.passportNumber);
    formData.append('passportExpiryDate', input.passportExpiryDate);
    formData.append('travelType', input.travelType);
    formData.append('observation', input.decisionReason || '');
    if (input.passportFile) formData.append('passportMainPage', input.passportFile);
    if (input.passportVisaFile) formData.append('passportVisaPage', input.passportVisaFile);
    if (input.passportNeantFile) formData.append('passportNeantPage', input.passportNeantFile);
    if (input.ticketFile) formData.append('ticketCopy', input.ticketFile);

    const response = await postFormData<AllocationRequestResponse>('/api/allocation', formData);
    await refresh();
    return mapAllocation(response);
  };

  const submitCreditRequest = async (input: CreditSubmissionInput) => {
    const formData = new FormData();
    formData.append('creditType', input.creditType);
    formData.append('requestedAmount', String(input.requestedAmount));
    if (input.propertyValue !== undefined) formData.append('propertyValue', String(input.propertyValue));
    formData.append('monthlySalary', String(input.monthlySalary));
    formData.append('workStatus', input.workStatus);
    formData.append('durationMonths', String(input.durationMonths));
    if (input.salarySlipFile) formData.append('salarySlip', input.salarySlipFile);
    if (input.workCertificateFile) formData.append('workCertificate', input.workCertificateFile);
    if (input.idDocumentFile) formData.append('idDocument', input.idDocumentFile);
    formData.append('observation', input.decisionReason || '');

    const response = await postFormData<CreditRequestResponse>('/api/credit', formData);
    await refresh();
    return mapCredit(response);
  };

  const submitTransferOrder = async (input: TransferSubmissionInput) => {
    try {
      const response = await postJson<VirementResponse>('/api/virement', {
        debitAccountId: input.debitAccountId,
        beneficiaryLastName: input.beneficiaryLastName,
        beneficiaryFirstName: input.beneficiaryFirstName,
        address: input.address,
        rib: input.rib,
        amount: input.amount,
        reason: input.reason,
        signature: input.signature,
      });
      await refresh();
      return { ok: true, order: mapTransfer(response) };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Transfer failed.' };
    }
  };

  const submitStockOrder = async (input: StockOrderSubmissionInput) => {
    try {
      const response = await postJson<OrdreBourseResponse>('/api/bourse', {
        accountId: input.accountId,
        symbol: input.symbol,
        name: input.name,
        side: input.side,
        quantity: input.quantity,
        price: input.price,
      });
      await refresh();
      return { ok: true, order: mapStockOrder(response) };
    } catch (error) {
      return { ok: false, error: error instanceof Error ? error.message : 'Stock order failed.' };
    }
  };

  const markNotificationRead = (id: string) => {
    dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
  };

  const value = useMemo<BankingContextValue>(
    () => ({
      state,
      hydrated,
      submitAllocationRequest,
      submitCreditRequest,
      submitTransferOrder,
      submitStockOrder,
      markNotificationRead,
    }),
    [hydrated, state],
  );

  return <BankingContext.Provider value={value}>{children}</BankingContext.Provider>;
}

export function useBanking() {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }

  return context;
}
