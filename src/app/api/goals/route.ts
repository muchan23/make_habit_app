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
    const goals = [
      {
        id: '1',
        name: '英語学習',
        description: '毎日30分の英語学習',
        is_active: true,
        created_at: new Date().toISOString(),
      },
      {
        id: '2', 
        name: '運動',
        description: '週3回のジム通い',
        is_active: true,
        created_at: new Date().toISOString(),
      }
    ];

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Goals API Error:', error);
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
    const newGoal = {
      id: Date.now().toString(),
      ...body,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error('Goals POST API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
