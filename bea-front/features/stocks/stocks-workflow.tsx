'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, BadgeCheck, ChartCandlestick, TrendingUp, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useBanking } from '@/features/banking/banking-provider';

type StockSide = 'buy' | 'sell';

interface StockOrderForm {
  accountId: string;
  symbol: string;
  side: StockSide;
  quantity: string;
}

export function StocksWorkflow() {
  const { state, submitStockOrder } = useBanking();
  const [form, setForm] = useState<StockOrderForm>({
    accountId: state.accounts[0]?.id ?? '',
    symbol: state.marketStocks[0]?.symbol ?? '',
    side: 'buy',
    quantity: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedAccount = state.accounts.find((account) => account.id === form.accountId) ?? state.accounts[0];
  const selectedStock = state.marketStocks.find((stock) => stock.symbol === form.symbol) ?? state.marketStocks[0];
  const quantity = Number(form.quantity || 0);
  const estimatedTotal = useMemo(() => Number((quantity * (selectedStock?.price ?? 0)).toFixed(2)), [quantity, selectedStock?.price]);
  const currentHolding = state.holdings.find((holding) => holding.symbol === form.symbol);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError('');
    setMessage('');
  };

  const executeOrder = () => {
    if (!form.accountId || !form.symbol || !quantity) {
      setError('Select an account, stock, and quantity before placing the order.');
      return;
    }

    setSubmitting(true);
    const result = submitStockOrder({
      accountId: form.accountId,
      symbol: form.symbol,
      name: selectedStock?.name ?? form.symbol,
      side: form.side,
      quantity,
      price: selectedStock?.price ?? 0,
    });

    if (!result.ok) {
      setError(result.error || 'Stock order failed.');
      setMessage('');
      setSubmitting(false);
      return;
    }

    setMessage(`${form.side === 'buy' ? 'Buy' : 'Sell'} order executed successfully. Reference ${result.order?.reference}.`);
    setError('');
    setForm((prev) => ({ ...prev, quantity: '' }));
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-semibold tracking-tight">Stock Order</CardTitle>
            <CardDescription>Buy or sell from the active market watchlist and update your portfolio instantly.</CardDescription>
          </CardHeader>

          <CardContent className="px-0 pb-0 space-y-5">
            {message && <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</div>}
            {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Settlement account</label>
                <Select value={form.accountId} onValueChange={(value) => setForm((prev) => ({ ...prev, accountId: value }))}>
                  <SelectTrigger className="w-full rounded-xl bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {state.accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>{account.label} • {account.balance.toLocaleString()} {account.currency}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Stock</label>
                <Select value={form.symbol} onValueChange={(value) => setForm((prev) => ({ ...prev, symbol: value }))}>
                  <SelectTrigger className="w-full rounded-xl bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {state.marketStocks.map((stock) => (
                      <SelectItem key={stock.symbol} value={stock.symbol}>{stock.symbol} • {stock.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Quantity</label>
                <Input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="10" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Action</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button type="button" variant={form.side === 'buy' ? 'default' : 'outline'} className="justify-center" onClick={() => setForm((prev) => ({ ...prev, side: 'buy' }))}><ArrowUp className="mr-2 h-4 w-4" />Buy</Button>
                  <Button type="button" variant={form.side === 'sell' ? 'default' : 'outline'} className="justify-center" onClick={() => setForm((prev) => ({ ...prev, side: 'sell' }))}><ArrowDown className="mr-2 h-4 w-4" />Sell</Button>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-white/70 p-4 text-sm">
              <div className="grid gap-3 sm:grid-cols-3">
                <div><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Price</p><p className="mt-1 font-semibold">${selectedStock?.price.toFixed(2)}</p></div>
                <div><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Estimated total</p><p className="mt-1 font-semibold">${estimatedTotal.toFixed(2)}</p></div>
                <div><p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Available cash</p><p className="mt-1 font-semibold">${selectedAccount?.balance.toLocaleString()}</p></div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <Badge variant="secondary">{selectedStock?.exchange}</Badge>
                <Badge variant="secondary">{selectedStock?.sector}</Badge>
                <Badge variant="secondary">{currentHolding ? `Holdings: ${currentHolding.quantity}` : 'No current holding'}</Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
              <BadgeCheck className="h-4 w-4 text-primary" />
              Orders are executed immediately against the simulated account ledger and portfolio.
            </div>

            <Button className="w-full bg-primary text-white hover:bg-primary/90" onClick={executeOrder} disabled={submitting}>
              {submitting ? 'Placing order...' : `${form.side === 'buy' ? 'Buy' : 'Sell'} ${selectedStock?.symbol}`}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-semibold tracking-tight">Market watch</CardTitle>
              <CardDescription>Live quote simulation for trading decisions.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-3">
              {state.marketStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => setForm((prev) => ({ ...prev, symbol: stock.symbol }))}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${stock.symbol === form.symbol ? 'border-primary/35 bg-primary/5' : 'border-border/70 bg-white/70 hover:bg-secondary/50'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">{stock.symbol} • {stock.name}</p>
                      <p className="text-xs text-muted-foreground">{stock.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">${stock.price.toFixed(2)}</p>
                      <p className={`text-xs font-medium ${stock.changePercent >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</p>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-semibold tracking-tight">Portfolio</CardTitle>
              <CardDescription>Holdings update instantly after each completed order.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-3">
              {state.holdings.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No holdings yet.</div>
              ) : (
                state.holdings.map((holding) => (
                  <div key={holding.symbol} className="rounded-2xl border border-border/70 bg-white/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{holding.name}</p>
                        <p className="text-xs text-muted-foreground">{holding.symbol} • Qty {holding.quantity} • Avg ${holding.averagePrice.toFixed(2)}</p>
                      </div>
                      <div className={`text-right text-sm font-semibold ${holding.profitLoss >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>${holding.profitLoss.toFixed(2)}</div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-lg font-semibold tracking-tight">Order history</CardTitle>
              <CardDescription>Completed trades appear here with execution references.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 pb-0 space-y-3">
              {state.stockOrders.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">No stock orders yet.</div>
              ) : (
                state.stockOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="rounded-2xl border border-border/70 bg-white/70 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{order.side === 'buy' ? 'Buy' : 'Sell'} {order.symbol}</p>
                        <p className="text-xs text-muted-foreground">Qty {order.quantity} • ${order.price.toFixed(2)} • {order.reference}</p>
                      </div>
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">{order.status}</Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
