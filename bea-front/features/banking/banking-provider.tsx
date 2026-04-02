'use client';

import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { mockUser, mockTransactions } from '@/lib/mock-data';
import {
  AllocationRequest,
  AllocationSubmissionInput,
  BankingState,
  BankingTransaction,
  CreditRequest,
  CreditSubmissionInput,
  MarketStock,
  NotificationItem,
  StockOrder,
  StockOrderSubmissionInput,
  StockPosition,
  TransferOrder,
  TransferSubmissionInput,
} from './types';

type BankingAction =
  | { type: 'HYDRATE'; payload: BankingState }
  | { type: 'ADD_ALLOCATION_REQUEST'; payload: AllocationRequest }
  | { type: 'ADD_CREDIT_REQUEST'; payload: CreditRequest }
  | { type: 'ADD_TRANSFER_ORDER'; payload: TransferOrder }
  | { type: 'ADD_STOCK_ORDER'; payload: StockOrder }
  | { type: 'ADD_TRANSACTION'; payload: BankingTransaction }
  | { type: 'UPDATE_ACCOUNT_BALANCE'; payload: { accountId: string; balance: number } }
  | { type: 'UPSERT_HOLDING'; payload: StockPosition }
  | { type: 'ADD_NOTIFICATION'; payload: NotificationItem }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string };

interface BankingContextValue {
  state: BankingState;
  hydrated: boolean;
  submitAllocationRequest: (input: AllocationSubmissionInput) => AllocationRequest;
  submitCreditRequest: (input: CreditSubmissionInput) => CreditRequest;
  submitTransferOrder: (input: TransferSubmissionInput) => { ok: boolean; order?: TransferOrder; error?: string };
  submitStockOrder: (input: StockOrderSubmissionInput) => { ok: boolean; order?: StockOrder; error?: string };
  markNotificationRead: (id: string) => void;
}

const STORAGE_KEY = 'bea-banking-state-v1';

const marketStocksSeed: MarketStock[] = [
  {
    symbol: 'AAPL',
    name: 'Apple',
    exchange: 'NASDAQ',
    sector: 'Technology',
    price: 196.24,
    change: 2.14,
    changePercent: 1.1,
    volume: '48.2M',
    marketCap: '3.1T',
    description: 'Consumer devices and digital services',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla',
    exchange: 'NASDAQ',
    sector: 'Automotive',
    price: 231.48,
    change: -4.28,
    changePercent: -1.82,
    volume: '62.7M',
    marketCap: '720B',
    description: 'Electric vehicles and clean energy',
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft',
    exchange: 'NASDAQ',
    sector: 'Technology',
    price: 415.11,
    change: 3.05,
    changePercent: 0.74,
    volume: '21.4M',
    marketCap: '3.0T',
    description: 'Cloud, productivity, and AI platforms',
  },
  {
    symbol: 'NKE',
    name: 'Nike',
    exchange: 'NYSE',
    sector: 'Consumer',
    price: 102.67,
    change: 1.2,
    changePercent: 1.18,
    volume: '10.9M',
    marketCap: '156B',
    description: 'Global sportswear and retail brand',
  },
];

