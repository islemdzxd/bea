'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface WeeklyActivityData {
  name: string;
  deposit: number;
  withdrawal: number;
}

interface WeeklyActivityChartProps {
  data: WeeklyActivityData[];
}

export function WeeklyActivityChart({ data }: Readonly<WeeklyActivityChartProps>) {
  return (
    <Card className="p-4 sm:p-6">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl font-semibold tracking-tight">Weekly Activity</CardTitle>
        <CardDescription>Track daily inflow and outflow with a cleaner at-a-glance chart.</CardDescription>
      </CardHeader>

      <CardContent className="px-0 pt-0">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              stroke="#666666"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              stroke="#666666"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
              }}
              cursor={{ fill: 'rgba(0, 61, 165, 0.1)' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="square"
            />
            <Bar dataKey="deposit" fill="#00d4ff" radius={[10, 10, 0, 0]} />
            <Bar dataKey="withdrawal" fill="#003da5" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
