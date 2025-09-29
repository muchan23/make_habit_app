import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Record, Percentiles } from '@/types';
import { recordAPI, statsAPI } from '@/lib/api';

interface RecordStore {
  records: Record[] | null; // nullを許可（未取得状態）
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setRecords: (records: Record[]) => void;
  addRecord: (record: Omit<Record, 'id' | 'created_at' | 'updated_at'>) => void;
  updateRecord: (id: string, updates: Partial<Record>) => void;
  deleteRecord: (id: string) => void;
  getRecordsByGoal: (goalId: string) => Record[];
  getStreak: (goalId: string) => number;
  calculatePercentiles: (goalId: string, period?: string) => Percentiles;
  calculateColorLevel: (goalId: string, duration: number) => 0 | 1 | 2 | 3 | 4;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API連携
  fetchRecords: (params?: { goal_id?: string; date?: string }) => Promise<void>;
  createRecordAPI: (recordData: Omit<Record, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateRecordAPI: (id: string, updates: Partial<Record>) => Promise<void>;
  deleteRecordAPI: (id: string) => Promise<void>;
  fetchPercentiles: (goalId: string, period?: string) => Promise<Percentiles>;
}

export const useRecordStore = create<RecordStore>()(
  // persistを一時的に無効化してテスト
  // persist(
    (set, get) => ({
      records: null, // 初期状態をnullに変更（未取得状態を明確化）
      isLoading: false,
      error: null,
      
      setRecords: (records) => set({ records }),
      
      addRecord: (recordData) => {
        const newRecord: Record = {
          ...recordData,
          id: `record_${Date.now()}`,
          created_at: new Date(),
          updated_at: new Date(),
        };
        set((state) => ({ records: [...state.records, newRecord] }));
      },
      
      updateRecord: (id, updates) => {
        set((state) => ({
          records: state.records.map((record) =>
            record.id === id ? { ...record, ...updates, updated_at: new Date() } : record
          ),
        }));
      },
      
      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((record) => record.id !== id),
        }));
      },
      
      getRecordsByGoal: (goalId) => {
        const { records } = get();
        return records
          .filter((record) => record.goal_id === goalId)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      
      getStreak: (goalId) => {
        const { records } = get();
        const goalRecords = records
          .filter((record) => record.goal_id === goalId && record.status === 'COMPLETED')
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        let streak = 0;
        let currentDate = new Date();
        
        for (const record of goalRecords) {
          const recordDate = new Date(record.date);
          if (recordDate.toDateString() === currentDate.toDateString()) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
          } else {
            break;
          }
        }
        
        return streak;
      },
      
      calculatePercentiles: (goalId, period = '3months') => {
        const { records } = get();
        const goalRecords = records
          .filter((record) => record.goal_id === goalId && record.status === 'COMPLETED')
          .map((record) => record.duration_minutes)
          .sort((a, b) => a - b);
        
        if (goalRecords.length === 0) {
          return { p25: 0, p50: 0, p75: 0 };
        }
        
        const len = goalRecords.length;
        return {
          p25: goalRecords[Math.floor(len * 0.25)],
          p50: goalRecords[Math.floor(len * 0.5)],
          p75: goalRecords[Math.floor(len * 0.75)],
        };
      },
      
      calculateColorLevel: (goalId, duration) => {
        if (duration === 0) return 0; // 未実行
        
        const percentiles = get().calculatePercentiles(goalId);
        
        if (duration <= percentiles.p25) return 1; // 下位25%
        if (duration <= percentiles.p50) return 2; // 25-50%
        if (duration <= percentiles.p75) return 3; // 50-75%
        return 4; // 上位25%
      },
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),

      // API連携メソッド
      fetchRecords: async (params) => {
        const state = get();
        if (state.isLoading) {
          console.log('Records already loading, skipping...');
          return; // 既にローディング中の場合は何もしない
        }
        
        // 既にデータを取得済みの場合はスキップ（空配列でも取得済みとみなす）
        if (state.records !== null) {
          console.log('Records already fetched, skipping...');
          return;
        }
        
        try {
          set({ isLoading: true, error: null });
          console.log('Fetching records...');
          const apiParams = params ? {
            goalId: params.goal_id,
            date: params.date
          } : {};
          const records = await recordAPI.getRecords(apiParams);
          console.log('Records fetched successfully:', records);
          set({ records: records || [], isLoading: false });
        } catch (error) {
          console.error('Error fetching records:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
            records: [] // エラー時も空配列を設定
          });
        }
      },
      
      createRecordAPI: async (recordData) => {
        try {
          set({ isLoading: true, error: null });
          const newRecord = await recordAPI.createRecord(recordData);
          set((state) => ({ records: [...state.records, newRecord] }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      updateRecordAPI: async (id, updates) => {
        try {
          set({ isLoading: true, error: null });
          const updatedRecord = await recordAPI.updateRecord(id, updates);
          set((state) => ({
            records: state.records.map((record) =>
              record.id === id ? updatedRecord : record
            ),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      deleteRecordAPI: async (id) => {
        try {
          set({ isLoading: true, error: null });
          await recordAPI.deleteRecord(id);
          set((state) => ({
            records: state.records.filter((record) => record.id !== id),
          }));
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      fetchPercentiles: async (goalId, period) => {
        try {
          const percentiles = await statsAPI.getPercentiles(goalId, period);
          return percentiles;
        } catch (error) {
          console.error('Error fetching percentiles:', error);
          return { p25: 0, p50: 0, p75: 0 };
        }
      },
    })
    // persistを一時的に無効化してテスト
    // }),
    // {
    //   name: 'record-storage',
    //   partialize: (state) => ({ records: state.records }),
    //   // persistミドルウェアの設定を最適化
    //   skipHydration: false,
    //   onRehydrateStorage: () => (state) => {
    //     console.log('RecordStore rehydrated:', state);
    //   },
    // }
  // )
);