'use client';

import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock3, UploadCloud } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useBanking } from '@/features/banking/banking-provider';

type FieldErrors = Partial<Record<string, string>>;

interface CreditFormState {
  creditType: 'immobilier' | 'auto' | 'consommation';
  requestedAmount: string;
  propertyValue: string;
  monthlySalary: string;
  workStatus: 'employed' | 'self-employed' | 'retired' | 'contract';
  durationUnit: 'months' | 'years';
  durationValue: string;
}

function formatCurrency(value: number) {
  return value.toLocaleString('en-US');
}

export function CreditWorkflow() {
  const { state, submitCreditRequest } = useBanking();
  const [form, setForm] = useState<CreditFormState>({
    creditType: 'immobilier',
    requestedAmount: '',
    propertyValue: '',
    monthlySalary: '',
    workStatus: 'employed',
    durationUnit: 'months',
    durationValue: '',
  });
  const [salarySlipFileName, setSalarySlipFileName] = useState('');
  const [workCertificateFileName, setWorkCertificateFileName] = useState('');
  const [idDocumentFileName, setIdDocumentFileName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [decisionMessage, setDecisionMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const durationMonths = useMemo(() => {
    const raw = Number(form.durationValue || 0);
    if (!raw) return 0;
    return form.durationUnit === 'years' ? raw * 12 : raw;
  }, [form.durationUnit, form.durationValue]);

  const requestedAmount = Number(form.requestedAmount || 0);
  const monthlySalary = Number(form.monthlySalary || 0);
  const propertyValue = Number(form.propertyValue || 0);
  const estimatedMonthlyPayment = durationMonths > 0 ? Number((requestedAmount / durationMonths).toFixed(2)) : 0;

  const businessIssues = useMemo(() => {
    const issues: string[] = [];

    if (!requestedAmount || requestedAmount < 5000) {
      issues.push('Requested amount must be at least 5,000 DZD.');
    }

    if (!monthlySalary || monthlySalary <= 0) {
      issues.push('Monthly salary is required.');
    }

    if (!durationMonths || durationMonths < 6) {
      issues.push('Duration must be at least 6 months.');
    }

    if (form.creditType === 'immobilier') {
      if (!propertyValue || propertyValue <= 0) {
        issues.push('Property value is required for real-estate credit.');
      } else if (requestedAmount > propertyValue * 0.8) {
        issues.push('Requested amount cannot exceed 80% of the property value.');
      }
    }

    const affordabilityRatio = form.creditType === 'immobilier' ? 2 : 2.5;
    if (estimatedMonthlyPayment > 0 && monthlySalary < estimatedMonthlyPayment * affordabilityRatio) {
      issues.push(`Monthly salary must be at least ${affordabilityRatio}x the estimated installment.`);
    }

    if (!salarySlipFileName || !workCertificateFileName || !idDocumentFileName) {
      issues.push('All supporting documents must be uploaded.');
    }

    return issues;
  }, [durationMonths, estimatedMonthlyPayment, form.creditType, idDocumentFileName, monthlySalary, propertyValue, requestedAmount, salarySlipFileName, workCertificateFileName]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setDecisionMessage('');
  };

  const validateFields = () => {
    const errors: FieldErrors = {};
    if (!form.requestedAmount || Number(form.requestedAmount) <= 0) errors.requestedAmount = 'Enter the requested amount.';
    if (!form.monthlySalary || Number(form.monthlySalary) <= 0) errors.monthlySalary = 'Enter the monthly salary.';
    if (!form.durationValue || Number(form.durationValue) <= 0) errors.durationValue = 'Enter the duration.';
    return errors;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateFields();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    const businessDecision = businessIssues.length > 0 ? 'rejected' : 'pending';
    setSubmitting(true);

    try {
      const request = submitCreditRequest({
        creditType: form.creditType,
        requestedAmount,
        propertyValue: form.creditType === 'immobilier' ? propertyValue : undefined,
        monthlySalary,
        workStatus: form.workStatus,
        durationMonths,
        salarySlipFileName,
        workCertificateFileName,
        idDocumentFileName,
        businessDecision,
        estimatedMonthlyPayment,
        decisionReason: businessIssues.join(' '),
      });

      setDecisionMessage(
        request.status === 'rejected'
          ? 'The credit request was recorded as rejected after eligibility checks.'
          : 'The credit request has been submitted and is now pending bank review.',
      );

      setForm({
        creditType: 'immobilier',
        requestedAmount: '',
        propertyValue: '',
        monthlySalary: '',
        workStatus: 'employed',
        durationUnit: 'months',
        durationValue: '',
      });
      setSalarySlipFileName('');
      setWorkCertificateFileName('');
      setIdDocumentFileName('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-semibold tracking-tight">Credit Request</CardTitle>
            <CardDescription>Submit a fully validated credit request with salary, duration, and supporting documents.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {decisionMessage && (
              <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
                {decisionMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Credit type</label>
                  <Select value={form.creditType} onValueChange={(value: 'immobilier' | 'auto' | 'consommation') => setForm((prev) => ({ ...prev, creditType: value }))}>
                    <SelectTrigger className="w-full rounded-xl bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immobilier">Immobilier</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                      <SelectItem value="consommation">Consommation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Requested amount</label>
                  <Input name="requestedAmount" type="number" value={form.requestedAmount} onChange={handleChange} className={fieldErrors.requestedAmount ? 'border-red-500' : ''} placeholder="500000" />
                  {fieldErrors.requestedAmount && <p className="mt-1 text-xs text-red-500">{fieldErrors.requestedAmount}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Property value {form.creditType === 'immobilier' ? '*' : '(if immobilier)'}</label>
                  <Input name="propertyValue" type="number" value={form.propertyValue} onChange={handleChange} placeholder="3500000" className={form.creditType === 'immobilier' && !form.propertyValue ? 'border-red-500' : ''} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Monthly salary</label>
                  <Input name="monthlySalary" type="number" value={form.monthlySalary} onChange={handleChange} className={fieldErrors.monthlySalary ? 'border-red-500' : ''} placeholder="180000" />
                  {fieldErrors.monthlySalary && <p className="mt-1 text-xs text-red-500">{fieldErrors.monthlySalary}</p>}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Work status</label>
                  <Select value={form.workStatus} onValueChange={(value: CreditFormState['workStatus']) => setForm((prev) => ({ ...prev, workStatus: value }))}>
                    <SelectTrigger className="w-full rounded-xl bg-background"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self-employed">Self-employed</SelectItem>
                      <SelectItem value="contract">Contract</SelectItem>
                      <SelectItem value="retired">Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Duration</label>
                  <div className="flex gap-3">
                    <Input name="durationValue" type="number" value={form.durationValue} onChange={handleChange} className={fieldErrors.durationValue ? 'border-red-500 flex-1' : 'flex-1'} placeholder="24" />
                    <Select value={form.durationUnit} onValueChange={(value: 'months' | 'years') => setForm((prev) => ({ ...prev, durationUnit: value }))}>
                      <SelectTrigger className="w-28 rounded-xl bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {fieldErrors.durationValue && <p className="mt-1 text-xs text-red-500">{fieldErrors.durationValue}</p>}
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-white/70 p-4 text-sm text-foreground">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Installment</p><p className="mt-1 font-semibold">{durationMonths ? `${formatCurrency(estimatedMonthlyPayment)} DZD` : '—'}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Duration in months</p><p className="mt-1 font-semibold">{durationMonths || '—'}</p></div>
                  <div><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Salary ratio</p><p className="mt-1 font-semibold">{requestedAmount && monthlySalary ? `${(monthlySalary / (estimatedMonthlyPayment || 1)).toFixed(1)}x` : '—'}</p></div>
                </div>
                <div className="mt-4 space-y-2">
                  {businessIssues.length > 0 ? (
                    businessIssues.map((issue) => (
                      <div key={issue} className="flex items-start gap-2 text-sm text-red-600"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{issue}</div>
                    ))
                  ) : (
                    <div className="flex items-start gap-2 text-sm text-emerald-700"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />The request meets the basic eligibility checks.</div>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <label className="flex flex-col gap-2 rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Salary slips</span>
                  <span>{salarySlipFileName || 'Upload file'}</span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setSalarySlipFileName(event.target.files?.[0]?.name || '')} />
                  <span className="inline-flex items-center gap-2 text-primary"><UploadCloud className="h-4 w-4" />Browse</span>
                </label>
                <label className="flex flex-col gap-2 rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Work certificate</span>
                  <span>{workCertificateFileName || 'Upload file'}</span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setWorkCertificateFileName(event.target.files?.[0]?.name || '')} />
                  <span className="inline-flex items-center gap-2 text-primary"><UploadCloud className="h-4 w-4" />Browse</span>
                </label>
                <label className="flex flex-col gap-2 rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">ID document</span>
                  <span>{idDocumentFileName || 'Upload file'}</span>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(event) => setIdDocumentFileName(event.target.files?.[0]?.name || '')} />
                  <span className="inline-flex items-center gap-2 text-primary"><UploadCloud className="h-4 w-4" />Browse</span>
                </label>
              </div>

              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90" disabled={submitting}>
                {submitting ? 'Submitting request...' : 'Submit credit request'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-semibold tracking-tight">Request history</CardTitle>
              <CardDescription>Monitor the state of all credit requests.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-3">
              {state.creditRequests.slice(0, 5).map((request) => (
                <div key={request.id} className="rounded-2xl border border-border/70 bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{request.creditType}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(request.requestedAmount)} DZD • {request.durationMonths} months</p>
                    </div>
                    <Badge className={request.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : request.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}>{request.status}</Badge>
                  </div>
                  {request.decisionReason && <p className="mt-2 text-sm text-muted-foreground">{request.decisionReason}</p>}
                  <p className="mt-2 text-xs text-muted-foreground">Submitted {new Date(request.submittedAt).toLocaleString()}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-semibold tracking-tight">Eligibility rules</CardTitle>
              <CardDescription>Rules applied before the request is sent to review.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 text-sm text-muted-foreground space-y-3">
              <p>• Immobilier requests must include property value.</p>
              <p>• Requested amount must remain within a realistic salary-to-installment ratio.</p>
              <p>• Duration must be at least 6 months.</p>
              <p>• Salary slips, work certificate, and ID document are mandatory.</p>
              <p>• Ineligible requests are recorded with a rejected status and reason.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
