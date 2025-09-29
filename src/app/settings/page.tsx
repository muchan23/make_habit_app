'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // 設定保存のロジック
    setTimeout(() => {
      setIsLoading(false);
      alert('設定を保存しました');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-[#f0f6fc]">設定</h1>

          {/* プロフィール設定 */}
          <Card className="p-6 bg-[#161b22] border-[#30363d]">
            <h2 className="text-lg font-medium text-[#f0f6fc] mb-4">プロフィール設定</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#f0f6fc] mb-2">
                  表示名
                </label>
                <Input
                  defaultValue={session?.user?.name || ''}
                  className="w-full max-w-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#f0f6fc] mb-2">
                  メールアドレス
                </label>
                <Input
                  defaultValue={session?.user?.email || ''}
                  disabled
                  className="w-full max-w-md bg-gray-100"
                />
                <p className="text-sm text-gray-500 mt-1">
                  メールアドレスは変更できません
                </p>
              </div>
            </div>
          </Card>

          {/* 通知設定 */}
          <Card className="p-6 bg-[#161b22] border-[#30363d]">
            <h2 className="text-lg font-medium text-[#f0f6fc] mb-4">通知設定</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">目標実行リマインダー</h3>
                  <p className="text-sm text-gray-500">毎日の目標実行をリマインドします</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-700">週間レポート</h3>
                  <p className="text-sm text-gray-500">週間の進捗レポートを送信します</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </Card>

          {/* データ管理 */}
          <Card className="p-6 bg-[#161b22] border-[#30363d]">
            <h2 className="text-lg font-medium text-[#f0f6fc] mb-4">データ管理</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">データエクスポート</h3>
                <p className="text-sm text-gray-500 mb-3">
                  あなたのデータをCSV形式でダウンロードできます
                </p>
                <Button variant="outline">データをエクスポート</Button>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">アカウント削除</h3>
                <p className="text-sm text-gray-500 mb-3">
                  アカウントとすべてのデータを削除します（この操作は取り消せません）
                </p>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  アカウントを削除
                </Button>
              </div>
            </div>
          </Card>

          {/* 保存ボタン */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isLoading}
                  className="bg-[#238636] hover:bg-[#2ea043] text-white"
            >
              {isLoading ? '保存中...' : '設定を保存'}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}