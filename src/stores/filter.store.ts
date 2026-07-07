import { create } from 'zustand';

interface FilterState {
  dateRange: [string, string];
  selectedRegions: string[];
  setDateRange: (range: [string, string]) => void;
  setRegions: (regions: string[]) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  dateRange: ['2026-06-08', '2026-07-07'],
  selectedRegions: [],
  setDateRange: (range) => set({ dateRange: range }),
  setRegions: (regions) => set({ selectedRegions: regions }),
}));