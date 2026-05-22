'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminGet } from '@/lib/bea-admin-api';
import {
  mapAllocation,
  mapCredit,
  type ApiAllocation,
  type ApiCredit,
  type ApiDashboardStats,
} from '@/lib/api-mappers';
import type { CreditRequest, TourismAllocationRequest } from '@/lib/types';

export function useBackOfficeData() {
  const [allocations, setAllocations] = useState<TourismAllocationRequest[]>([]);
  const [credits, setCredits] = useState<CreditRequest[]>([]);
  const [stats, setStats] = useState<ApiDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allocData, creditData, statsData] = await Promise.all([
        adminGet<ApiAllocation[]>('/api/allocations'),
        adminGet<ApiCredit[]>('/api/credits'),
        adminGet<ApiDashboardStats>('/api/dashboard/stats'),
      ]);
      setAllocations(allocData.map(mapAllocation));
      setCredits(creditData.map(mapCredit));
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { allocations, credits, stats, loading, error, refresh };
}

export function useAllocation(id: string) {
  const [request, setRequest] = useState<TourismAllocationRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGet<ApiAllocation>(`/api/allocations/${encodeURIComponent(id)}`);
      setRequest(mapAllocation(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { request, loading, error, refresh };
}

export function useCredit(id: string) {
  const [request, setRequest] = useState<CreditRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGet<ApiCredit>(`/api/credits/${encodeURIComponent(id)}`);
      setRequest(mapCredit(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { request, loading, error, refresh };
}
