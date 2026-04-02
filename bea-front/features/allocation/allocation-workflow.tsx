'use client';

import React, { useMemo, useState } from 'react';
import { addDays, differenceInCalendarDays, differenceInYears, isAfter, isBefore, parseISO } from 'date-fns';
import { AlertCircle, CheckCircle2, Clock3, ShieldAlert, UploadCloud } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useBanking } from '@/features/banking/banking-provider';

type FieldErrors = Partial<Record<string, string>>;

interface AllocationFormState {
  nin: string;
  lastName: string;
  firstName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  passportNumber: string;
  passportExpiryDate: string;
  travelType: 'airline' | 'maritime';
  departureDate: string;
  returnDate: string;
  destinationCountry: string;
  currency: 'EUR' | 'USD';
  amount: string;
  travelReason: string;
}

function normalizeDigits(value: string) {
  return value.replace(/\D/g, '');
}

function calculateAgeAtDeparture(dateOfBirth: string, departureDate: string) {
  if (!dateOfBirth || !departureDate) {
    return 0;
  }

  return differenceInYears(parseISO(departureDate), parseISO(dateOfBirth));
}

function requiredAllocationLimit(age: number) {
  return age >= 19 ? 750 : 300;
}

function statusTone(status: 'pending' | 'approved' | 'rejected') {
  switch (status) {
    case 'approved':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'rejected':
      return 'bg-red-50 text-red-700 border-red-200';
    default:
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  }
}

