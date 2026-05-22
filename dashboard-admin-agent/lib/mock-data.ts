import type { CreditRequest, TourismAllocationRequest } from './types';

function audit(
  at: string,
  by: string,
  action: string,
  detail?: string
) {
  return { id: `h-${at}`, at, by, action, detail };
}

const soon = new Date();
soon.setDate(soon.getDate() + 5);

const urgent = new Date();
urgent.setDate(urgent.getDate() + 2);

const past = new Date();
past.setDate(past.getDate() - 1);

export const INITIAL_ALLOCATIONS: TourismAllocationRequest[] = [
  {
    id: 'alloc-1',
    codeDeclaration: 'DEC202504001',
    clientName: 'Ahmed Benmohamed',
    clientEmail: 'ahmed.benmohamed@example.com',
    clientPhone: '+213 555 100 201',
    nin: '00001000003997',
    passportNumber: 'AB1234567',
    destination: 'France — Paris',
    departureDate: soon.toISOString().slice(0, 10),
    returnDate: new Date(soon.getTime() + 14 * 86400000).toISOString().slice(0, 10),
    amountEur: 5000,
    amountDzd: 1350000,
    currency: 'EUR',
    status: 'en_attente',
    documents: [
      { id: 'd1', label: 'Passeport (page principale)', fileName: 'passport-main.pdf' },
      { id: 'd2', label: 'Passeport (visa / néant)', fileName: 'passport-visa.pdf' },
      { id: 'd3', label: 'Billet / réservation', fileName: 'ticket.pdf' },
    ],
    history: [
      audit('2025-04-20T09:00:00Z', 'Système', 'Demande reçue', 'Dépôt client en ligne'),
    ],
    createdAt: '2025-04-20T09:00:00Z',
  },
  {
    id: 'alloc-2',
    codeDeclaration: 'DEC202504002',
    clientName: 'Fatima Bennani',
    clientEmail: 'fatima.bennani@example.com',
    clientPhone: '+213 555 100 202',
    nin: '00001000004001',
    passportNumber: 'CD9876543',
    destination: 'Espagne — Madrid',
    departureDate: urgent.toISOString().slice(0, 10),
    returnDate: new Date(urgent.getTime() + 10 * 86400000).toISOString().slice(0, 10),
    amountEur: 3000,
    amountDzd: 810000,
    currency: 'EUR',
    status: 'approuve_attente_virement',
    observation: 'Documents conformes. Procéder au virement dans les délais.',
    verifiedBy: 'Sarah Benali',
    documents: [
      { id: 'd1', label: 'Passeport (page principale)', fileName: 'passport-main.pdf' },
      { id: 'd2', label: 'Billet / réservation', fileName: 'booking.pdf' },
    ],
    history: [
      audit('2025-04-18T10:00:00Z', 'Système', 'Demande reçue'),
      audit(
        '2025-04-19T11:30:00Z',
        'Sarah Benali',
        'Approbation 1er vérificateur',
        'Client instruit de procéder au virement'
      ),
    ],
    createdAt: '2025-04-18T10:00:00Z',
  },
  {
    id: 'alloc-3',
    codeDeclaration: 'DEC202503015',
    clientName: 'Mohammed Sadane',
    clientEmail: 'mohammed.sadane@example.com',
    clientPhone: '+213 555 100 203',
    nin: '00001000004002',
    passportNumber: 'EF1122334',
    destination: 'Turquie — Istanbul',
    departureDate: '2025-05-01',
    returnDate: '2025-05-15',
    amountEur: 2500,
    amountDzd: 675000,
    currency: 'EUR',
    status: 'virement_recu',
    transferReference: 'VIR-20250412-8891',
    verifiedBy: 'Michel Laurent',
    documents: [
      { id: 'd1', label: 'Passeport (page principale)', fileName: 'passport.pdf' },
      { id: 'd2', label: 'Billet / réservation', fileName: 'flight.pdf' },
    ],
    history: [
      audit('2025-04-10T08:00:00Z', 'Système', 'Demande reçue'),
      audit('2025-04-11T09:00:00Z', 'Michel Laurent', 'Approbation 1er vérificateur'),
      audit('2025-04-12T14:20:00Z', 'Michel Laurent', 'Virement reçu', 'Réf. VIR-20250412-8891'),
    ],
    createdAt: '2025-04-10T08:00:00Z',
  },
  {
    id: 'alloc-4',
    codeDeclaration: 'DEC202502008',
    clientName: 'Layla Bousameur',
    clientEmail: 'layla.bousameur@example.com',
    clientPhone: '+213 555 100 204',
    nin: '00001000004003',
    passportNumber: 'GH5566778',
    destination: 'Italie — Rome',
    departureDate: past.toISOString().slice(0, 10),
    returnDate: new Date(past.getTime() + 7 * 86400000).toISOString().slice(0, 10),
    amountEur: 4000,
    amountDzd: 1080000,
    currency: 'EUR',
    status: 'en_attente',
    documents: [
      { id: 'd1', label: 'Passeport (page principale)', fileName: 'passport.pdf' },
    ],
    history: [audit('2025-03-01T12:00:00Z', 'Système', 'Demande reçue')],
    createdAt: '2025-03-01T12:00:00Z',
  },
];

