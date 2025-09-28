'use client';

import { useSession } from 'next-auth/react';
import { useGoals } from '@/hooks/useGoals';
import { useRecords } from '@/hooks/useRecords';
import { ContributionCalendar } from '@/components/calendar/ContributionCalendar';
import { GoalSelector } from '@/components/goals/GoalSelector';
import { RecordList } from '@/components/records/RecordList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';

export default function Dashboard() {
  const { data: session } = useSession();
  const { goals, selectedGoal, isLoading: goalsLoading, error: goalsError } = useGoals();
  const { isLoading: recordsLoading, error: recordsError } = useRecords();

  const isLoading = goalsLoading || recordsLoading;
  const error = goalsError || recordsError;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <ErrorDisplay error={error} />
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-gray-500">データを読み込み中...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 目標選択 */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">記録カレンダー</h2>
              <GoalSelector />
            </div>

            {/* GitHub風カレンダー */}
            <ContributionCalendar goalId={selectedGoal?.id} />

            {/* 記録一覧を追加 */}
            <RecordList goalId={selectedGoal?.id} limit={5} />
          </div>
        )}
      </main>
    </div>
  );
}