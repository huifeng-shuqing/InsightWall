import { useMemo, useEffect, useState } from 'react';
import type { EChartsOption } from 'echarts';
import BaseChart from '../BaseChart';
import { CHART_DEFAULTS } from '@/constants/chart-defaults';

interface MapChartProps { data: Array<{ name: string; value: number }>; height?: number | string; }

export default function MapChart({ data, height }: MapChartProps) {
  const [geoJson, setGeoJson] = useState<unknown>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json')
      .then((r) => r.json())
      .then(setGeoJson)
      .catch(() => setError(true));
  }, []);

  const option = useMemo<EChartsOption>(() => {
    if (!geoJson) return {};
    return {
      ...CHART_DEFAULTS.map,
      geo: { map: 'china', roam: false, zoom: 1.2, center: [104, 35], itemStyle: { areaColor: '#0d3b66', borderColor: 'rgba(0,212,255,0.3)' }, emphasis: { itemStyle: { areaColor: '#1a73e8' } }, label: { show: false } },
      series: [{
        type: 'map', map: 'china', geoIndex: 0, data,
      }, {
        type: 'effectScatter', coordinateSystem: 'geo', data: data.filter((d) => d.value > 2000).map((d) => ({ name: d.name, value: [0, 0] })),
        rippleEffect: { brushType: 'stroke', scale: 4 },
        symbolSize: 6, showEffectOn: 'render',
        itemStyle: { color: '#00ff88' },
      }],
    };
  }, [geoJson, data]);

  useEffect(() => {
    if (geoJson) {
      import('echarts').then((echarts) => {
        echarts.registerMap('china', geoJson as never);
      });
    }
  }, [geoJson]);

  if (error) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height, color: '#8892b0' }}>地图数据加载失败</div>;
  if (!geoJson) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height, color: '#8892b0' }}>地图加载中...</div>;

  return <BaseChart option={option} height={height} />;
}