import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// PUT /api/records/[id] - 記録更新
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized'}, {status: 401});
        }

        const body = await request.json();
        const { status, duration_minutes, notes} = body;

        const record = await prisma.record.updateMany({
            where: {
                id: params.id,
                user_id: session.user.id,
            },
            data: {
                ...(status && {status}),
                ...(duration_minutes !== undefined && { duration_minutes }),
                ...(notes !== undefined && { notes }),
            },
        });

        if (record.count === 0) {
            return NextResponse.json({ error: 'Record not found'}, {status: 404 });
        }

        const updatedRecord = await prisma.record.findUnique({
            where: { id: params.id },
        });

        return NextResponse.json(updatedRecord);
    } catch (error) {
        console.error('Error updating record:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/records/[id] - 記録削除
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await getServerSession(authOptions);
      
      if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
  
      const record = await prisma.record.deleteMany({
        where: {
          id: params.id,
          user_id: session.user.id,
        },
      });
  
      if (record.count === 0) {
        return NextResponse.json({ error: 'Record not found' }, { status: 404 });
      }
  
      return NextResponse.json({ message: 'Record deleted successfully' });
    } catch (error) {
      console.error('Error deleting record:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }