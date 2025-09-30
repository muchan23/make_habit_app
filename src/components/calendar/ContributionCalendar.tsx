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
            const record = records?.find(r => {
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

    // GitHub風の色のレベルに応じたCSSクラス
    const getColorClass = (level: number) => {
        switch (level) {
            case 0: return 'bg-[#161b22] border border-[#30363d]';
            case 1: return 'bg-[#0e4429]';
            case 2: return 'bg-[#006d32]';
            case 3: return 'bg-[#26a641]';
            case 4: return 'bg-[#39d353]';
            default: return 'bg-[#161b22] border border-[#30363d]';
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
        <div className="bg-[#0d1117] border border-[#30363d] rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#f0f6fc]">
              {selectedGoal ? `${selectedGoal.name}の記録` : '全体の記録'}
            </h2>
            <div className="text-sm text-[#8b949e]">
              {year}年
            </div>
          </div>
    
          {/* GitHub風カレンダーグリッド */}
          <div className="overflow-x-auto">
            <div className="inline-block">
              {/* 月のラベル */}
              <div className="flex mb-2">
                <div className="w-16"></div>
                <div className="grid grid-cols-53 gap-1" style={{ width: 'calc(53 * 12px + 52 * 4px)' }}>
                  {Array.from({ length: 53 }, (_, i) => {
                    const weekStart = new Date(year, 0, 1);
                    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (i * 7));
                    const month = weekStart.getMonth();
                    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    
                    // 月の最初の週のみ表示
                    const isFirstWeekOfMonth = weekStart.getDate() <= 7;
                    
                    return (
                      <div key={i} className="w-3 h-3 flex items-center justify-center">
                        {isFirstWeekOfMonth && (
                          <span className="text-xs text-[#8b949e]">{monthNames[month]}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              {/* カレンダーグリッド */}
              <div className="flex">
                <div className="w-16 flex flex-col gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <div key={day} className="w-3 h-3 flex items-center justify-start pl-2">
                      <span className="text-xs text-[#8b949e] leading-none">{day}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-1">
                  {Array.from({ length: 53 }, (_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1">
                      {Array.from({ length: 7 }, (_, dayIndex) => {
                        const totalIndex = weekIndex * 7 + dayIndex;
                        if (totalIndex >= calendarData.length) return null;
                        const day = calendarData[totalIndex];
                        return (
                          <Tooltip
                            key={`${weekIndex}-${dayIndex}`}
                            content={getTooltipContent(day)}
                            side="top"
                          >
                            <div
                              className={`w-3 h-3 rounded-sm cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-[#f0f6fc] hover:ring-opacity-50 ${getColorClass(day.level)}`}
                              onMouseEnter={() => setHoveredDate(day.date)}
                              onMouseLeave={() => setHoveredDate(null)}
                              onClick={() => handleDateClick(day.date, day.record)}
                            />
                          </Tooltip>
                        );
                      }).filter(Boolean)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* GitHub風凡例 */}
          <div className="flex items-center justify-between mt-4 text-sm text-[#8b949e]">
            <div className="flex items-center space-x-2">
              <span>Less</span>
              <div className="flex space-x-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <div
                    key={level}
                    className={`w-3 h-3 rounded-sm ${getColorClass(level)}`}
                  />
                ))}
              </div>
              <span>More</span>
            </div>
            <div className="text-xs">
              {calendarData.filter(day => day.level > 0).length} contributions in the last year
            </div>
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