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

    // 一時的なダミーデータを返す（データベース認証問題のため）
    const records = [
      {
        id: '1',
        goal_id: '1',
        user_id: session.user.id,
        date: new Date().toISOString().split('T')[0],
        status: 'COMPLETED',
        duration_minutes: 30,
        notes: '今日も頑張りました',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        goal_id: '2', 
        user_id: session.user.id,
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        status: 'COMPLETED',
        duration_minutes: 60,
        notes: 'ジムで筋トレ',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];

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
