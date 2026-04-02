export interface Card {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  balance: number;
  type: 'visa' | 'mastercard';
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  date: Date;
  icon: string;
  color: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth: Date;
  avatar: string;
}

export interface TourisumAllocation {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  destination: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface CreditApplication {
  id: string;
  userId: string;
  amount: number;
  duration: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

export const mockUser: User = {
  id: '1',
  email: 'eddy.cusuma@example.com',
  firstName: 'Eddy',
  lastName: 'Cusuma',
  phone: '+213 555 123456',
  dateOfBirth: new Date('1990-01-15'),
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eddy',
};

export const mockCards: Card[] = [
  {
    id: '1',
    cardNumber: '3778 **** **** 1234',
    cardHolder: 'Eddy Cusuma',
    expiryDate: '12/22',
    balance: 5756,
    type: 'visa',
  },
  {
    id: '2',
    cardNumber: '3778 **** **** 1234',
    cardHolder: 'Eddy Cusuma',
    expiryDate: '12/22',
    balance: 5756,
    type: 'mastercard',
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'deposit',
    amount: 850,
    description: 'Deposit from my Card',
    date: new Date('2021-01-28'),
    icon: '💳',
    color: '#FFB800',
  },
  {
    id: '2',
    type: 'deposit',
    amount: 2500,
    description: 'Deposit Paypal',
    date: new Date('2021-01-25'),
    icon: '🔵',
    color: '#1F9CFF',
  },
  {
    id: '3',
    type: 'transfer',
    amount: 5400,
    description: 'Jemi Wilson',
    date: new Date('2021-01-21'),
    icon: '👤',
    color: '#1FB3D5',
  },
];

export const mockWeeklyActivity = [
  { name: 'Sat', deposit: 320, withdrawal: 180 },
  { name: 'Sun', deposit: 410, withdrawal: 220 },
  { name: 'Mon', deposit: 320, withdrawal: 140 },
  { name: 'Tue', deposit: 490, withdrawal: 220 },
  { name: 'Wed', deposit: 330, withdrawal: 320 },
  { name: 'Thu', deposit: 380, withdrawal: 200 },
  { name: 'Fri', deposit: 400, withdrawal: 280 },
];

export const mockExpenseStatistics = [
  { name: 'Entertainment', value: 30, fill: '#003DA5' },
  { name: 'Bill Expense', value: 15, fill: '#FF9F43' },
  { name: 'Investment', value: 20, fill: '#FF6B9D' },
  { name: 'Others', value: 35, fill: '#1A2456' },
];

export const mockBalanceHistory = [
  { month: 'Jul', balance: 200 },
  { month: 'Aug', balance: 400 },
  { month: 'Sep', balance: 700 },
  { month: 'Oct', balance: 550 },
  { month: 'Nov', balance: 850 },
  { month: 'Dec', balance: 600 },
  { month: 'Jan', balance: 900 },
];

export const mockQuickTransferContacts = [
  {
    id: '1',
    name: 'Livia Bator',
    title: 'CEO',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Livia',
  },
  {
    id: '2',
    name: 'Randy Press',
    title: 'Director',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Randy',
  },
  {
    id: '3',
    name: 'Workman',
    title: 'Designer',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Workman',
  },
];

export interface Investment {
  id: string;
  name: string;
  category: string;
  amount: number;
  returnValue: number;
  returnPercentage: number;
  logo: string;
}

export interface Stock {
  id: string;
  name: string;
  price: number;
  returnPercentage: number;
}

export interface CreditCard {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  balance: number;
  type: 'primary' | 'secondary';
  bank: string;
}

export const mockInvestments: Investment[] = [
  {
    id: '1',
    name: 'Apple Store',
    category: 'E-commerce, Marketplace',
    amount: 54000,
    returnValue: 8640,
    returnPercentage: 16,
    logo: '🍎',
  },
  {
    id: '2',
    name: 'Samsung Mobile',
    category: 'E-commerce, Marketplace',
    amount: 25300,
    returnValue: -1012,
    returnPercentage: -4,
    logo: '🔵',
  },
  {
    id: '3',
    name: 'Tesla Motors',
    category: 'Electric Vehicles',
    amount: 8200,
    returnValue: 2050,
    returnPercentage: 25,
    logo: '⚡',
  },
];

export const mockTrendingStocks: Stock[] = [
  {
    id: '1',
    name: 'Trivago',
    price: 520,
    returnPercentage: 5,
  },
  {
    id: '2',
    name: 'Canon',
    price: 480,
    returnPercentage: 10,
  },
  {
    id: '3',
    name: 'Uber Food',
    price: 350,
    returnPercentage: -3,
  },
  {
    id: '4',
    name: 'Nokia',
    price: 940,
    returnPercentage: 2,
  },
  {
    id: '5',
    name: 'Tiktok',
    price: 670,
    returnPercentage: -12,
  },
];

export const mockYearlyInvestment = [
  { year: '2016', amount: 5000 },
  { year: '2017', amount: 20000 },
  { year: '2018', amount: 15000 },
  { year: '2019', amount: 30000 },
  { year: '2020', amount: 20000 },
  { year: '2021', amount: 25000 },
];

export const mockMonthlyRevenue = [
  { month: '2016', revenue: 10000 },
  { month: '2017', revenue: 15000 },
  { month: '2018', revenue: 12000 },
  { month: '2019', revenue: 18000 },
  { month: '2020', revenue: 16000 },
  { month: '2021', revenue: 20000 },
];

export const mockCreditCards: CreditCard[] = [
  {
    id: '1',
    cardNumber: '3778 **** **** 5600',
    cardHolder: 'William',
    expiryDate: '12/22',
    balance: 5756,
    type: 'primary',
    bank: 'DBL Bank',
  },
  {
    id: '2',
    cardNumber: '3778 **** **** 4300',
    cardHolder: 'Michel',
    expiryDate: '12/22',
    balance: 5756,
    type: 'secondary',
    bank: 'BRC Bank',
  },
  {
    id: '3',
    cardNumber: '3778 **** **** 7560',
    cardHolder: 'Edward',
    expiryDate: '12/22',
    balance: 5756,
    type: 'secondary',
    bank: 'ABM Bank',
  },
];

export const mockCardExpenseStats = [
  { name: 'DBL Bank', value: 35, fill: '#003DA5' },
  { name: 'BRC Bank', value: 25, fill: '#FF6B9D' },
  { name: 'ABM Bank', value: 20, fill: '#00D4FF' },
  { name: 'MCP Bank', value: 20, fill: '#FF9F43' },
];

export const mockDetailedTransactions = [
  {
    id: '1',
    description: 'Spotify Subscription',
    transactionId: '#12548796',
    type: 'Shopping',
    card: '1234 ****',
    date: '28 Jan, 12:30 AM',
    amount: -2500,
    receipt: 'Download',
  },
  {
    id: '2',
    description: 'Freepik Sales',
    transactionId: '#12548796',
    type: 'Transfer',
    card: '1234 ****',
    date: '25 Jan, 10:40 PM',
    amount: 750,
    receipt: 'Download',
  },
  {
    id: '3',
    description: 'Mobile Service',
    transactionId: '#12548796',
    type: 'Service',
    card: '1234 ****',
    date: '20 Jan, 10:40 PM',
    amount: -150,
    receipt: 'Download',
  },
  {
    id: '4',
    description: 'Wilson',
    transactionId: '#12548796',
    type: 'Transfer',
    card: '1234 ****',
    date: '15 Jan, 03:29 PM',
    amount: -1050,
    receipt: 'Download',
  },
  {
    id: '5',
    description: 'Emilly',
    transactionId: '#12548796',
    type: 'Transfer',
    card: '1234 ****',
    date: '14 Jan, 10:40 PM',
    amount: 840,
    receipt: 'Download',
  },
];
