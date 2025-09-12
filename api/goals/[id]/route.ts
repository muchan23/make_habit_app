import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/goals/[id] - 目標詳細取得
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string }}
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const goal = await prisma.goal.findFirst({
            where: {
                id: params.id,
                user_id: session.user.id,
            },
        });

        if (!goal) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        return NextResponse.json(goal);
    } catch (error) {
        console.error('Error fetching goal:', error);
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    );
    }
}

// PUT /api/goals/[id] - 目標更新
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { name, description, color, is_active } = body;

        const goal = await prisma.goal.updateMany({
            where: {
                id: params.id,
                user_id: session.user.id,
            },
            data: {
                ...(name && { name }),
                ...(description !== undefined && { description }),
                ...(color && { color }),
                ...(is_active !== undefined && { is_active }),
            },
        });

        if (goal.count === 0) {
            return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
        }

        const updatedGoal = await prisma.goal.findFirst({
            where: { id: params.id },
        })

        return NextResponse.json(updatedGoal);
    } catch (error) {
        console.error('Error updating goal:', error);
        return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    );
    }
}

// DELETE /api/goals/[id] - 目標削除
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const goal = await prisma.goal.deleteMany({
        where: {
          id: params.id,
          user_id: session.user.id,
        },
      });
  
      if (goal.count === 0) {
        return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Goal deleted successfully' });
    } catch (error) {
      console.error('Error deleting goal:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }