// src/app/api/collection/route.ts
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for adding to collection
const addToCollectionSchema = z.object({
  sneakerId: z.string(),
  sku: z.string(),
  brand: z.string(),
  title: z.string(),
  colorway: z.string().optional().default(''),
  image: z.string().optional(),
  sizeUS: z.string(),
  sizeEU: z.string().optional(),
  sizeUK: z.string().optional(),
  condition: z.string(),
  purchaseDate: z.string().optional(),
  retailPrice: z.number().optional().nullable(),
  purchasePrice: z.number().optional(),
  notes: z.string().optional(),
});

// GET - Get user's collection
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const collection = await prisma.collection.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ collection }, { status: 200 });
  } catch (error) {
    console.error('Collection fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Add to collection
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
    console.log('Request body:', body);
    
    // Validate the request body
    const result = addToCollectionSchema.safeParse(body);
    if (!result.success) {
      console.log('Validation error:', result.error.format());
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;
    console.log('Parsed data:', data);
    
    // Convert purchase date string to Date if provided
    let purchaseDate;
    try {
      purchaseDate = data.purchaseDate ? new Date(data.purchaseDate) : undefined;
      console.log('Purchase date:', purchaseDate);
    } catch (dateError) {
      console.error('Date conversion error:', dateError);
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Add to collection
// Add to collection
try {
  const collectionItem = await prisma.collection.create({
    data: {
      userId: user.id,
      sneakerId: data.sneakerId,
      sku: data.sku,
      brand: data.brand,
      title: data.title,
      colorway: data.colorway,
      image: data.image,
      sizeUS: data.sizeUS,
      sizeEU: data.sizeEU,
      sizeUK: data.sizeUK,
      condition: data.condition,
      purchaseDate,
      retailPrice: data.retailPrice ?? null,
      purchasePrice: data.purchasePrice ?? null,
      notes: data.notes ?? null,
    },
  });
  console.log('Created collection item:', collectionItem);
  return NextResponse.json(
    { 
      message: 'Added to collection successfully',
      item: collectionItem
    },
    { status: 201 }
  );
} catch (dbError) {
  console.error('Database error:', dbError);
  return NextResponse.json(
    { error: `Database error: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}` },
    { status: 500 }
  );
}
  } catch (error) {
    console.error('Add to collection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}