export function AllocationWorkflow() {
  const { state, submitAllocationRequest } = useBanking();
  const [form, setForm] = useState<AllocationFormState>({
    nin: '',
    lastName: '',
    firstName: '',
    dateOfBirth: '',
    placeOfBirth: '',
    passportNumber: '',
    passportExpiryDate: '',
    travelType: 'airline',
    departureDate: '',
    returnDate: '',
    destinationCountry: '',
    currency: 'EUR',
    amount: '',
    travelReason: '',
  });
  const [passportFileName, setPassportFileName] = useState('');
  const [ticketFileName, setTicketFileName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const ageAtDeparture = calculateAgeAtDeparture(form.dateOfBirth, form.departureDate);
  const allocationLimit = ageAtDeparture ? requiredAllocationLimit(ageAtDeparture) : 0;
  const currentYear = new Date().getFullYear();
  const yearlyUsage = state.allocationRequests.filter(
    (request) => request.nin === normalizeDigits(form.nin) && new Date(request.submittedAt).getFullYear() === currentYear,
  );

  const computedBusinessRules = useMemo(() => {
    const issues: string[] = [];

    if (form.dateOfBirth && form.departureDate) {
      if (calculateAgeAtDeparture(form.dateOfBirth, form.departureDate) < 12) {
        issues.push('Applicants must be at least 12 years old on the departure date.');
      }
    }

    if (form.departureDate) {
      const departure = parseISO(form.departureDate);
      const minDate = addDays(new Date(), 5);
      if (isBefore(departure, minDate)) {
        issues.push('Departure date must be at least 5 calendar days from today.');
      }
    }

    if (form.departureDate && form.returnDate) {
      if (!isAfter(parseISO(form.returnDate), parseISO(form.departureDate))) {
        issues.push('Return date must be after departure date.');
      }
    }

    if (form.passportExpiryDate && form.returnDate) {
      if (isBefore(parseISO(form.passportExpiryDate), parseISO(form.returnDate))) {
        issues.push('Passport must remain valid throughout the trip.');
      }
    }

    if (allocationLimit > 0 && Number(form.amount || 0) > allocationLimit) {
      issues.push(`Allocation amount cannot exceed ${allocationLimit} ${form.currency}.`);
    }

    if (Number(form.amount || 0) % 50 !== 0) {
      issues.push('Allocation amount must be a multiple of 50.');
    }

    if (yearlyUsage.length > 0) {
      issues.push('This NIN has already used the tourist allocation for the current year.');
    }

    if (!passportFileName) {
      issues.push('Passport main page is required.');
    }

    if (!ticketFileName) {
      issues.push('Travel ticket is required.');
    }

    return issues;
  }, [allocationLimit, currentYear, form.amount, form.currency, form.dateOfBirth, form.departureDate, form.passportExpiryDate, form.returnDate, passportFileName, ticketFileName, yearlyUsage.length]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitMessage('');
  };

  const validateFields = () => {
    const errors: FieldErrors = {};

    if (normalizeDigits(form.nin).length !== 18) {
      errors.nin = 'NIN must contain 18 digits.';
    }
    if (!form.lastName.trim()) errors.lastName = 'Last name is required.';
    if (!form.firstName.trim()) errors.firstName = 'First name is required.';
    if (!form.dateOfBirth) errors.dateOfBirth = 'Date of birth is required.';
    if (!form.placeOfBirth.trim()) errors.placeOfBirth = 'Place of birth is required.';
    if (!form.passportNumber.trim()) errors.passportNumber = 'Passport number is required.';
    if (!form.passportExpiryDate) errors.passportExpiryDate = 'Passport expiration date is required.';
    if (!form.departureDate) errors.departureDate = 'Departure date is required.';
    if (!form.returnDate) errors.returnDate = 'Return date is required.';
    if (!form.destinationCountry.trim()) errors.destinationCountry = 'Destination country is required.';
    if (!form.amount || Number(form.amount) <= 0) errors.amount = 'Enter a valid allocation amount.';

    return errors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateFields();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const businessDecision = computedBusinessRules.length > 0 ? 'rejected' : 'pending';
    setSubmitting(true);

    try {
      const request = submitAllocationRequest({
        nin: normalizeDigits(form.nin),
        lastName: form.lastName.trim(),
        firstName: form.firstName.trim(),
        dateOfBirth: form.dateOfBirth,
        placeOfBirth: form.placeOfBirth.trim(),
        passportNumber: form.passportNumber.trim().toUpperCase(),
        passportExpiryDate: form.passportExpiryDate,
        travelType: form.travelType,
        departureDate: form.departureDate,
        returnDate: form.returnDate,
        destinationCountry: form.destinationCountry.trim(),
        currency: form.currency,
        amount: Number(form.amount),
        passportFileName,
        ticketFileName,
        ageAtDeparture,
        businessDecision,
        decisionReason: computedBusinessRules.join(' '),
      });

      setSubmitMessage(
        request.status === 'rejected'
          ? 'Request recorded as rejected after eligibility checks. Review the reasons below.'
          : 'Request submitted successfully and is waiting for review.',
      );
      setForm({
        nin: '',
        lastName: '',
        firstName: '',
        dateOfBirth: '',
        placeOfBirth: '',
        passportNumber: '',
        passportExpiryDate: '',
        travelType: 'airline',
        departureDate: '',
        returnDate: '',
        destinationCountry: '',
        currency: 'EUR',
        amount: '',
        travelReason: '',
      });
      setPassportFileName('');
      setTicketFileName('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-semibold tracking-tight">Tourist Allocation</CardTitle>
            <CardDescription>Submit and monitor a full travel allocation request with business rules and file uploads.</CardDescription>
          </CardHeader>

          <CardContent className="px-0 pb-0">
            {submitMessage && (
              <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
                {submitMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">NIN</label>
                  <Input name="nin" value={form.nin} onChange={handleChange} placeholder="18 digits" className={fieldErrors.nin ? 'border-red-500' : ''} />
                  {fieldErrors.nin && <p className="mt-1 text-xs text-red-500">{fieldErrors.nin}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Passport number</label>
                  <Input name="passportNumber" value={form.passportNumber} onChange={handleChange} placeholder="P12345678" className={fieldErrors.passportNumber ? 'border-red-500' : ''} />
                  {fieldErrors.passportNumber && <p className="mt-1 text-xs text-red-500">{fieldErrors.passportNumber}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Last name</label>
                  <Input name="lastName" value={form.lastName} onChange={handleChange} className={fieldErrors.lastName ? 'border-red-500' : ''} />
                  {fieldErrors.lastName && <p className="mt-1 text-xs text-red-500">{fieldErrors.lastName}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">First name</label>
                  <Input name="firstName" value={form.firstName} onChange={handleChange} className={fieldErrors.firstName ? 'border-red-500' : ''} />
                  {fieldErrors.firstName && <p className="mt-1 text-xs text-red-500">{fieldErrors.firstName}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Date of birth</label>
                  <Input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} className={fieldErrors.dateOfBirth ? 'border-red-500' : ''} />
                  {fieldErrors.dateOfBirth && <p className="mt-1 text-xs text-red-500">{fieldErrors.dateOfBirth}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Place of birth</label>
                  <Input name="placeOfBirth" value={form.placeOfBirth} onChange={handleChange} className={fieldErrors.placeOfBirth ? 'border-red-500' : ''} />
                  {fieldErrors.placeOfBirth && <p className="mt-1 text-xs text-red-500">{fieldErrors.placeOfBirth}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Passport expiry date</label>
                  <Input type="date" name="passportExpiryDate" value={form.passportExpiryDate} onChange={handleChange} className={fieldErrors.passportExpiryDate ? 'border-red-500' : ''} />
                  {fieldErrors.passportExpiryDate && <p className="mt-1 text-xs text-red-500">{fieldErrors.passportExpiryDate}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Travel type</label>
                  <Select value={form.travelType} onValueChange={(value: 'airline' | 'maritime') => setForm((prev) => ({ ...prev, travelType: value }))}>
                    <SelectTrigger className="w-full rounded-xl bg-background">
                      <SelectValue placeholder="Choose travel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airline">Airline</SelectItem>
                      <SelectItem value="maritime">Maritime</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Departure date</label>
                  <Input type="date" name="departureDate" value={form.departureDate} onChange={handleChange} className={fieldErrors.departureDate ? 'border-red-500' : ''} />
                  {fieldErrors.departureDate && <p className="mt-1 text-xs text-red-500">{fieldErrors.departureDate}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Return date</label>
                  <Input type="date" name="returnDate" value={form.returnDate} onChange={handleChange} className={fieldErrors.returnDate ? 'border-red-500' : ''} />
                  {fieldErrors.returnDate && <p className="mt-1 text-xs text-red-500">{fieldErrors.returnDate}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Destination country</label>
                  <Input name="destinationCountry" value={form.destinationCountry} onChange={handleChange} className={fieldErrors.destinationCountry ? 'border-red-500' : ''} />
                  {fieldErrors.destinationCountry && <p className="mt-1 text-xs text-red-500">{fieldErrors.destinationCountry}</p>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Passport main page</label>
                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                    <span>{passportFileName || 'Upload passport page'}</span>
                    <span className="inline-flex items-center gap-2 text-primary"><UploadCloud className="h-4 w-4" />Browse</span>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setPassportFileName(event.target.files?.[0]?.name || '')} />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Travel ticket</label>
                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                    <span>{ticketFileName || 'Upload flight or maritime ticket'}</span>
                    <span className="inline-flex items-center gap-2 text-primary"><UploadCloud className="h-4 w-4" />Browse</span>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setTicketFileName(event.target.files?.[0]?.name || '')} />
                  </label>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Allocation amount</label>
                  <div className="flex gap-3">
                    <Input name="amount" type="number" value={form.amount} onChange={handleChange} className={fieldErrors.amount ? 'border-red-500 flex-1' : 'flex-1'} placeholder="750" />
                    <Select value={form.currency} onValueChange={(value: 'EUR' | 'USD') => setForm((prev) => ({ ...prev, currency: value }))}>
                      <SelectTrigger className="w-24 rounded-xl bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {fieldErrors.amount && <p className="mt-1 text-xs text-red-500">{fieldErrors.amount}</p>}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Reason for travel</label>
                <Textarea name="travelReason" value={form.travelReason} onChange={handleChange} placeholder="Optional but useful for bank review" className="rounded-2xl" />
              </div>

              <div className="rounded-2xl border border-border/70 bg-white/70 p-4 text-sm text-foreground">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary">Age at departure: {ageAtDeparture || '—'}</Badge>
                  <Badge variant="secondary">Allowed ceiling: {allocationLimit || '—'} {form.currency}</Badge>
                  <Badge variant="secondary">Yearly usage: {yearlyUsage.length}</Badge>
                </div>
                {computedBusinessRules.length > 0 ? (
                  <div className="mt-4 space-y-2 text-red-600">
                    {computedBusinessRules.map((issue) => (
                      <div key={issue} className="flex items-start gap-2 text-sm"><ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />{issue}</div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4 flex items-start gap-2 text-emerald-700">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                    The request is eligible for submission and will be reviewed by the bank.
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90" disabled={submitting}>
                {submitting ? 'Submitting request...' : 'Submit allocation request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-semibold tracking-tight">Request status</CardTitle>
              <CardDescription>Track submitted requests and their latest decision.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="space-y-3">
                {state.allocationRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="rounded-2xl border border-border/70 bg-white/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{request.destinationCountry}</p>
                        <p className="text-xs text-muted-foreground">{request.firstName} {request.lastName} • {request.nin}</p>
                      </div>
                      <Badge className={statusTone(request.status)}>{request.status}</Badge>
                    </div>
                    {request.decisionReason && <p className="mt-2 text-sm text-muted-foreground">{request.decisionReason}</p>}
                    <p className="mt-2 text-xs text-muted-foreground">Submitted {new Date(request.submittedAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-semibold tracking-tight">Business rules</CardTitle>
              <CardDescription>Important checks applied before the request is accepted by the workflow.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 text-sm text-muted-foreground space-y-3">
              <p>• Departure must be at least 5 calendar days away.</p>
              <p>• Return date must be after departure date.</p>
              <p>• Passport must stay valid for the full travel period.</p>
              <p>• Users must be at least 12 years old at departure.</p>
              <p>• Allocation is capped at 750 EUR for adults and 300 EUR for minors, with multiples of 50.</p>
              <p>• The same NIN can only receive one allocation per calendar year.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
