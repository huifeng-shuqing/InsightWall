import { test, expect } from '@playwright/test';

test.describe('InsightWall Dashboard', () => {
  test('should display title and KPI cards', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 等待页面标题
    await expect(page.locator('h1')).toContainText('洞察之墙');

    // 等待 KPI 卡片渲染
    const kpiCards = page.locator('[data-testid="kpi-card"]');
    await expect(kpiCards).toHaveCount(4);

    // 验证模拟数据标记
    await expect(page.getByText('模拟数据')).toBeVisible();
  });

  test('should render charts after data load', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 等待 ECharts canvas 渲染（至少有一个 canvas 元素）
    await page.waitForSelector('canvas', { timeout: 10000 });

    // 验证至少渲染了图表 canvas
    const canvases = page.locator('canvas');
    expect(await canvases.count()).toBeGreaterThan(0);
  });

  test('should show loading state initially', async ({ page }) => {
    await page.goto('http://localhost:5173');

    // 初始时应该看到加载状态
    await expect(page.getByText('加载中')).toBeVisible({ timeout: 3000 });
  });
});