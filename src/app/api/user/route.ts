// src/app/api/user/route.ts
// Zeile ~4-28 ändern:

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export const revalidate = 60; // Cache für 60 Sekunden

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { 
          status: 401,
          headers: {
            'Cache-Control': 'private, no-cache, no-store, must-revalidate',
          }
        }
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
          genderFilter: user.genderFilter || 'both',
        }
      },
      { 
        status: 200,
        headers: {
          // Cache für eingeloggte Benutzer für 60 Sekunden
          'Cache-Control': 'private, max-age=60, stale-while-revalidate=300',
        }
      }
    );
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}