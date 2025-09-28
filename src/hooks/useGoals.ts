import { useEffect, useCallback } from 'react';
import { useGoalStore } from '@/stores/goalStore';

export function useGoals() {
  const { goals, selectedGoal, fetchGoals, isLoading, error } = useGoalStore();

  // fetchGoalsをuseCallbackで安定化
  const stableFetchGoals = useCallback(() => {
    fetchGoals();
  }, []); // 依存配列を空にして安定化

  useEffect(() => {
    // 初回のみデータを取得
    if (goals.length === 0 && !isLoading) {
      stableFetchGoals();
    }
  }, [goals.length, isLoading, stableFetchGoals]);

  return {
    goals,
    selectedGoal,
    fetchGoals: stableFetchGoals,
    isLoading,
    error,
  };
}
