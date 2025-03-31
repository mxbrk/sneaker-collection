// src/app/api/wishlist/route.ts
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for adding to wishlist
const addToWishlistSchema = z.object({
  sneakerId: z.string(),
  sku: z.string(),
  brand: z.string(),
  title: z.string(),
  colorway: z.string().optional().default(''),
  image: z.string().optional(),
});

// GET - Get user's wishlist
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ wishlist }, { status: 200 });
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add to wishlist
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();  
    // Validate the request body
    const result = addToWishlistSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;
    // Check if already in wishlist
    const existing = await prisma.wishlist.findFirst({
      where: {
        userId: user.id,
        sneakerId: data.sneakerId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'This sneaker is already in your wishlist' },
        { status: 409 }
      );
    }

    try {
      // Add to wishlist
      const wishlistItem = await prisma.wishlist.create({
        data: {
          userId: user.id,
          sneakerId: data.sneakerId,
          sku: data.sku,
          brand: data.brand,
          title: data.title,
          colorway: data.colorway,
          image: data.image,
        },
      });
      
      return NextResponse.json(
        { 
          message: 'Added to wishlist successfully',
          item: wishlistItem
        },
        { status: 201 }
      );
    } catch (dbError) {
      return NextResponse.json(
        { error: `Database error: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Missing wishlist item ID' },
        { status: 400 }
      );
    }

    // Verify ownership and delete
    const wishlistItem = await prisma.wishlist.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!wishlistItem) {
      return NextResponse.json(
        { error: 'Wishlist item not found or not authorized' },
        { status: 404 }
      );
    }

    await prisma.wishlist.delete({
      where: {
        id,
      },
    });

    return NextResponse.json(
      { message: 'Removed from wishlist successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}