const initialState: BankingState = {
  accounts: [
    {
      id: 'acc-checking',
      label: 'Compte courant',
      holderName: `${mockUser.firstName} ${mockUser.lastName}`,
      iban: 'DZ84 0079 9900 1234 5678 9001',
      rib: '00799900123456789001',
      balance: 824000,
      currency: 'DZD',
      type: 'checking',
    },
    {
      id: 'acc-savings',
      label: 'Compte épargne',
      holderName: `${mockUser.firstName} ${mockUser.lastName}`,
      iban: 'DZ84 0079 9900 1234 5678 9002',
      rib: '00799900123456789002',
      balance: 1540000,
      currency: 'DZD',
      type: 'savings',
    },
  ],
  allocationRequests: [
    {
      id: 'alloc-seed-1',
      nin: '123456789012345678',
      lastName: 'Cusuma',
      firstName: 'Eddy',
      dateOfBirth: '1990-01-15',
      placeOfBirth: 'Algiers',
      passportNumber: 'P12345678',
      passportExpiryDate: '2027-10-31',
      travelType: 'airline',
      departureDate: '2026-06-02',
      returnDate: '2026-06-14',
      destinationCountry: 'France',
      currency: 'EUR',
      amount: 750,
      passportFileName: 'passport.pdf',
      ticketFileName: 'ticket.pdf',
      status: 'approved',
      submittedAt: '2026-03-01T10:00:00.000Z',
      ageAtDeparture: 36,
    },
    {
      id: 'alloc-seed-2',
      nin: '123456789012345679',
      lastName: 'Bentahar',
      firstName: 'Nora',
      dateOfBirth: '2010-07-02',
      placeOfBirth: 'Oran',
      passportNumber: 'P98765432',
      passportExpiryDate: '2026-04-01',
      travelType: 'maritime',
      departureDate: '2026-07-12',
      returnDate: '2026-07-20',
      destinationCountry: 'Tunisia',
      currency: 'EUR',
      amount: 300,
      passportFileName: 'passport.pdf',
      ticketFileName: 'ticket.pdf',
      status: 'pending',
      submittedAt: '2026-03-20T11:30:00.000Z',
      ageAtDeparture: 15,
    },
  ],
  creditRequests: [
    {
      id: 'credit-seed-1',
      creditType: 'immobilier',
      requestedAmount: 2500000,
      propertyValue: 3500000,
      monthlySalary: 180000,
      workStatus: 'employed',
      durationMonths: 240,
      salarySlipFileName: 'salary-slips.pdf',
      workCertificateFileName: 'certificate.pdf',
      idDocumentFileName: 'id.pdf',
      status: 'pending',
      submittedAt: '2026-03-18T09:00:00.000Z',
      estimatedMonthlyPayment: 17500,
    },
    {
      id: 'credit-seed-2',
      creditType: 'auto',
      requestedAmount: 900000,
      monthlySalary: 95000,
      workStatus: 'self-employed',
      durationMonths: 60,
      salarySlipFileName: 'salary-slips.pdf',
      workCertificateFileName: 'certificate.pdf',
      idDocumentFileName: 'id.pdf',
      status: 'rejected',
      submittedAt: '2026-02-10T15:00:00.000Z',
      decisionReason: 'Monthly salary does not support the requested installment.',
      estimatedMonthlyPayment: 17160,
    },
  ],
  transferOrders: [],
  stockOrders: [],
  holdings: [
    { symbol: 'AAPL', name: 'Apple', quantity: 25, averagePrice: 181.2, marketValue: 4906, profitLoss: 375 },
    { symbol: 'MSFT', name: 'Microsoft', quantity: 10, averagePrice: 395.4, marketValue: 4151, profitLoss: 197 },
  ],
  marketStocks: marketStocksSeed,
  transactions: mockTransactions.map((transaction) => ({
    id: transaction.id,
    kind: transaction.type,
    title: transaction.description,
    subtitle: transaction.date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
    amount: transaction.amount,
    date: transaction.date.toISOString(),
    icon: transaction.icon,
    color: transaction.color,
    status: 'completed',
    reference: `REF-${transaction.id}`,
  })),
  notifications: [
    {
      id: 'note-1',
      title: 'Allocation pending review',
      message: 'Your tourism request is now in the verification queue.',
      tone: 'info',
      createdAt: '2026-03-20T11:32:00.000Z',
      read: false,
    },
    {
      id: 'note-2',
      title: 'Credit document checked',
      message: 'Your latest loan application is waiting on a final decision.',
      tone: 'warning',
      createdAt: '2026-03-18T09:10:00.000Z',
      read: false,
    },
  ],
};

const BankingContext = createContext<BankingContextValue | undefined>(undefined);

