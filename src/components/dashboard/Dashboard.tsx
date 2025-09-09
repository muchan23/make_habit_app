'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              HabitTracker
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                こんにちは、{session?.user?.name}さん
              </span>
              <button className="text-sm text-gray-500 hover:text-gray-700">
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 目標一覧 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                目標一覧
              </h2>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">英語学習</h3>
                  <p className="text-sm text-gray-500">毎日30分の英語学習</p>
                </div>
                <div className="p-3 border rounded-lg">
                  <h3 className="font-medium">運動</h3>
                  <p className="text-sm text-gray-500">週3回のジム通い</p>
                </div>
              </div>
            </div>
          </div>

          {/* カレンダー表示 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                GitHub風カレンダー
              </h2>
              <div className="grid grid-cols-7 gap-1">
                {/* カレンダーの日付セル */}
                {Array.from({ length: 30 }, (_, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 bg-gray-200 rounded-sm"
                    title={`${i + 1}日目`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}