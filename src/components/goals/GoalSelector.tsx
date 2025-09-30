'use client';

import { useState, useEffect } from 'react';
import { useGoalStore } from '@/stores/goalStore';
import { useRecordStore } from '@/stores/recordStore';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';

export function GoalSelector() {
  const { goals, selectedGoal, selectGoal, fetchGoals, isLoading, error, setError } = useGoalStore();
  const { fetchRecords } = useRecordStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // 一度だけ実行
    fetchGoals();
  }, []); // 依存配列を空にして、一度だけ実行

  const handleGoalSelect = async (goal: any) => {
    selectGoal(goal);
    setIsDropdownOpen(false);
    
    // 選択された目標の記録を取得
    if (goal) {
      await fetchRecords({ goal_id: goal.id });
    } else {
      await fetchRecords();
    }
  };

  const handleShowAll = async () => {
    selectGoal(null);
    setIsDropdownOpen(false);
    await fetchRecords();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <LoadingSpinner />
        <span className="ml-2 text-sm text-[#8b949e]">目標を読み込み中...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      
      <div className="flex items-center space-x-2">
        <Button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          variant="outline"
          className="flex items-center space-x-2 bg-[#21262d] border-[#30363d] text-[#f0f6fc] hover:bg-[#30363d]"
        >
          <span>{selectedGoal ? selectedGoal.name : '全ての目標'}</span>
          <svg
            className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </Button>
      </div>

      {isDropdownOpen && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-[#21262d] border border-[#30363d] rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={handleShowAll}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-[#30363d] ${
                !selectedGoal ? 'bg-[#238636] text-white' : 'text-[#f0f6fc]'
              }`}
            >
              全ての目標
            </button>
            
            {goals?.map((goal) => (
              <button
                key={goal.id}
                onClick={() => handleGoalSelect(goal)}
                className={`w-full px-4 py-2 text-left text-sm hover:bg-[#30363d] ${
                  selectedGoal?.id === goal.id ? 'bg-[#238636] text-white' : 'text-[#f0f6fc]'
                }`}
              >
                <div className="font-medium">{goal.name}</div>
                {goal.description && (
                  <div className="text-xs text-[#8b949e] truncate">{goal.description}</div>
                )}
              </button>
            ))}
            
            {goals?.length === 0 && (
              <div className="px-4 py-2 text-sm text-[#8b949e]">
                目標がありません
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}