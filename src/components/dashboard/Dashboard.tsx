'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { useGoalStore } from '@/stores/goalStore';
import { useRecordStore } from '@/stores/recordStore';
import { ContributionCalendar } from '@/components/calendar/ContributionCalendar';
import { GoalSelector } from '@/components/goals/GoalSelector';
import { RecordList } from '@/components/records/RecordList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const { goals, selectedGoal, fetchGoals, isLoading: goalsLoading, error: goalsError } = useGoalStore();
  const { fetchRecords, isLoading: recordsLoading, error: recordsError } = useRecordStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    // セッションが存在し、まだデータを取得していない場合のみデータを取得
    if (session?.user?.id && !hasFetched.current) {
      console.log('Session found, fetching data...');
      hasFetched.current = true;
      // 直接関数を呼び出し、依存配列に含めない
      fetchGoals();
      fetchRecords();
    }
  }, [session?.user?.id]); // 関数を依存配列から完全に除外

  const isLoading = status === 'loading' || goalsLoading || recordsLoading;
  const error = goalsError || recordsError;

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <ErrorDisplay error={error} />
          </div>
        )}

        {status === 'unauthenticated' ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#f0f6fc] mb-2">ログインが必要です</h2>
              <p className="text-[#8b949e]">ダッシュボードを表示するにはログインしてください。</p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <span className="ml-3 text-[#8b949e]">データを読み込み中...</span>
          </div>
        ) : (
          <div className="space-y-8">
            {/* 目標選択 */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#f0f6fc]">記録カレンダー</h2>
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