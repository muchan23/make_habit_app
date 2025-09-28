'use client';

import { useState } from 'react';
import { useRecordStore } from '@/stores/recordStore';
import { useGoalStore } from '@/stores/goalStore';
import { useRecords } from '@/hooks/useRecords';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { RecordForm } from './RecordForm';
import { Record } from '@/types';

interface RecordListProps {
    goalId?: string;
    limit?: number;
    showHeader?: boolean;
}

export function RecordList({ goalId, limit = 10, showHeader = true }: RecordListProps) {
    const { deleteRecordAPI } = useRecordStore();
    const { goals } = useGoalStore();
    const { records, isLoading, error } = useRecords(goalId);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<Record | null>(null);

    const filteredRecords = records
        .filter(record => !goalId || record.goal_id === goalId)
        .slice(0, limit);

    const handleEdit = (record: Record) => {
        setEditingRecord(record);
        setIsFormOpen(true);
    };

    const handleDelete = async (recordId: string) => {
        if (!confirm('この記録を削除しますか？')) return;
        
        try {
            await deleteRecordAPI(recordId);
        } catch (error) {
            console.error('Failed to delete record:', error);
        }
    };

    const getGoalName = (goalId: string) => {
        const goal = goals.find(g => g.id === goalId);
        return goal?.name || 'Unknown Goal';
    };

    const getGoalColor = (goalId: string) => {
        const goal = goals.find(g => g.id === goalId);
        return goal?.color || 'green';
    };

    const formatDuration = (minutes: number) => {
        if (minutes === 0) return '0分';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}時間${mins}分` : `${mins}分`;
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'short'
        });
    };

    if (isLoading) {
        return (
            <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-500">記録を読み込み中...</p>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="p-6 text-center">
                <div className="text-red-500">
                    <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="font-medium">エラーが発生しました</p>
                    <p className="text-sm mt-1">{error}</p>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {showHeader && (
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {goalId ? '記録一覧' : '最近の記録'}
                    </h3>
                    <Button
                        onClick={() => setIsFormOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        記録を追加
                    </Button>
                </div>
            )}

            {filteredRecords.length === 0 ? (
                <Card className="p-8 text-center">
                    <div className="text-gray-500">
                        <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="font-medium">記録がありません</p>
                        <p className="text-sm mt-1">最初の記録を追加しましょう</p>
                        <Button
                            onClick={() => setIsFormOpen(true)}
                            className="mt-4 bg-blue-600 hover:bg-blue-700"
                        >
                            記録を追加
                        </Button>
                    </div>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredRecords.map((record) => (
                        <Card key={record.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center space-x-3 mb-2">
                                        {!goalId && (
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-3 h-3 rounded-full bg-${getGoalColor(record.goal_id)}-500`} />
                                                <span className="text-sm font-medium text-gray-900">
                                                    {getGoalName(record.goal_id)}
                                                </span>
                                            </div>
                                        )}
                                        <span className="text-sm text-gray-500">
                                            {formatDate(record.date)}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            record.status === 'COMPLETED' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {record.status === 'COMPLETED' ? '完了' : 'スキップ'}
                                        </span>
                                    </div>
                                    
                                    {record.duration_minutes > 0 && (
                                        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span>実行時間: {formatDuration(record.duration_minutes)}</span>
                                        </div>
                                    )}
                                    
                                    {record.notes && (
                                        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                                            <div className="flex items-start space-x-2">
                                                <svg className="w-4 h-4 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                                </svg>
                                                <span>{record.notes}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => handleEdit(record)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                        title="編集"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(record.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        title="削除"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* 記録フォーム */}
            <RecordForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingRecord(null);
                }}
                goalId={goalId}
                existingRecord={editingRecord || undefined}
            />
        </div>
    );
}