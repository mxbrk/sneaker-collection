import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Execute database queries in parallel
    const [collection, wishlist] = await Promise.all([
      prisma.collection.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.wishlist.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      })
    ]);

    const totalValue = collection.reduce(
      (total, item) => total + (item.purchasePrice || 0), 
      0
    );

    return NextResponse.json({ 
      user, 
      collection, 
      wishlist, 
      totalValue 
    });
  } catch (error) {
    console.error('Profile data fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}