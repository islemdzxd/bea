'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send } from 'lucide-react';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

interface QuickTransferContact {
  id: string;
  name: string;
  title: string;
  avatar: string;
}

interface QuickTransferProps {
  contacts: QuickTransferContact[];
}

export function QuickTransfer({ contacts }: Readonly<QuickTransferProps>) {
  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0]?.id || '');
  const [amount, setAmount] = useState('');

  const handleSend = () => {
    const selectedContact = contacts.find((c) => c.id === selectedContactId);
    if (amount && selectedContact) {
      alert(`Transferring $${amount} to ${selectedContact.name}`);
      setAmount('');
    }
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">Quick Transfer</CardTitle>
        <CardDescription>Send money to a frequent contact in a couple of taps.</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-6">
          {/* Contacts */}
          <div>
            {contacts.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">•</EmptyMedia>
                  <EmptyTitle>No contacts available</EmptyTitle>
                  <EmptyDescription>Add a saved beneficiary to make transfers faster.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-3">
                {contacts.map((contact) => (
                  <button
                    key={contact.id}
                    onClick={() => setSelectedContactId(contact.id)}
                    className={`flex-shrink-0 rounded-2xl px-1 py-1 text-center transition-all ${
                      selectedContactId === contact.id
                        ? 'bg-primary/5 ring-1 ring-primary/15'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                  >
                    <Avatar className="mx-auto mb-2 h-14 w-14 border-2 border-white shadow-[0_10px_24px_-16px_rgba(26,36,86,0.35)]">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback>{contact.name[0]}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm font-medium text-foreground">{contact.name}</p>
                    <p className="text-xs text-muted-foreground">{contact.title}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input Section */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="quick-transfer-amount" className="mb-2 block text-xs font-medium text-muted-foreground uppercase tracking-[0.16em]">
                Write Amount
              </label>
              <Input
                id="quick-transfer-amount"
                type="number"
                placeholder="525.50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSend} className="px-6 text-white bg-primary hover:bg-primary/90">
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
