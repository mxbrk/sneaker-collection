import { getCurrentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

// In src/app/api/user/route.ts, modify the GET function:

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt,
          showKidsShoes: user.showKidsShoes,
          genderFilter: user.genderFilter || 'both', // Add this line
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}