'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useGoalStore } from '@/stores/goalStore';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorDisplay } from '@/components/common/ErrorDisplay';
import { Goal } from '@/types';

export default function GoalsPage() {
  const { data: session } = useSession();
  const { 
    goals, 
    isLoading, 
    error, 
    fetchGoals, 
    createGoal, 
    updateGoalAPI, 
    deleteGoalAPI,
    setError,
    clearGoals
  } = useGoalStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: 'green'
  });

  useEffect(() => {
    if (session) {
      fetchGoals();
    }
  }, [fetchGoals, session]);

  const handleCreateGoal = async () => {
    if (!formData.name.trim()) return;

    try {
      await createGoal({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        is_active: true
      });
      
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '', color: 'green' });
    } catch (error) {
      console.error('Failed to create goal:', error);
    }
  };

  const handleEditGoal = async () => {
    if (!editingGoal || !formData.name.trim()) return;

    try {
      await updateGoalAPI(editingGoal.id, {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color
      });
      
      setEditingGoal(null);
      setFormData({ name: '', description: '', color: 'green' });
    } catch (error) {
      console.error('Failed to update goal:', error);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('この目標を削除しますか？')) return;

    try {
      await deleteGoalAPI(goalId);
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  const openEditModal = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || '',
      color: goal.color
    });
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setEditingGoal(null);
    setFormData({ name: '', description: '', color: 'green' });
  };

  const colorOptions = [
    { value: 'green', label: '緑', class: 'bg-green-500' },
    { value: 'blue', label: '青', class: 'bg-blue-500' },
    { value: 'purple', label: '紫', class: 'bg-purple-500' },
    { value: 'red', label: '赤', class: 'bg-red-500' },
    { value: 'yellow', label: '黄', class: 'bg-yellow-500' },
    { value: 'pink', label: 'ピンク', class: 'bg-pink-500' },
  ];

  // 認証チェック
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h2>
          <p className="text-gray-600">このページにアクセスするにはログインしてください。</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#f0f6fc]">目標管理</h1>
            <p className="text-[#8b949e] mt-2">習慣化したい目標を作成・管理しましょう</p>
          </div>
          <div className="flex gap-3">
            {goals && goals.length > 0 && (
              <Button
                onClick={clearGoals}
                className="bg-[#da3633] hover:bg-[#b91c1c] text-white border-[#30363d]"
                variant="outline"
              >
                データをクリア
              </Button>
            )}
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#238636] hover:bg-[#2ea043] text-white"
            >
              新しい目標を作成
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorDisplay error={error} onDismiss={() => setError(null)} />
          </div>
        )}

        {!goals || goals.length === 0 ? (
          <Card className="p-12 text-center bg-[#161b22] border-[#30363d]">
            <div className="text-[#8b949e]">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium mb-2 text-[#f0f6fc]">目標がありません</h3>
              <p className="mb-4">最初の目標を作成して、習慣化を始めましょう</p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#238636] hover:bg-[#2ea043] text-white"
              >
                目標を作成
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {goals?.map((goal) => (
              <Card key={goal.id} className="p-6 hover:shadow-lg transition-shadow bg-[#161b22] border-[#30363d]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${colorOptions.find(c => c.value === goal.color)?.class || 'bg-green-500'}`} />
                    <h3 className="text-lg font-semibold text-[#f0f6fc]">{goal.name}</h3>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(goal)}
                      className="text-[#8b949e] hover:text-[#58a6ff] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-[#8b949e] hover:text-[#da3633] transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {goal.description && (
                  <p className="text-[#8b949e] text-sm mb-4">{goal.description}</p>
                )}
                
                <div className="flex items-center justify-between text-sm text-[#8b949e]">
                  <span>作成日: {new Date(goal.created_at).toLocaleDateString('ja-JP')}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    goal.is_active 
                      ? 'bg-[#238636] text-white' 
                      : 'bg-[#21262d] text-[#8b949e]'
                  }`}>
                    {goal.is_active ? 'アクティブ' : '非アクティブ'}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* 作成モーダル */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={closeModals}
          title="新しい目標を作成"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#f0f6fc] mb-2">
                目標名 *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="目標名を入力してください"
                className="w-full bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#f0f6fc] mb-2">
                説明
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="目標の詳細や動機を記入してください"
                className="w-full bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#f0f6fc] mb-2">
                色
              </label>
              <div className="flex space-x-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      formData.color === color.value ? 'ring-2 ring-gray-400' : ''
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onClick={closeModals}
              variant="outline"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleCreateGoal}
              disabled={!formData.name.trim()}
              className="bg-[#238636] hover:bg-[#2ea043] text-white"
            >
              作成
            </Button>
          </div>
        </Modal>

        {/* 編集モーダル */}
        <Modal
          isOpen={!!editingGoal}
          onClose={closeModals}
          title="目標を編集"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#f0f6fc] mb-2">
                目標名 *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="目標名を入力してください"
                className="w-full bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#f0f6fc] mb-2">
                説明
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="目標の詳細や動機を記入してください"
                className="w-full bg-[#21262d] border-[#30363d] text-[#f0f6fc]"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#f0f6fc] mb-2">
                色
              </label>
              <div className="flex space-x-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setFormData({ ...formData, color: color.value })}
                    className={`w-8 h-8 rounded-full ${color.class} ${
                      formData.color === color.value ? 'ring-2 ring-gray-400' : ''
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onClick={closeModals}
              variant="outline"
            >
              キャンセル
            </Button>
            <Button
              onClick={handleEditGoal}
              disabled={!formData.name.trim()}
              className="bg-[#238636] hover:bg-[#2ea043] text-white"
            >
              更新
            </Button>
          </div>
        </Modal>
      </div>
    </div>
  );
}