function createReference(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function getStockOrderError(state: BankingState, input: StockOrderSubmissionInput) {
  const account = state.accounts.find((item) => item.id === input.accountId);
  if (!account) return 'Selected settlement account was not found.';

  const stock = state.marketStocks.find((item) => item.symbol === input.symbol);
  if (!stock) return 'Selected stock was not found.';

  if (input.quantity <= 0) return 'Quantity must be greater than zero.';

  const total = Number((input.quantity * input.price).toFixed(2));
  const currentHolding = state.holdings.find((holding) => holding.symbol === input.symbol);

  if (input.side === 'buy' && total > account.balance) return 'Insufficient funds for this buy order.';

  if (input.side === 'sell' && (!currentHolding || currentHolding.quantity < input.quantity)) {
    return 'You do not hold enough shares to sell this quantity.';
  }

  return undefined;
}

function calculateStockHolding(state: BankingState, input: StockOrderSubmissionInput, stock: MarketStock) {
  const currentHolding = state.holdings.find((holding) => holding.symbol === input.symbol);
  const isBuyOrder = input.side === 'buy';
  const nextQuantity = (currentHolding?.quantity ?? 0) + (isBuyOrder ? input.quantity : -input.quantity);
  const safeQuantity = Math.max(nextQuantity, 0);

  let averagePrice = input.price;
  if (currentHolding && isBuyOrder) {
    averagePrice = Number(
      ((currentHolding.averagePrice * currentHolding.quantity + input.price * input.quantity) / safeQuantity).toFixed(2),
    );
  } else if (currentHolding && !isBuyOrder) {
    averagePrice = currentHolding.averagePrice;
  }

  return {
    quantity: safeQuantity,
    averagePrice,
    marketValue: Number((safeQuantity * stock.price).toFixed(2)),
    profitLoss: Number(((stock.price - averagePrice) * safeQuantity).toFixed(2)),
  };
}

function reducer(state: BankingState, action: BankingAction): BankingState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;
    case 'ADD_ALLOCATION_REQUEST':
      return { ...state, allocationRequests: [action.payload, ...state.allocationRequests] };
    case 'ADD_CREDIT_REQUEST':
      return { ...state, creditRequests: [action.payload, ...state.creditRequests] };
    case 'ADD_TRANSFER_ORDER':
      return { ...state, transferOrders: [action.payload, ...state.transferOrders] };
    case 'ADD_STOCK_ORDER':
      return { ...state, stockOrders: [action.payload, ...state.stockOrders] };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };
    case 'UPDATE_ACCOUNT_BALANCE':
      return {
        ...state,
        accounts: state.accounts.map((account) =>
          account.id === action.payload.accountId
            ? { ...account, balance: action.payload.balance }
            : account,
        ),
      };
    case 'UPSERT_HOLDING': {
      const existing = state.holdings.find((holding) => holding.symbol === action.payload.symbol);
      return {
        ...state,
        holdings: existing
          ? state.holdings.map((holding) => (holding.symbol === action.payload.symbol ? action.payload : holding))
          : [action.payload, ...state.holdings],
      };
    }
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.id === action.payload ? { ...notification, read: true } : notification,
        ),
      };
    default:
      return state;
  }
}

