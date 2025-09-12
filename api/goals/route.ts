import { NextRequest, NextResponse } from  'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/goals - 目標一覧取得
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const goals = await prisma.goal.findMany({
            where: {
                user_id: session.user.id,
                is_active: true,
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        return NextResponse.json(goals);
    } catch (error) {
        console.error('Error fetching goals:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

// POST /api/goals - 目標作成
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, color } = body;

        if (!name) {
            return NextResponse.json(
                { error: 'Name is required '},
                { status: 400 }
            );
        }

        const goal = await prisma.goal.create({
            data: {
                name,
                description,
                color: color || 'green',
                user_id: session.user.id,
            }
        });

        return NextResponse.json(goal, { status: 201 });
    } catch (error) {
        console.error('Error creating goal:', error);
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    );
    }
}