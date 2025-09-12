import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/stats/percentiles - パーセンタイル計算
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('goal_id');
    const period = searchParams.get('period') || '3months';

    if (!goalId) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    // 期間の計算
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case '1month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case '6months':
        startDate.setMonth(startDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(startDate.getMonth() - 3);
    }

    // 実行時間のデータを取得
    const records = await prisma.record.findMany({
      where: {
        goal_id: goalId,
        user_id: session.user.id,
        status: 'COMPLETED',
        duration_minutes: { gt: 0 },
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        duration_minutes: true,
      },
      orderBy: {
        duration_minutes: 'asc',
      },
    });

    if (records.length === 0) {
      return NextResponse.json({
        p25: 0,
        p50: 0,
        p75: 0,
        totalRecords: 0,
      });
    }

    const durations = records.map(r => r.duration_minutes);
    const len = durations.length;

    const percentiles = {
      p25: durations[Math.floor(len * 0.25)],
      p50: durations[Math.floor(len * 0.5)],
      p75: durations[Math.floor(len * 0.75)],
      totalRecords: len,
    };

    return NextResponse.json(percentiles);
  } catch (error) {
    console.error('Error calculating percentiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}