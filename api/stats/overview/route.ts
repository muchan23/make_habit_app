import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/stats/overview - 統計概要取得
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;

        // 目標数
        const totalGoals = await prisma.goal.count({
            where: { user_id: userId, is_active: true },
        });

        // 今月の記録数
        const currentMonth = new Date();
        currentMonth.setDate(1);
        const nextMonth = new Date(currentMonth);
        nextMonth.setMonth(currentMonth.getMonth() + 1);

        const monthlyRecords  = await prisma.record.count({
            where: {
                user_id: userId,
                status: 'COMPLETED',
                date: {
                    gte: currentMonth,
                    lt: nextMonth,
                },
            },
        });

        // 連続実行日数（最新の記録から計算）
        const latestRecord = await prisma.record.findFirst({
            where: {
            user_id: userId,
            status: 'COMPLETED',
            },
            orderBy: { date: 'desc' },
        });

        let currentStreak = 0;
        if (latestRecord) {
            const today = new Date();
            const recordDate = new Date(latestRecord.date);
            const diffTime = today.getTime() - recordDate.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays <= 1) {
                //　今日または昨日の記録がある場合、連続日数を計算
                const records = await prisma.record.findMany({
                    where: {
                        user_id: userId,
                        status: 'COMPLETED',
                    },
                    orderBy: { date: 'desc'},
                });

                let streak = 0;
                let currentDate = new Date();

                for (const record of records) {
                    const recordDate = new Date(record.date);
                    if (recordDate.toDateString() === currentDate.toDateString()) {
                        streak++;
                        currentDate.setDate(currentDate.getDate() - 1);
                    } else {
                        break;
                    }
                }

                currentStreak = streak;
            }
        }

        return NextResponse.json({
            totalGoals,
            monthlyRecords,
            currentStreak,
        });
    } catch (error) {
        console.error('Error fetching stats overview:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}