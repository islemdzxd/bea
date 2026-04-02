'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BalanceHistoryData {
  month: string;
  balance: number;
}

interface BalanceHistoryChartProps {
  data: BalanceHistoryData[];
}

export function BalanceHistoryChart({ data }: Readonly<BalanceHistoryChartProps>) {
  return (
    <Card className="h-full p-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold tracking-tight">Balance History</CardTitle>
        <CardDescription>Review trend direction with a softer, more readable chart treatment.</CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="min-h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#003da5" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#003da5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="month"
              stroke="#666666"
              style={{ fontSize: '12px' }}
              tickMargin={8}
            />
            <YAxis
              stroke="#666666"
              style={{ fontSize: '12px' }}
              width={36}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
              }}
              cursor={{ fill: 'rgba(0, 61, 165, 0.1)' }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#003da5"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorBalance)"
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
