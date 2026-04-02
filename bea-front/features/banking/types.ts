export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type TransferStatus = 'pending' | 'completed' | 'failed';
export type CreditType = 'immobilier' | 'auto' | 'consommation';
export type WorkStatus = 'employed' | 'self-employed' | 'retired' | 'contract';
export type TravelType = 'airline' | 'maritime';
export type AllocationCurrency = 'EUR' | 'USD';
export type StockSide = 'buy' | 'sell';

export interface BankingAccount {
  id: string;
  label: string;
  holderName: string;
  iban: string;
  rib: string;
  balance: number;
  currency: string;
  type: 'checking' | 'savings';
}

export interface BankingTransaction {
  id: string;
  kind: 'transfer' | 'allocation' | 'credit' | 'stock-buy' | 'stock-sell' | 'deposit' | 'withdrawal';
  title: string;
  subtitle: string;
  amount: number;
  date: string;
  icon: string;
  color: string;
  status: TransferStatus | RequestStatus;
  reference: string;
  accountId?: string;
}

export interface AllocationRequest {
  id: string;
  nin: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  passportNumber: string;
  passportExpiryDate: string;
  travelType: TravelType;
  departureDate: string;
  returnDate: string;
  destinationCountry: string;
  currency: AllocationCurrency;
  amount: number;
  passportFileName: string;
  ticketFileName: string;
  status: RequestStatus;
  submittedAt: string;
  decisionReason?: string;
  ageAtDeparture: number;
}

export interface CreditRequest {
  id: string;
  creditType: CreditType;
  requestedAmount: number;
  propertyValue?: number;
  monthlySalary: number;
  workStatus: WorkStatus;
  durationMonths: number;
  salarySlipFileName: string;
  workCertificateFileName: string;
  idDocumentFileName: string;
  status: RequestStatus;
  submittedAt: string;
  decisionReason?: string;
  estimatedMonthlyPayment: number;
}

export interface TransferOrder {
  id: string;
  debitAccountId: string;
  beneficiaryLastName: string;
  beneficiaryFirstName: string;
  address: string;
  rib: string;
  amount: number;
  reason?: string;
  signature: string;
  status: TransferStatus;
  submittedAt: string;
  failureReason?: string;
  reference: string;
}

export interface MarketStock {
  symbol: string;
  name: string;
  exchange: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  description: string;
}

export interface StockPosition {
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  marketValue: number;
  profitLoss: number;
}

export interface StockOrder {
  id: string;
  accountId: string;
  symbol: string;
  name: string;
  side: StockSide;
  quantity: number;
  price: number;
  total: number;
  status: TransferStatus;
  submittedAt: string;
  reference: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  tone: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  read: boolean;
}

export interface BankingState {
  accounts: BankingAccount[];
  allocationRequests: AllocationRequest[];
  creditRequests: CreditRequest[];
  transferOrders: TransferOrder[];
  stockOrders: StockOrder[];
  holdings: StockPosition[];
  marketStocks: MarketStock[];
  transactions: BankingTransaction[];
  notifications: NotificationItem[];
}

export interface AllocationSubmissionInput {
  nin: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  passportNumber: string;
  passportExpiryDate: string;
  travelType: TravelType;
  departureDate: string;
  returnDate: string;
  destinationCountry: string;
  currency: AllocationCurrency;
  amount: number;
  passportFileName: string;
  ticketFileName: string;
  ageAtDeparture: number;
  businessDecision: RequestStatus;
  decisionReason?: string;
}

export interface CreditSubmissionInput {
  creditType: CreditType;
  requestedAmount: number;
  propertyValue?: number;
  monthlySalary: number;
  workStatus: WorkStatus;
  durationMonths: number;
  salarySlipFileName: string;
  workCertificateFileName: string;
  idDocumentFileName: string;
  businessDecision: RequestStatus;
  estimatedMonthlyPayment: number;
  decisionReason?: string;
}

export interface TransferSubmissionInput {
  debitAccountId: string;
  beneficiaryLastName: string;
  beneficiaryFirstName: string;
  address: string;
  rib: string;
  amount: number;
  reason?: string;
  signature: string;
}

export interface StockOrderSubmissionInput {
  accountId: string;
  symbol: string;
  name: string;
  side: StockSide;
  quantity: number;
  price: number;
}
