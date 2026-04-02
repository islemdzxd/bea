# BEA Banking Frontend

A modern, production-grade banking application built with Next.js, React, and TypeScript. Features include tourist allocations, credit requests, bank transfers, stock trading, and a comprehensive dashboard with persistent state management.

## Prerequisites

- **Node.js** 18+ (https://nodejs.org/)
- **npm** 9+ or **pnpm** 8+ (pnpm recommended)

## Installation

### 1. Navigate to the frontend directory
```bash
cd bea-front
```

### 2. Install dependencies
```bash
npm install
# or
pnpm install
```

## Running the Development Server

### Start the development server
```bash
npm run dev
# or
pnpm dev
```

The application will be available at **http://localhost:3000**

### Build for production
```bash
npm run build
npm run start
# or
pnpm build
pnpm start
```

## Project Structure

```
bea-front/
├── app/                          # Next.js app directory (routes)
│   ├── layout.tsx               # Root layout with providers
│   ├── dashboard/               # Main dashboard routes
│   │   ├── page.tsx            # Dashboard hub
│   │   ├── tourism/            # Tourist allocation
│   │   ├── loans/              # Credit requests
│   │   ├── transactions/        # Bank transfers
│   │   ├── investments/         # Stock trading
│   │   └── settings/            # Settings
│   └── signup/                  # Signup page
├── features/                     # Feature modules
│   ├── banking/                 # Shared banking state & types
│   │   ├── banking-provider.tsx # Global state provider
│   │   └── types.ts             # Banking types
│   ├── allocation/              # Tourist allocation workflow
│   ├── credit/                  # Credit request workflow
│   ├── transfer/                # Bank transfer workflow
│   └── stocks/                  # Stock trading workflow
├── components/                   # Reusable components
│   ├── ui/                      # Radix UI primitives
│   └── dashboard/               # Dashboard widgets
├── lib/                          # Utilities
│   ├── format.ts                # Number/date formatting
│   ├── mock-data.ts             # Seed data
│   └── utils.ts                 # Helper functions
└── hooks/                        # Custom React hooks
```

## Features

### 🏦 Banking Dashboard
- Live account balance and sync status
- Quick action cards for all services
- Active requests tracker
- Notification center
- Recent transactions history

### 🌍 Tourist Allocation (`/dashboard/tourism`)
- NIN, identity, and passport validation
- Automatic age-based allocation limits
- Travel document uploads
- Yearly usage enforcement
- Request history with status tracking

### 💳 Credit Requests (`/dashboard/loans`)
- Multiple credit types (immobilier, auto, consommation)
- Eligibility checks (salary, work status, duration)
- Document uploads (pay slips, certificates, ID)
- Monthly payment estimation
- Request approval/rejection with reasoning

### 💸 Bank Transfers (`/dashboard/transactions`)
- Multi-account debit selection
- Beneficiary validation (name, address, RIB)
- RIB format validation (20 digits)
- Transfer signature
- Confirmation modal before execution
- Balance and historical tracking

### 📈 Stock Trading (`/dashboard/investments`)
- Live market watch with simulated quotes
- Buy/sell order execution
- Portfolio tracking with P&L calculation
- Weighted average cost basis
- Order history with references

### 💾 State Management
All banking data is persisted locally with `localStorage`, allowing:
- Account data across sessions
- Request history retention
- Transaction ledger
- Portfolio holdings
- Notifications

## Styling

Built with **Tailwind CSS v4** using OKLch color space for modern, accessible design. Dark mode support included.

## Environment Variables

Create a `.env.local` file if needed (currently running on mock data):
```bash
# Optional: Add API endpoints when backend is ready
# NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Troubleshooting

### Port 3000 already in use
```bash
# Run on a different port
npm run dev -- -p 3001
```

### Clear cache and reinstall
```bash
rm -rf node_modules pnpm-lock.yaml .next
pnpm install
pnpm dev
```

### Build errors
Ensure you're on Node.js 18+:
```bash
node --version
```

## Development Notes

- Login is bypassed; dashboard loads directly
- All operations are simulated with localStorage persistence
- Each workflow module is self-contained and can be tested independently
- UI components use Radix primitives for accessibility

## Next Steps

- Connect to the BEA backend API when ready
- Implement real authentication (JWT/OAuth)
- Add KYC document verification server-side
- Integrate payment/transfer gateways
- Set up analytics and monitoring

---

For full banking workflow documentation, see the individual feature modules in `features/`.
