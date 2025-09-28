import { useEffect, useCallback } from 'react';
import { useRecordStore } from '@/stores/recordStore';

export function useRecords(goalId?: string) {
  const { records, fetchRecords, isLoading, error } = useRecordStore();

  // fetchRecordsをuseCallbackで安定化
  const stableFetchRecords = useCallback((params?: { goal_id?: string; date?: string }) => {
    fetchRecords(params);
  }, []); // 依存配列を空にして安定化

  useEffect(() => {
    // goalIdが変更された時のみデータを取得
    stableFetchRecords(goalId ? { goal_id: goalId } : undefined);
  }, [goalId, stableFetchRecords]);

  return {
    records,
    fetchRecords: stableFetchRecords,
    isLoading,
    error,
  };
}
