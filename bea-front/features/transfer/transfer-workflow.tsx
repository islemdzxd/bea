'use client';

import React, { useMemo, useState } from 'react';
import { AlertCircle, BadgeCheck } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useBanking } from '@/features/banking/banking-provider';

type FieldErrors = Partial<Record<string, string>>;

interface TransferFormState {
  debitAccountId: string;
  beneficiaryLastName: string;
  beneficiaryFirstName: string;
  address: string;
  rib: string;
  amount: string;
  reason: string;
  signature: string;
}

function normalizeRib(value: string) {
  return value.split(' ').join('');
}

export function TransferWorkflow() {
  const { state, submitTransferOrder } = useBanking();
  const [form, setForm] = useState<TransferFormState>({
    debitAccountId: state.accounts[0]?.id ?? '',
    beneficiaryLastName: '',
    beneficiaryFirstName: '',
    address: '',
    rib: '',
    amount: '',
    reason: '',
    signature: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [previewDecision, setPreviewDecision] = useState<{ ok: boolean; error?: string }>({ ok: true });
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedAccount = state.accounts.find((account) => account.id === form.debitAccountId) ?? state.accounts[0];
  const transferAmount = Number(form.amount || 0);

  const ribNormalized = normalizeRib(form.rib);
  const ribValid = /^\d{20}$/.test(ribNormalized);
  const sufficientBalance = selectedAccount ? transferAmount > 0 && transferAmount <= selectedAccount.balance : false;

  const previewWarnings = useMemo(() => {
    const warnings: string[] = [];
    if (!ribValid && form.rib) warnings.push('RIB must contain exactly 20 digits.');
    if (selectedAccount && transferAmount > selectedAccount.balance) warnings.push('Insufficient balance for the selected account.');
    if (transferAmount <= 0 && form.amount) warnings.push('Transfer amount must be greater than zero.');
    return warnings;
  }, [form.amount, form.rib, ribValid, selectedAccount, transferAmount]);

  let previewError: string | undefined;
  if (!sufficientBalance) {
    previewError = 'Insufficient balance for this transfer.';
  } else if (!ribValid) {
    previewError = 'Enter a valid 20-digit RIB/IBAN.';
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setSubmitMessage('');
  };

  const validateFields = () => {
    const errors: FieldErrors = {};
    if (!form.debitAccountId) errors.debitAccountId = 'Select a debit account.';
    if (!form.beneficiaryLastName.trim()) errors.beneficiaryLastName = 'Beneficiary last name is required.';
    if (!form.beneficiaryFirstName.trim()) errors.beneficiaryFirstName = 'Beneficiary first name is required.';
    if (!form.address.trim()) errors.address = 'Beneficiary address is required.';
    if (!form.rib.trim() || !ribValid) errors.rib = 'Enter a valid 20-digit RIB/IBAN.';
    if (!form.amount || Number(form.amount) <= 0) errors.amount = 'Enter a valid transfer amount.';
    if (!form.signature.trim()) errors.signature = 'Type your name as the transfer signature.';
    return errors;
  };

  const openConfirmation = (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateFields();
    setFieldErrors(errors);
    const hasErrors = Object.keys(errors).length > 0;
    if (hasErrors) return;

    const preview = { ok: sufficientBalance && ribValid, error: previewError };

    setPreviewDecision(preview);
    if (!preview.ok) {
      setSubmitMessage(preview.error || 'Transfer cannot be confirmed yet.');
      return;
    }

    setConfirmationOpen(true);
  };

  const confirmTransfer = () => {
    setSubmitting(true);
    const result = submitTransferOrder({
      debitAccountId: form.debitAccountId,
      beneficiaryLastName: form.beneficiaryLastName.trim(),
      beneficiaryFirstName: form.beneficiaryFirstName.trim(),
      address: form.address.trim(),
      rib: ribNormalized,
      amount: transferAmount,
      reason: form.reason.trim() || undefined,
      signature: form.signature.trim(),
    });

    if (!result.ok) {
      setSubmitMessage(result.error || 'Transfer failed.');
      setConfirmationOpen(false);
      setSubmitting(false);
      return;
    }

    setConfirmationOpen(false);
    setSubmitting(false);
    setSubmitMessage(`Transfer completed successfully. Reference ${result.order?.reference}.`);
    setForm({
      debitAccountId: state.accounts[0]?.id ?? '',
      beneficiaryLastName: '',
      beneficiaryFirstName: '',
      address: '',
      rib: '',
      amount: '',
      reason: '',
      signature: '',
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-semibold tracking-tight">Bank Transfer</CardTitle>
            <CardDescription>Complete transfer form with account selection, beneficiary details, signature, and confirmation.</CardDescription>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {submitMessage && (
              <div className="mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
                {submitMessage}
              </div>
            )}

            <form onSubmit={openConfirmation} className="space-y-5">
              <div>
                <p className="mb-2 block text-sm font-medium text-foreground">Select debit account</p>
                <Select value={form.debitAccountId} onValueChange={(value) => setForm((prev) => ({ ...prev, debitAccountId: value }))}>
                  <SelectTrigger aria-label="Select debit account" className="w-full rounded-xl bg-background"><SelectValue placeholder="Choose account" /></SelectTrigger>
                  <SelectContent>
                    {state.accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>{account.label} • {account.balance.toLocaleString()} {account.currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.debitAccountId && <p className="mt-1 text-xs text-red-500">{fieldErrors.debitAccountId}</p>}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="transfer-beneficiary-last-name" className="mb-2 block text-sm font-medium text-foreground">Beneficiary last name</label>
                  <Input id="transfer-beneficiary-last-name" name="beneficiaryLastName" value={form.beneficiaryLastName} onChange={handleChange} className={fieldErrors.beneficiaryLastName ? 'border-red-500' : ''} />
                </div>
                <div>
                  <label htmlFor="transfer-beneficiary-first-name" className="mb-2 block text-sm font-medium text-foreground">Beneficiary first name</label>
                  <Input id="transfer-beneficiary-first-name" name="beneficiaryFirstName" value={form.beneficiaryFirstName} onChange={handleChange} className={fieldErrors.beneficiaryFirstName ? 'border-red-500' : ''} />
                </div>
              </div>

              <div>
                <label htmlFor="transfer-address" className="mb-2 block text-sm font-medium text-foreground">Address</label>
                <Input id="transfer-address" name="address" value={form.address} onChange={handleChange} className={fieldErrors.address ? 'border-red-500' : ''} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="transfer-rib" className="mb-2 block text-sm font-medium text-foreground">RIB / IBAN</label>
                  <Input id="transfer-rib" name="rib" value={form.rib} onChange={handleChange} placeholder="20 digits" className={fieldErrors.rib ? 'border-red-500' : ''} />
                  {fieldErrors.rib && <p className="mt-1 text-xs text-red-500">{fieldErrors.rib}</p>}
                </div>
                <div>
                  <label htmlFor="transfer-amount" className="mb-2 block text-sm font-medium text-foreground">Transfer amount</label>
                  <Input id="transfer-amount" name="amount" type="number" value={form.amount} onChange={handleChange} className={fieldErrors.amount ? 'border-red-500' : ''} placeholder="25000" />
                  {fieldErrors.amount && <p className="mt-1 text-xs text-red-500">{fieldErrors.amount}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="transfer-reason" className="mb-2 block text-sm font-medium text-foreground">Transfer reason (optional)</label>
                <Textarea id="transfer-reason" name="reason" value={form.reason} onChange={handleChange} className="rounded-2xl" placeholder="Invoice settlement, family support, rent, etc." />
              </div>

              <div>
                <label htmlFor="transfer-signature" className="mb-2 block text-sm font-medium text-foreground">Order signature</label>
                <Input id="transfer-signature" name="signature" value={form.signature} onChange={handleChange} className={fieldErrors.signature ? 'border-red-500' : ''} placeholder="Type your full name" />
                {fieldErrors.signature && <p className="mt-1 text-xs text-red-500">{fieldErrors.signature}</p>}
              </div>

              <div className="rounded-2xl border border-border/70 bg-white/70 p-4 text-sm">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="secondary">Balance: {selectedAccount?.balance.toLocaleString()} DZD</Badge>
                  <Badge variant="secondary">Amount: {transferAmount ? transferAmount.toLocaleString() : '—'} DZD</Badge>
                  <Badge variant="secondary">RIB valid: {ribValid ? 'Yes' : 'No'}</Badge>
                </div>
                <div className="mt-4 space-y-2">
                  {previewWarnings.length > 0 ? (
                    previewWarnings.map((warning) => (
                      <div key={warning} className="flex items-start gap-2 text-sm text-red-600"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />{warning}</div>
                    ))
                  ) : (
                    <div className="flex items-start gap-2 text-sm text-emerald-700"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />The transfer passes the preliminary validation checks.</div>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary/90">Review transfer</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-semibold tracking-tight">Transfer history</CardTitle>
              <CardDescription>Completed transfers are stored immediately after confirmation.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-3">
              {state.transferOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No transfers submitted yet.</div>
              ) : (
                state.transferOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="rounded-2xl border border-border/70 bg-white/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{order.beneficiaryFirstName} {order.beneficiaryLastName}</p>
                        <p className="text-xs text-muted-foreground">{order.amount.toLocaleString()} DZD • {order.rib}</p>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">{order.status}</Badge>
                    </div>
                    {order.reason && <p className="mt-2 text-sm text-muted-foreground">{order.reason}</p>}
                    <p className="mt-2 text-xs text-muted-foreground">Reference {order.reference}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-semibold tracking-tight">Security step</CardTitle>
              <CardDescription>Transfer execution is protected by a confirmation modal that simulates order signature.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 text-sm text-muted-foreground space-y-3">
              <p>• Balance is checked before execution.</p>
              <p>• RIB must contain 20 digits.</p>
              <p>• Beneficiary details are captured before confirmation.</p>
              <p>• Successful transfers update account balance and transaction history.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Confirm transfer</DialogTitle>
            <DialogDescription>Review the transfer order before signing and executing it.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3"><span className="text-muted-foreground">Account</span><span className="font-medium text-foreground">{selectedAccount?.label}</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3"><span className="text-muted-foreground">Beneficiary</span><span className="font-medium text-foreground">{form.beneficiaryFirstName} {form.beneficiaryLastName}</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3"><span className="text-muted-foreground">Amount</span><span className="font-medium text-foreground">{transferAmount.toLocaleString()} DZD</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3"><span className="text-muted-foreground">RIB</span><span className="font-medium text-foreground">{ribNormalized}</span></div>
            <div className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3"><span className="text-muted-foreground">Signature</span><span className="font-medium text-foreground">{form.signature}</span></div>
          </div>

          {previewDecision.ok ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">The order passes preliminary validation and will be executed on confirmation.</div>
          ) : (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{previewDecision.error}</div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmationOpen(false)}>Cancel</Button>
            <Button className="bg-primary text-white hover:bg-primary/90" onClick={confirmTransfer} disabled={submitting}>Confirm and sign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
