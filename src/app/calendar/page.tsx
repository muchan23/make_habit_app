'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function CalendarPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">カレンダー</h1>
            <Button className="bg-blue-600 hover:bg-blue-700">
              新しい予定を作成
            </Button>
          </div>

          <Card className="p-6">
            <div className="text-center py-12">
              <div className="text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="text-lg font-medium mb-2">カレンダー機能</h3>
                <p className="mb-4">カレンダー機能は現在開発中です</p>
                <p className="text-sm text-gray-400">
                  今後、Googleカレンダー連携や予定管理機能を追加予定です
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}