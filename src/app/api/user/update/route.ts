import { getCurrentUser, hashPassword, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for user updates
const updateUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
  showKidsShoes: z.boolean().optional(),
  genderFilter: z.enum(['men', 'women', 'both']).optional(),
});
interface UserUpdateData {
  username: string;
  email: string;
  passwordHash?: string;
  showKidsShoes?: boolean;
  genderFilter?: string;
}

export async function PUT(request: NextRequest) {
  
  try {
    // Get the current authenticated user
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }


    // Parse the request body
    const body = await request.json();
    
    // Validate the request body
    const result = updateUserSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { username, email, currentPassword, newPassword } = result.data;
    
    // Check if email already exists (but not owned by the current user)
    if (email !== currentUser.email) {
      const existingUserWithEmail = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUserWithEmail && existingUserWithEmail.id !== currentUser.id) {
        return NextResponse.json(
          { error: 'Email already in use', field: 'email' },
          { status: 409 }
        );
      }
    }
    
    // Check if username already exists (but not owned by the current user)
    if (username !== currentUser.username) {
      const existingUserWithUsername = await prisma.user.findFirst({
        where: { 
          username,
          NOT: { id: currentUser.id }
        },
      });
      
      if (existingUserWithUsername) {
        return NextResponse.json(
          { error: 'Username already in use', field: 'username' },
          { status: 409 }
        );
      }
    }
    
    // Prepare update data
    const updateData: UserUpdateData = {
      username,
      email,
    };
    // Add the showKidsShoes field if provided
    if (typeof result.data.showKidsShoes === 'boolean') {
      updateData.showKidsShoes = result.data.showKidsShoes;
    }

    if (result.data.genderFilter) {
      updateData.genderFilter = result.data.genderFilter;
    }
    
    // Handle password change if requested
    if (newPassword && currentPassword) {
      // Verify current password
      const isCurrentPasswordValid = await verifyPassword(
        currentPassword,
        currentUser.passwordHash
      );
      
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect', field: 'currentPassword' },
          { status: 401 }
        );
      }
      
      // Hash the new password
      updateData.passwordHash = await hashPassword(newPassword);
    }
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
    });
    
    return NextResponse.json(
      { 
        message: 'User updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}