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
      console.log('Session user ID:', session.user.id);
      
      hasFetched.current = true;
      
      // 非同期処理を適切に処理
      const fetchData = async () => {
        try {
          console.log('Starting data fetch...');
          await Promise.all([fetchGoals(), fetchRecords()]);
          console.log('Data fetch completed successfully');
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
      
      fetchData();
    }
  }, [session?.user?.id]); // 関数を依存配列から除外

  const isLoading = status === 'loading' || goalsLoading || recordsLoading;
  const error = goalsError || recordsError;

  // デバッグログを追加
  console.log('Dashboard Debug Info:', {
    sessionStatus: status,
    sessionUser: session?.user,
    goalsLoading,
    recordsLoading,
    goalsError,
    recordsError,
    goalsCount: goals?.length || 0,
    goalsIsNull: goals === null,
    selectedGoal: selectedGoal?.id
  });

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
        ) : goals === null ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-[#8b949e]">データを読み込み中...</span>
            </div>
          </div>
        ) : goals.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-[#f0f6fc] mb-2">目標がありません</h2>
              <p className="text-[#8b949e] mb-4">まずは目標を作成してください。</p>
              <a 
                href="/goals" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                目標を作成する
              </a>
            </div>
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