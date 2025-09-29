import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('goal_id');

    // データベースから実際の記録を取得
    const records = await prisma.record.findMany({
      where: {
        user_id: session.user.id,
        ...(goalId && { goal_id: goalId }),
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error('Records API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    // データベースに実際のデータを保存
    const newRecord = await prisma.record.create({
      data: {
        goal_id: body.goal_id,
        user_id: session.user.id,
        date: new Date(body.date),
        status: body.status,
        duration_minutes: body.duration_minutes,
        notes: body.notes,
      },
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('Records POST API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
