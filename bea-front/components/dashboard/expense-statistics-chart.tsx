'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ExpenseData {
  name: string;
  value: number;
  fill: string;
}

interface ExpenseStatisticsChartProps {
  data: ExpenseData[];
}

export function ExpenseStatisticsChart({ data }: Readonly<ExpenseStatisticsChartProps>) {
  return (
    <Card className="h-full p-4 sm:p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-semibold tracking-tight">Expense Statistics</CardTitle>
        <CardDescription>See where spending is concentrated across your accounts.</CardDescription>
      </CardHeader>

      <CardContent className="px-0 pt-0">
        <div className="flex flex-col gap-5">
          <div className="mx-auto h-[220px] w-full max-w-[300px] sm:h-[250px] sm:max-w-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={92}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    borderRadius: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 gap-2 2xl:grid-cols-2">
            {data.map((entry) => (
              <div
                key={entry.name}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/70 bg-white/60 px-3 py-2.5 text-sm shadow-[0_12px_24px_-20px_rgba(26,36,86,0.2)]"
              >
                <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: entry.fill }} />
                <span className="min-w-0 flex-1 truncate whitespace-nowrap font-medium leading-tight text-foreground" title={entry.name}>
                  {entry.name}
                </span>
                <span className="shrink-0 font-semibold tabular-nums text-foreground">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
