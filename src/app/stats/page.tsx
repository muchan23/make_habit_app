'use client';

import { useState, useEffect } from 'react';
import { useGoalStore } from '@/stores/goalStore';
import { useRecordStore } from '@/stores/recordStore';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { Goal } from '@/types';

interface StatsData {
  totalGoals: number;
  activeGoals: number;
  totalRecords: number;
  averageCompletionRate: number;
  longestStreak: number;
  currentStreak: number;
  totalTimeSpent: number;
  averageTimePerSession: number;
}

interface GoalStats {
  goal: Goal;
  completionRate: number;
  totalRecords: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number;
  averageTimePerSession: number;
}

export default function StatsPage() {
  const { goals, isLoading: goalsLoading, error: goalsError, fetchGoals } = useGoalStore();
  const { records, isLoading: recordsLoading, error: recordsError, fetchRecords } = useRecordStore();
  
  const [statsData, setStatsData] = useState<StatsData | null>(null);
  const [goalStats, setGoalStats] = useState<GoalStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([fetchGoals(), fetchRecords()]);
      } catch (err) {
        setError('データの読み込みに失敗しました');
        console.error('Failed to load data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [fetchGoals, fetchRecords]);

  useEffect(() => {
    if (goals && records) {
      calculateStats();
    }
  }, [goals, records]);

  const calculateStats = () => {
    if (!goals || !records) return;

    const activeGoals = goals.filter(goal => goal.is_active);
    const totalRecords = records.length;
    
    // 全体の達成率を計算
    const completedRecords = records.filter(record => record.status === 'COMPLETED');
    const averageCompletionRate = totalRecords > 0 ? (completedRecords.length / totalRecords) * 100 : 0;

    // 連続実行日数を計算
    const sortedRecords = records
      .filter(record => record.status === 'COMPLETED')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const record of sortedRecords) {
      const recordDate = new Date(record.date);
      
      if (lastDate) {
        const daysDiff = Math.floor((recordDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff === 1) {
          tempStreak++;
        } else if (daysDiff > 1) {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      
      lastDate = recordDate;
    }

    longestStreak = Math.max(longestStreak, tempStreak);
    
    // 現在の連続実行日数を計算（今日から逆算）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasRecord = records.some(record => {
        const recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return recordDate.getTime() === checkDate.getTime() && record.status === 'COMPLETED';
      });
      
      if (hasRecord) {
        currentStreak++;
      } else if (i > 0) {
        break;
      }
    }

    // 実行時間の統計
    const totalTimeSpent = records
      .filter(record => record.status === 'COMPLETED')
      .reduce((sum, record) => sum + (record.duration_minutes || 0), 0);
    
    const averageTimePerSession = completedRecords.length > 0 
      ? totalTimeSpent / completedRecords.length 
      : 0;

    setStatsData({
      totalGoals: goals.length,
      activeGoals: activeGoals.length,
      totalRecords,
      averageCompletionRate,
      longestStreak,
      currentStreak,
      totalTimeSpent,
      averageTimePerSession
    });

    // 目標別の統計を計算
    const goalStatsData: GoalStats[] = goals.map(goal => {
      const goalRecords = records.filter(record => record.goal_id === goal.id);
      const completedGoalRecords = goalRecords.filter(record => record.status === 'COMPLETED');
      const completionRate = goalRecords.length > 0 ? (completedGoalRecords.length / goalRecords.length) * 100 : 0;
      
      const goalTimeSpent = completedGoalRecords.reduce((sum, record) => sum + (record.duration_minutes || 0), 0);
      const averageTimePerSession = completedGoalRecords.length > 0 
        ? goalTimeSpent / completedGoalRecords.length 
        : 0;

      // 目標別の連続実行日数
      const sortedGoalRecords = goalRecords
        .filter(record => record.status === 'COMPLETED')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      let goalCurrentStreak = 0;
      let goalLongestStreak = 0;
      let tempGoalStreak = 0;
      let lastGoalDate: Date | null = null;

      for (const record of sortedGoalRecords) {
        const recordDate = new Date(record.date);
        
        if (lastGoalDate) {
          const daysDiff = Math.floor((recordDate.getTime() - lastGoalDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff === 1) {
            tempGoalStreak++;
          } else if (daysDiff > 1) {
            goalLongestStreak = Math.max(goalLongestStreak, tempGoalStreak);
            tempGoalStreak = 1;
          }
        } else {
          tempGoalStreak = 1;
        }
        
        lastGoalDate = recordDate;
      }

      goalLongestStreak = Math.max(goalLongestStreak, tempGoalStreak);

      // 現在の連続実行日数（目標別）
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        
        const hasRecord = goalRecords.some(record => {
          const recordDate = new Date(record.date);
          recordDate.setHours(0, 0, 0, 0);
          return recordDate.getTime() === checkDate.getTime() && record.status === 'COMPLETED';
        });
        
        if (hasRecord) {
          goalCurrentStreak++;
        } else if (i > 0) {
          break;
        }
      }

      return {
        goal,
        completionRate,
        totalRecords: goalRecords.length,
        currentStreak: goalCurrentStreak,
        longestStreak: goalLongestStreak,
        totalTimeSpent: goalTimeSpent,
        averageTimePerSession
      };
    });

    setGoalStats(goalStatsData);
  };

  if (isLoading || goalsLoading || recordsLoading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || goalsError || recordsError) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
        <ErrorDisplay 
          error={error || goalsError || recordsError || '不明なエラーが発生しました'} 
          onDismiss={() => setError(null)} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#f0f6fc]">統計・分析</h1>
          <p className="text-[#8b949e] mt-2">あなたの習慣化の進捗を詳しく分析します</p>
        </div>

        {statsData && (
          <>
            {/* 全体統計 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6 bg-[#161b22] border-[#30363d]">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-[#21262d] rounded-lg flex items-center justify-center">
                      <span className="text-[#58a6ff] text-lg">🎯</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#8b949e]">アクティブな目標</p>
                    <p className="text-2xl font-semibold text-[#f0f6fc]">{statsData.activeGoals}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-[#161b22] border-[#30363d]">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-lg">📊</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">全体達成率</p>
                    <p className="text-2xl font-semibold text-gray-900">{statsData.averageCompletionRate.toFixed(1)}%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-[#161b22] border-[#30363d]">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 text-lg">🔥</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">現在の連続日数</p>
                    <p className="text-2xl font-semibold text-gray-900">{statsData.currentStreak}日</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-[#161b22] border-[#30363d]">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-purple-600 text-lg">⏱️</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">総実行時間</p>
                    <p className="text-2xl font-semibold text-gray-900">{Math.round(statsData.totalTimeSpent / 60)}時間</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* 詳細統計 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <Card className="p-6 bg-[#161b22] border-[#30363d]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">連続実行記録</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">最長連続日数</span>
                    <span className="text-xl font-semibold text-gray-900">{statsData.longestStreak}日</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">現在の連続日数</span>
                    <span className="text-xl font-semibold text-gray-900">{statsData.currentStreak}日</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">平均実行時間</span>
                    <span className="text-xl font-semibold text-gray-900">{Math.round(statsData.averageTimePerSession)}分</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-[#161b22] border-[#30363d]">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">活動サマリー</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">総記録数</span>
                    <span className="text-xl font-semibold text-gray-900">{statsData.totalRecords}回</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">総目標数</span>
                    <span className="text-xl font-semibold text-gray-900">{statsData.totalGoals}個</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">総実行時間</span>
                    <span className="text-xl font-semibold text-gray-900">{Math.round(statsData.totalTimeSpent / 60)}時間</span>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {/* 目標別統計 */}
        {goalStats.length > 0 && (
          <Card className="p-6 bg-[#161b22] border-[#30363d]">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">目標別詳細統計</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">目標</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">達成率</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">記録数</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">現在の連続</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">最長連続</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">総時間</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">平均時間</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {goalStats.map((stat) => (
                    <tr key={stat.goal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            stat.goal.color === 'green' ? 'bg-green-500' :
                            stat.goal.color === 'blue' ? 'bg-blue-500' :
                            stat.goal.color === 'purple' ? 'bg-purple-500' :
                            stat.goal.color === 'red' ? 'bg-red-500' :
                            stat.goal.color === 'yellow' ? 'bg-yellow-500' :
                            'bg-pink-500'
                          }`} />
                          <span className="text-sm font-medium text-gray-900">{stat.goal.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          stat.completionRate >= 80 ? 'text-green-600' :
                          stat.completionRate >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {stat.completionRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.totalRecords}回</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.currentStreak}日</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stat.longestStreak}日</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Math.round(stat.totalTimeSpent / 60)}時間</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Math.round(stat.averageTimePerSession)}分</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
            </div>
          </div>
      );
}
