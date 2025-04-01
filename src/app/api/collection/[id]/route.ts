import { z } from 'zod';
import { type NextRequest, NextResponse } from 'next/server';
import { getPrismaClient } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

// Enhanced validation schema with more robust type checking
const collectionItemSchema = z.object({
  sizeUS: z.string().min(1, 'Size is required'),
  sizeEU: z.string().optional().nullable(),
  sizeUK: z.string().optional().nullable(),
  condition: z.string().min(1, 'Condition is required'),
  purchaseDate: z.string().datetime().optional().nullable(),
  purchasePrice: z.number().positive().optional().nullable(),
  notes: z.string().max(500, 'Notes are too long').optional().nullable(),
  sneakerId: z.string().min(1, 'Sneaker ID is required'),
  sku: z.string().min(1, 'SKU is required'),
  brand: z.string().min(1, 'Brand is required'),
  title: z.string().min(1, 'Title is required'),
  colorway: z.string().optional().default(''),
  image: z.string().url().optional().nullable(),
  retailPrice: z.number().positive().optional().nullable(),
  labels: z.array(z.string()).optional().default([])
});

// Type for the route handler function
type RouteHandler = (
  request: NextRequest, 
  context: { params: { id: string } }
) => Promise<NextResponse>;

// Centralized error handling
function handleError(error: unknown, context: string): NextResponse {
  console.error(`${context} error:`, error);
  
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { 
        error: 'Validation failed', 
        details: error.flatten().fieldErrors 
      }, 
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { error: 'Internal server error', details: String(error) },
    { status: 500 }
  );
}

// Async wrapper for route handlers to ensure consistent error handling
function withErrorHandling(
  handler: RouteHandler
): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error, 'Route handler');
    }
  };
}

// GET handler for fetching a specific collection item
export const GET = withErrorHandling(async (
  _request: NextRequest, 
  context: { params: { id: string } }
) => {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const prisma = getPrismaClient();
  const collectionItem = await prisma.collection.findUnique({
    where: {
      id: context.params.id,
      userId: user.id
    }
  });

  if (!collectionItem) {
    return NextResponse.json(
      { error: 'Collection item not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ item: collectionItem });
});

// PUT handler for updating a collection item
export const PUT = withErrorHandling(async (
  request: NextRequest, 
  context: { params: { id: string } }
) => {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const prisma = getPrismaClient();
  
  // Validate ownership first
  const existingItem = await prisma.collection.findUnique({
    where: {
      id: context.params.id,
      userId: user.id
    }
  });

  if (!existingItem) {
    return NextResponse.json(
      { error: 'Collection item not found or not authorized' },
      { status: 404 }
    );
  }

  // Parse and validate request body
  const body = await request.json();
  const validationResult = collectionItemSchema.safeParse(body);

  if (!validationResult.success) {
    return NextResponse.json(
      { 
        error: 'Validation failed', 
        details: validationResult.error.flatten().fieldErrors 
      },
      { status: 400 }
    );
  }

  const data = validationResult.data;

  // Prepare update data with null handling
  const updateData = {
    sizeUS: data.sizeUS,
    sizeEU: data.sizeEU || null,
    sizeUK: data.sizeUK || null,
    condition: data.condition,
    purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
    purchasePrice: data.purchasePrice || null,
    notes: data.notes || null,
    labels: data.labels || [],
  };

  // Perform update
  const updatedItem = await prisma.collection.update({
    where: { id: context.params.id },
    data: updateData
  });

  return NextResponse.json({ 
    message: 'Collection item updated successfully',
    item: updatedItem 
  });
});

// DELETE handler for removing a collection item
export const DELETE = withErrorHandling(async (
  _request: NextRequest, 
  context: { params: { id: string } }
) => {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const prisma = getPrismaClient();
  
  // Validate ownership first
  const existingItem = await prisma.collection.findUnique({
    where: {
      id: context.params.id,
      userId: user.id
    }
  });

  if (!existingItem) {
    return NextResponse.json(
      { error: 'Collection item not found or not authorized' },
      { status: 404 }
    );
  }

  // Delete the item
  await prisma.collection.delete({
    where: { id: context.params.id }
  });

  return NextResponse.json({ 
    message: 'Removed from collection successfully' 
  });
});