export function BankingProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = globalThis.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        dispatch({ type: 'HYDRATE', payload: JSON.parse(stored) as BankingState });
      }
    } catch {
      // Keep the seeded state if storage cannot be parsed.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [hydrated, state]);

  const value = useMemo<BankingContextValue>(() => {
    const submitAllocationRequest = (input: AllocationSubmissionInput) => {
      const request: AllocationRequest = {
        id: createReference('ALLOC'),
        nin: input.nin,
        lastName: input.lastName,
        firstName: input.firstName,
        dateOfBirth: input.dateOfBirth,
        placeOfBirth: input.placeOfBirth,
        passportNumber: input.passportNumber,
        passportExpiryDate: input.passportExpiryDate,
        travelType: input.travelType,
        departureDate: input.departureDate,
        returnDate: input.returnDate,
        destinationCountry: input.destinationCountry,
        currency: input.currency,
        amount: input.amount,
        passportFileName: input.passportFileName,
        ticketFileName: input.ticketFileName,
        status: input.businessDecision,
        submittedAt: new Date().toISOString(),
        decisionReason: input.decisionReason,
        ageAtDeparture: input.ageAtDeparture,
      };

      dispatch({ type: 'ADD_ALLOCATION_REQUEST', payload: request });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: createReference('NOTE'),
          title: 'Tourist allocation request recorded',
          message: `${input.firstName} ${input.lastName} submitted an allocation request for ${input.destinationCountry}.`,
          tone: input.businessDecision === 'rejected' ? 'warning' : 'success',
          createdAt: new Date().toISOString(),
          read: false,
        },
      });

      return request;
    };

    const submitCreditRequest = (input: CreditSubmissionInput) => {
      const request: CreditRequest = {
        id: createReference('CREDIT'),
        creditType: input.creditType,
        requestedAmount: input.requestedAmount,
        propertyValue: input.propertyValue,
        monthlySalary: input.monthlySalary,
        workStatus: input.workStatus,
        durationMonths: input.durationMonths,
        salarySlipFileName: input.salarySlipFileName,
        workCertificateFileName: input.workCertificateFileName,
        idDocumentFileName: input.idDocumentFileName,
        status: input.businessDecision,
        submittedAt: new Date().toISOString(),
        decisionReason: input.decisionReason,
        estimatedMonthlyPayment: input.estimatedMonthlyPayment,
      };

      dispatch({ type: 'ADD_CREDIT_REQUEST', payload: request });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: createReference('NOTE'),
          title: 'Credit request submitted',
          message: `A ${input.creditType} credit request is now under review.`,
          tone: input.businessDecision === 'rejected' ? 'warning' : 'info',
          createdAt: new Date().toISOString(),
          read: false,
        },
      });

      return request;
    };

    const submitTransferOrder = (input: TransferSubmissionInput) => {
      const account = state.accounts.find((item) => item.id === input.debitAccountId);
      if (!account) {
        return { ok: false, error: 'Selected debit account was not found.' };
      }

      if (input.amount <= 0) {
        return { ok: false, error: 'Transfer amount must be greater than zero.' };
      }

      if (input.amount > account.balance) {
        return { ok: false, error: 'Insufficient balance for this transfer.' };
      }

      const updatedBalance = account.balance - input.amount;
      dispatch({ type: 'UPDATE_ACCOUNT_BALANCE', payload: { accountId: account.id, balance: updatedBalance } });

      const order: TransferOrder = {
        id: createReference('TRF'),
        debitAccountId: account.id,
        beneficiaryLastName: input.beneficiaryLastName,
        beneficiaryFirstName: input.beneficiaryFirstName,
        address: input.address,
        rib: input.rib,
        amount: input.amount,
        reason: input.reason,
        signature: input.signature,
        status: 'completed',
        submittedAt: new Date().toISOString(),
        reference: createReference('REF'),
      };

      dispatch({ type: 'ADD_TRANSFER_ORDER', payload: order });
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: order.id,
          kind: 'transfer',
          title: `Transfer to ${input.beneficiaryFirstName} ${input.beneficiaryLastName}`,
          subtitle: input.rib,
          amount: -input.amount,
          date: order.submittedAt,
          icon: '↗',
          color: '#003DA5',
          status: 'completed',
          reference: order.reference,
          accountId: account.id,
        },
      });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: createReference('NOTE'),
          title: 'Transfer completed',
          message: `Transfer of ${input.amount.toLocaleString()} DZD to ${input.beneficiaryFirstName} ${input.beneficiaryLastName} was completed.`,
          tone: 'success',
          createdAt: new Date().toISOString(),
          read: false,
        },
      });

      return { ok: true, order };
    };

    const submitStockOrder = (input: StockOrderSubmissionInput) => {
      const account = state.accounts.find((item) => item.id === input.accountId);
      const stock = state.marketStocks.find((item) => item.symbol === input.symbol);
      const validationError = getStockOrderError(state, input);
      if (validationError || !account || !stock) return { ok: false, error: validationError || 'Selected stock was not found.' };

      const total = Number((input.quantity * input.price).toFixed(2));
      const isBuyOrder = input.side === 'buy';
      const holding = calculateStockHolding(state, input, stock);
      const nextBalance = account.balance + (isBuyOrder ? -total : total);
      dispatch({ type: 'UPDATE_ACCOUNT_BALANCE', payload: { accountId: account.id, balance: nextBalance } });
      dispatch({ type: 'UPSERT_HOLDING', payload: holding.quantity <= 0 ? { symbol: stock.symbol, name: stock.name, quantity: 0, averagePrice: holding.averagePrice, marketValue: 0, profitLoss: 0 } : { symbol: stock.symbol, name: stock.name, ...holding } });

      const order: StockOrder = {
        id: createReference('STK'),
        accountId: account.id,
        symbol: stock.symbol,
        name: stock.name,
        side: input.side,
        quantity: input.quantity,
        price: input.price,
        total,
        status: 'completed',
        submittedAt: new Date().toISOString(),
        reference: createReference('REF'),
      };

      dispatch({ type: 'ADD_STOCK_ORDER', payload: order });
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: order.id,
          kind: input.side === 'buy' ? 'stock-buy' : 'stock-sell',
          title: `${input.side === 'buy' ? 'Bought' : 'Sold'} ${input.quantity} ${stock.symbol}`,
          subtitle: `${stock.name} • ${order.reference}`,
          amount: input.side === 'buy' ? -total : total,
          date: order.submittedAt,
          icon: input.side === 'buy' ? '▲' : '▼',
          color: input.side === 'buy' ? '#003DA5' : '#FF9F43',
          status: 'completed',
          reference: order.reference,
          accountId: account.id,
        },
      });
      dispatch({
        type: 'ADD_NOTIFICATION',
        payload: {
          id: createReference('NOTE'),
          title: `Stock order ${input.side === 'buy' ? 'executed' : 'completed'}`,
          message: `${input.side === 'buy' ? 'Bought' : 'Sold'} ${input.quantity} shares of ${stock.symbol}.`,
          tone: 'success',
          createdAt: new Date().toISOString(),
          read: false,
        },
      });

      return { ok: true, order };
    };

    const markNotificationRead = (id: string) => {
      dispatch({ type: 'MARK_NOTIFICATION_READ', payload: id });
    };

    return {
      state,
      hydrated,
      submitAllocationRequest,
      submitCreditRequest,
      submitTransferOrder,
      submitStockOrder,
      markNotificationRead,
    };
  }, [hydrated, state]);

  return <BankingContext.Provider value={value}>{children}</BankingContext.Provider>;
}

export function useBanking() {
  const context = useContext(BankingContext);
  if (!context) {
    throw new Error('useBanking must be used within a BankingProvider');
  }

  return context;
}
