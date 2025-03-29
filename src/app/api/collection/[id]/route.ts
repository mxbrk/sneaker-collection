// src/app/api/collection/[id]/route.ts (UPDATED)
import { getCurrentUser } from '@/lib/auth';
import { getValidLabelValues } from '@/lib/labels';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for updating collection items (updated with labels)
const updateCollectionSchema = z.object({
  sizeUS: z.string(),
  sizeEU: z.string().optional(),
  sizeUK: z.string().optional(),
  condition: z.string(),
  purchaseDate: z.string().optional(),
  purchasePrice: z.number().optional(),
  notes: z.string().optional(),
  // Include these for the update payload
  sneakerId: z.string(),
  sku: z.string(),
  brand: z.string(),
  title: z.string(),
  colorway: z.string().optional().default(''),
  image: z.string().optional(),
  retailPrice: z.number().optional().nullable(),
  labels: z.array(z.enum(getValidLabelValues() as [string, ...string[]])).optional(), // Add labels field
});

// GET - Get a specific collection item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const collectionItem = await prisma.collection.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!collectionItem) {
      return NextResponse.json(
        { error: 'Collection item not found or not authorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ item: collectionItem }, { status: 200 });
  } catch (error) {
    console.error('Get collection item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update a collection item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // First check if the item exists and belongs to the user
    const collectionItem = await prisma.collection.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!collectionItem) {
      return NextResponse.json(
        { error: 'Collection item not found or not authorized' },
        { status: 404 }
      );
    }

    const body = await request.json();
    console.log('Update request body:', body);
    
    // Validate the request body
    const result = updateCollectionSchema.safeParse(body);
    if (!result.success) {
      console.log('Validation error:', result.error.format());
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;
    
    // Convert purchase date string to Date if provided
    let purchaseDate;
    if (data.purchaseDate) {
      try {
        purchaseDate = new Date(data.purchaseDate);
      } catch (dateError) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        );
      }
    }

    // Update the collection item
    try {
      const updatedItem = await prisma.collection.update({
        where: {
          id: params.id,
        },
        data: {
          sizeUS: data.sizeUS,
          sizeEU: data.sizeEU || null,
          sizeUK: data.sizeUK || null,
          condition: data.condition,
          purchaseDate: purchaseDate || null,
          purchasePrice: data.purchasePrice || null,
          notes: data.notes || null,
          labels: data.labels || [], // Update labels
        },
      });

      return NextResponse.json(
        { 
          message: 'Collection item updated successfully',
          item: updatedItem
        },
        { status: 200 }
      );
    } catch (dbError) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: `Database error: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Update collection item error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Remove from collection (unchanged)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // First check if the item exists and belongs to the user
    const collectionItem = await prisma.collection.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!collectionItem) {
      return NextResponse.json(
        { error: 'Collection item not found or not authorized' },
        { status: 404 }
      );
    }

    // Delete the item
    await prisma.collection.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: 'Removed from collection successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Remove from collection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}