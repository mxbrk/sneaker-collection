// src/app/api/user/update/route.ts
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
});

export async function PUT(request: NextRequest) {
  console.log("PUT /api/user/update endpoint called");
  
  try {
    // Get the current authenticated user
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      console.log("User not authenticated");
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    console.log("Current user found:", currentUser.id);

    // Parse the request body
    const body = await request.json();
    console.log("Request body received:", { ...body, currentPassword: body.currentPassword ? "[REDACTED]" : undefined, newPassword: body.newPassword ? "[REDACTED]" : undefined });
    
    // Validate the request body
    const result = updateUserSchema.safeParse(body);
    if (!result.success) {
      console.log("Validation failed:", result.error.format());
      return NextResponse.json(
        { error: 'Validation failed', details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { username, email, currentPassword, newPassword } = result.data;
    console.log("Validated data:", { username, email, hasCurrentPassword: !!currentPassword, hasNewPassword: !!newPassword });
    
    // Check if email already exists (but not owned by the current user)
    if (email !== currentUser.email) {
      console.log("Checking for duplicate email:", email);
      const existingUserWithEmail = await prisma.user.findUnique({
        where: { email },
      });
      
      if (existingUserWithEmail && existingUserWithEmail.id !== currentUser.id) {
        console.log("Email already in use by another user");
        return NextResponse.json(
          { error: 'Email already in use', field: 'email' },
          { status: 409 }
        );
      }
    }
    
    // Check if username already exists (but not owned by the current user)
    if (username !== currentUser.username) {
      console.log("Checking for duplicate username:", username);
      const existingUserWithUsername = await prisma.user.findFirst({
        where: { 
          username,
          NOT: { id: currentUser.id }
        },
      });
      
      if (existingUserWithUsername) {
        console.log("Username already in use by another user");
        return NextResponse.json(
          { error: 'Username already in use', field: 'username' },
          { status: 409 }
        );
      }
    }
    
    // Prepare update data
    const updateData: any = {
      username,
      email,
    };
    
    // Handle password change if requested
    if (newPassword && currentPassword) {
      console.log("Password change requested, verifying current password");
      // Verify current password
      const isCurrentPasswordValid = await verifyPassword(
        currentPassword,
        currentUser.passwordHash
      );
      
      if (!isCurrentPasswordValid) {
        console.log("Current password verification failed");
        return NextResponse.json(
          { error: 'Current password is incorrect', field: 'currentPassword' },
          { status: 401 }
        );
      }
      
      // Hash the new password
      console.log("Current password verified, hashing new password");
      updateData.passwordHash = await hashPassword(newPassword);
    }
    
    // Update the user
    console.log("Updating user with data:", { ...updateData, passwordHash: updateData.passwordHash ? "[REDACTED]" : undefined });
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: updateData,
    });
    
    console.log("User updated successfully:", updatedUser.id);
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
    console.error('Update user error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}