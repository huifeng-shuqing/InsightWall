import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MainLayout from '@/pages/MainLayout';

// Mock all API modules
vi.mock('@/api/modules/dashboard.api', () => ({
  dashboardApi: {
    getOverview: vi.fn().mockResolvedValue({
      code: 0,
      message: 'ok',
      data: {
        kpis: [
          { id: '1', title: '总销售额', value: 100000000, unit: '元', trend: 12.5, trendDirection: 'up', icon: 'sales' },
          { id: '2', title: '总订单量', value: 300000, unit: '单', trend: 8.3, trendDirection: 'up', icon: 'orders' },
          { id: '3', title: '客单价', value: 352, unit: '元', trend: -2.1, trendDirection: 'down', icon: 'customer' },
          { id: '4', title: '转化率', value: 8.2, unit: '%', trend: 1.8, trendDirection: 'up', icon: 'conversion' },
        ],
        salesTrend: [{ date: '2026-07-01', sales: 5000000, orders: 15000 }],
        geoData: [{ name: '广东', value: 4000, count: 80000 }],
        categoryRanking: [{ rank: 1, name: '电子产品', value: 38000000, percentage: 0.3, trend: 'up', change: 0 }],
        cityRanking: [{ rank: 1, name: '北京', value: 18000000, percentage: 0.14, trend: 'up', change: 0 }],
      },
      timestamp: Date.now(),
    }),
  },
}));

vi.mock('@/api/modules/ranking.api', () => ({
  rankingApi: {
    getRankingData: vi.fn().mockResolvedValue({
      code: 0,
      message: 'ok',
      data: {
        categoryRanking: [],
        cityRanking: [],
      },
      timestamp: Date.now(),
    }),
  },
}));

vi.mock('@/api/modules/map.api', () => ({
  mapApi: {
    getGeoData: vi.fn().mockResolvedValue({
      code: 0,
      message: 'ok',
      data: { geoData: [], cityRanking: [] },
      timestamp: Date.now(),
    }),
  },
}));

describe('Dashboard Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page header with project name', async () => {
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('洞察之墙')).toBeInTheDocument();
    });
  });

  it('renders KPI cards after data loads', async () => {
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>,
    );

    await waitFor(() => {
      const cards = screen.getAllByTestId('kpi-card');
      expect(cards.length).toBeGreaterThanOrEqual(4);
    });
  });

  it('shows mock data badge', async () => {
    render(
      <BrowserRouter>
        <MainLayout />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText('🔶 模拟数据')).toBeInTheDocument();
    });
  });
});