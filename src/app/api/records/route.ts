import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 一時的なダミーデータを返す
    const records = [
      {
        id: '1',
        goal_id: '1',
        date: new Date().toISOString().split('T')[0],
        status: 'completed',
        duration_minutes: 30,
        notes: '今日も頑張りました',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        goal_id: '2', 
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        status: 'completed',
        duration_minutes: 60,
        notes: 'ジムで筋トレ',
        created_at: new Date().toISOString(),
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
    
    // 一時的なダミーレスポンス
    const newRecord = {
      id: Date.now().toString(),
      ...body,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error('Records POST API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
