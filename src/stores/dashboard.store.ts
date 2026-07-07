import { create } from 'zustand';
import { dashboardApi } from '@/api/modules/dashboard.api';
import { logger } from '@/logger';
import type { DashboardData } from '@/types/dashboard';

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
  fetchDashboard: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  loading: false,
  error: null,
  lastUpdated: 0,

  fetchDashboard: async () => {
    const startTime = Date.now();
    set({ loading: true, error: null });
    try {
      const res = await dashboardApi.getOverview();
      set({ data: res.data, loading: false, lastUpdated: Date.now() });
      logger.apiTrace('fetchDashboard', Date.now() - startTime, res.code);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      set({ error: msg, loading: false });
      logger.error(e as Error, 'fetchDashboard');
    }
  },
}));