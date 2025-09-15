'use client'

import { useState, useEffect } from 'react';
import { useRecordStore } from '@/stores/recordStore';
import { useGoalStore } from '@/stores/goalStore';
import { Tooltip } from '@/components/ui/Tooltip';
import { RecordForm } from '@/components/records/RecordForm';

interface ContributionCalendarProps {
    goalId?: string;
    year?: number;
}

export function ContributionCalendar({ goalId, year = new Date().getFullYear() }: ContributionCalendarProps) {
    const { records, calculateColorLevel, fetchRecords } = useRecordStore();
    const { selectedGoal } = useGoalStore();
    const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
    const [isRecordFormOpen, setIsRecordFormOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);

    // カレンダーデータの生成
    const generateCalendarData = () => {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);
        const calendarData: { date: Date; level: number; record?: any }[] = [];

        // 1年間の日付を生成
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const date = new Date(d);
            const record  = records.find(r => {
                const recordDate = new Date(r.date);
                return recordDate.toDateString() === date.toDateString() &&
                    (!goalId || r.goal_id === goalId);
            });

            let level = 0;
            if (record) {
                level = calculateColorLevel(goalId || selectedGoal?.id || '', record.duration_minutes);
            }

            calendarData.push({ date, level, record });
        }

        return calendarData;
    };

    // 色のレベルに応じたCSSクラス
    const getColorClass = (level: number) => {
        switch (level) {
            case 0: return 'bg-gray-200';
            case 1: return 'bg-green-800';
            case 2: return 'bg-green-600';
            case 3: return 'bg-green-500';
            case 4: return 'bg-green-300';
            default: return 'bg-gray-200';
        }
    };

    // 日付クリック時の処理
    const handleDateClick = (date: Date, record?: any) => {
        setSelectedDate(date);
        setSelectedRecord(record);
        setIsRecordFormOpen(true);
    };

    // ツールチップの内容
    const getTooltipContent = (day: { date: Date; level: number; record?: any }) => {
        if (day.level === 0) {
            return `${day.date.toLocaleDateString('ja-JP')}: 未実行`;
        }

        const duration = day.record?.duration_minutes || 0;
        const hours = Math.floor(duration / 60);
        const minutes = duration % 60;
        const timeStr = hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;

        return (
            <div className="text-sm">
                <div className="font-semibold">{day.date.toLocaleDateString('ja-JP')}</div>
                <div>実行時間: {timeStr}</div>
                {day.record?.notes && <div>メモ: {day.record.notes}</div>}
            </div>
        );
    };

    const calendarData = generateCalendarData();

    return (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedGoal ? `${selectedGoal.name}の記録` : '全体の記録'}
            </h2>
            <div className="text-sm text-gray-500">
              {year}年
            </div>
          </div>
    
          {/* カレンダーグリッド */}
          <div className="grid grid-cols-53 gap-1 mb-4">
            {calendarData.map((day, index) => (
              <Tooltip
                key={index}
                content={getTooltipContent(day)}
                side="top"
              >
                <div
                  className={`w-3 h-3 rounded-sm cursor-pointer transition-colors ${getColorClass(day.level)}`}
                  onMouseEnter={() => setHoveredDate(day.date)}
                  onMouseLeave={() => setHoveredDate(null)}
                  onClick={() => handleDateClick(day.date, day.record)}
                />
              </Tooltip>
            ))}
          </div>
    
          {/* 凡例 */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>少ない</span>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-200 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-600 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-green-300 rounded-sm"></div>
            </div>
            <span>多い</span>
          </div>

          {/* 記録フォーム */}
          <RecordForm
            isOpen={isRecordFormOpen}
            onClose={() => {
              setIsRecordFormOpen(false);
              setSelectedDate(null);
              setSelectedRecord(null);
            }}
            selectedDate={selectedDate || undefined}
            goalId={goalId}
            existingRecord={selectedRecord}
          />
        </div>
      );
}