export const INITIAL_CREDITS: CreditRequest[] = [
  {
    id: 'credit-1',
    numeroDossier: 'DOS20260522130414',
    clientName: 'Karim Zidane',
    clientEmail: 'karim.zidane@example.com',
    codeClient: '00001000003997',
    typePret: 'Crédit immobilier',
    montantPret: 15000000,
    dureeMois: 240,
    salaireMensuel: 185000,
    status: 'en_attente',
    documents: [
      { id: 'd1', label: 'Pièce d\'identité', fileName: 'id-document.pdf' },
      { id: 'd2', label: 'Bulletin de salaire', fileName: 'salary-slip.pdf' },
      { id: 'd3', label: 'Attestation de travail', fileName: 'work-certificate.pdf' },
    ],
    history: [audit('2025-05-22T13:04:14Z', 'Système', 'Dossier ouvert')],
    createdAt: '2025-05-22T13:04:14Z',
  },
  {
    id: 'credit-2',
    numeroDossier: 'DOS20250418001',
    clientName: 'Nadia Habiba',
    clientEmail: 'nadia.habiba@example.com',
    codeClient: '00001000004010',
    typePret: 'Crédit consommation',
    montantPret: 2500000,
    dureeMois: 60,
    salaireMensuel: 95000,
    status: 'en_attente',
    documents: [
      { id: 'd1', label: 'Pièce d\'identité', fileName: 'cin.pdf' },
      { id: 'd2', label: 'Bulletin de salaire', fileName: 'paie.pdf' },
    ],
    history: [audit('2025-04-18T08:30:00Z', 'Système', 'Dossier ouvert')],
    createdAt: '2025-04-18T08:30:00Z',
  },
  {
    id: 'credit-3',
    numeroDossier: 'DOS20250310042',
    clientName: 'Samir Benali',
    clientEmail: 'samir.benali@example.com',
    codeClient: '00001000004011',
    typePret: 'Crédit auto',
    montantPret: 4500000,
    dureeMois: 48,
    salaireMensuel: 120000,
    status: 'approuve_rdv',
    appointmentAt: '2025-04-25T10:00:00',
    appointmentNote: 'Présenter originaux des pièces et dernier relevé bancaire.',
    processedBy: 'Sarah Benali',
    documents: [
      { id: 'd1', label: 'Pièce d\'identité', fileName: 'cin.pdf' },
      { id: 'd2', label: 'Bulletin de salaire', fileName: 'paie.pdf' },
      { id: 'd3', label: 'Attestation de travail', fileName: 'travail.pdf' },
    ],
    history: [
      audit('2025-04-15T09:00:00Z', 'Système', 'Dossier ouvert'),
      audit(
        '2025-04-16T14:00:00Z',
        'Sarah Benali',
        'Approbation',
        'RDV agence le 25/04/2025 à 10h00'
      ),
    ],
    createdAt: '2025-04-15T09:00:00Z',
  },
  {
    id: 'credit-4',
    numeroDossier: 'DOS20250220011',
    clientName: 'Yasmin Boubekeur',
    clientEmail: 'yasmin.boubekeur@example.com',
    codeClient: '00001000004012',
    typePret: 'Crédit personnel',
    montantPret: 800000,
    dureeMois: 36,
    salaireMensuel: 72000,
    status: 'rejete',
    motifRejet: 'Ratio d\'endettement insuffisant au regard des pièces fournies.',
    processedBy: 'Michel Laurent',
    documents: [
      { id: 'd1', label: 'Pièce d\'identité', fileName: 'cin.pdf' },
      { id: 'd2', label: 'Bulletin de salaire', fileName: 'paie.pdf' },
    ],
    history: [
      audit('2025-02-20T11:00:00Z', 'Système', 'Dossier ouvert'),
      audit('2025-02-22T16:45:00Z', 'Michel Laurent', 'Rejet', 'Ratio d\'endettement insuffisant'),
    ],
    createdAt: '2025-02-20T11:00:00Z',
  },
];
