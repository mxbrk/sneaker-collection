import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Modified validation schema to better handle arrays and null values
const updateCollectionSchema = z.object({
  sizeUS: z.string(),
  sizeEU: z.string().nullable().optional(),
  sizeUK: z.string().nullable().optional(),
  condition: z.string(),
  purchaseDate: z.string().nullable().optional(),
  purchasePrice: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  sneakerId: z.string(),
  sku: z.string(),
  brand: z.string(),
  title: z.string(),
  colorway: z.string().optional().default(''),
  image: z.string().nullable().optional(),
  retailPrice: z.number().nullable().optional(),
  labels: z.array(z.string()).optional(),
});

// GET - Get a specific collection item
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
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
        id: context.params.id,
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
    console.log('Update request body:', {
      ...body,
      purchaseDate: body.purchaseDate ? 'date present' : 'null/undefined',
      labels: Array.isArray(body.labels) ? `${body.labels.length} labels` : 'not an array',
    });
    
    // Validate the request body
    const result = updateCollectionSchema.safeParse(body);
    if (!result.success) {
      console.log('Validation error details:', result.error.format());
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;
    
    // Convert purchase date string to Date if provided
    let purchaseDate = null;
    if (data.purchaseDate) {
      try {
        purchaseDate = new Date(data.purchaseDate);
      } catch (dateError) {
        console.error('Date conversion error:', dateError);
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        );
      }
    }

    // Update the collection item
    try {
      // Ensure labels is properly handled
      const labels = Array.isArray(data.labels) ? data.labels : [];
      
      // Create update data with proper null handling
      const updateData = {
        sizeUS: data.sizeUS,
        sizeEU: data.sizeEU || null,
        sizeUK: data.sizeUK || null,
        condition: data.condition,
        purchaseDate,
        purchasePrice: data.purchasePrice || null,
        notes: data.notes || null,
        labels,
      };

      console.log('Final update data:', {
        ...updateData,
        purchaseDate: updateData.purchaseDate ? 'date present' : 'null',
        labels: `${updateData.labels.length} labels`,
      });

      const updatedItem = await prisma.collection.update({
        where: {
          id: params.id,
        },
        data: updateData,
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
      console.error('Error details:', dbError instanceof Error ? dbError.message : 'Unknown error');
      
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

// DELETE - Remove from collection
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