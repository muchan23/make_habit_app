'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Modal } from '@/components/ui/Modal';
import { useRecordStore } from '@/stores/recordStore';
import { useGoalStore } from '@/stores/goalStore';
import { Record } from '@/types';

interface RecordFormProps {
    isOpen: boolean;
    onClose: () => void;
    selectedDate?: Date;
    goalId?: string;
    existingRecord?: Record;
}

export function RecordForm({
    isOpen,
    onClose,
    selectedDate,
    goalId,
    existingRecord,
}: RecordFormProps) {
    const { data: session } = useSession();
    const { createRecordAPI, updateRecordAPI } = useRecordStore();
    const { goals } = useGoalStore();

    const [formData, setFormData] = useState({
        goal_id: goalId || '',
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: 'COMPLETED' as 'COMPLETED' | 'SKIPPED',
        duration_minutes: existingRecord?.duration_minutes || 0,
        notes: existingRecord?.notes || '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // フォームデータの初期化
    useEffect(() => {
        if (existingRecord) {
            setFormData({
                goal_id: existingRecord.goal_id,
                date: new Date(existingRecord.date).toISOString().split('T')[0],
                status: existingRecord.status,
                duration_minutes: existingRecord.duration_minutes,
                notes: existingRecord.notes || '',
            });
        } else {
            setFormData({
                goal_id: goalId || '',
                date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                status: 'COMPLETED',
                duration_minutes: 0,
                notes: '',
            });
        }
    }, [existingRecord, goalId, selectedDate, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (existingRecord) {
                await updateRecordAPI(existingRecord.id, {
                    status: formData.status,
                    duration_minutes: formData.duration_minutes,
                    notes: formData.notes,
                });
            } else {
                if (!session?.user?.id) {
                    throw new Error('ユーザーがログインしていません');
                }
                await createRecordAPI({
                    goal_id: formData.goal_id,
                    user_id: session.user.id,
                    date: new Date(formData.date),
                    status: formData.status,
                    duration_minutes: formData.duration_minutes,
                    notes: formData.notes,
                });
            }
            onClose();
        } catch (error) {
            console.error('Failed to save record:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            goal_id: goalId || '',
            date: selectedDate ? selectedDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: 'COMPLETED',
            duration_minutes: 0,
            notes: '',
        });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={existingRecord ? '記録を編集' : '記録を追加'}
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {!goalId && (
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            目標 *
                        </label>
                        <select
                            value={formData.goal_id}
                            onChange={(e) => setFormData({ ...formData, goal_id: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                            required
                        >
                            <option value="">目標を選択してください</option>
                            {goals.map((goal) => (
                                <option key={goal.id} value={goal.id}>
                                    {goal.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        日付 *
                    </label>
                    <Input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ステータス
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as 'COMPLETED' | 'SKIPPED' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    >
                        <option value="COMPLETED">完了</option>
                        <option value="SKIPPED">スキップ</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        実行時間（分）
                    </label>
                    <Input
                        type="number"
                        min="0"
                        value={formData.duration_minutes}
                        onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
                        placeholder="例: 30"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        メモ
                    </label>
                    <Textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="感想や気づきを記入してください"
                        rows={3}
                    />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <Button
                        type="button"
                        onClick={handleClose}
                        variant="outline"
                        className="text-gray-700"
                    >
                        キャンセル
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting || (!goalId && !formData.goal_id)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? '保存中...' : '保存'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
} 