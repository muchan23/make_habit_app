import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/records - 記録一覧取得
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized'}, {status:401});
        }

        const { searchParams } = new URL(request.url);
        const goalId = searchParams.get('goal_id');
        const date = searchParams.get('date');

        const where: any = {
            user_id: session.user.id,
        };

        if (goalId) {
            where.goal_id = goalId;
        }

        if (date) {
            where.date = new Date(date);
        }

        const records = await prisma.record.findMany({
            where,
            orderBy: {
                date: 'desc',
            },
        });

        return NextResponse.json(records);
    } catch (error) {
        console.error('Error fetching records:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// POST /api/records - 記録作成
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized '}, {status:401})
        }

        const body = await request.json();
        const { goal_id, date, status, duration_minutes, notes } = body;

        if (!goal_id || !date) {
            return NextResponse.json(
                { error: 'Goal ID and date are required'},
                { status: 400 }
            );
        }

        // 目標がユーザーのものかチェック
        const goal = await prisma.goal.findFirst({
            where: {
                id: goal_id,
                user_id: session.user.id,
            }
        });

        if (!goal) {
            return NextResponse.json(
                { error: 'Goal not found'},
                { status: 404 }
            )
        }

        const record = await prisma.record.upsert({
            where: {
              goal_id_date: {
                goal_id,
                date: new Date(date),
              },
            },
            update: {
              status: status || 'COMPLETED',
              duration_minutes: duration_minutes || 0,
              notes,
            },
            create: {
              goal_id,
              user_id: session.user.id,
              date: new Date(date),
              status: status || 'COMPLETED',
              duration_minutes: duration_minutes || 0,
              notes,
            },
          });

          return NextResponse.json(record, { status: 201 });
    } catch (error) {
        console.error('Error creating record:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}