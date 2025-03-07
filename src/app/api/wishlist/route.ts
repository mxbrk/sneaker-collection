// src/app/api/wishlist/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET endpoint to retrieve user's wishlist items
export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId;
    try {
      const decodedToken = verifyToken(token) as { userId: string };
      userId = decodedToken.userId;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items: wishlistItems });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST endpoint to add a sneaker to the wishlist
export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let userId;
    try {
      const decodedToken = verifyToken(token) as { userId: string };
      userId = decodedToken.userId;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { sneakerId, sneakerName, brand, imageUrl, size } = await req.json();

    if (!sneakerId || !sneakerName || !brand || !size) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the item already exists in the wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        userId,
        sneakerId,
        size,
      },
    });

    if (existingItem) {
      return NextResponse.json(
        { error: "This sneaker is already in your wishlist with this size" },
        { status: 409 }
      );
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId,
        sneakerId,
        sneakerName,
        brand,
        imageUrl,
        size,
      },
    });

    return NextResponse.json({ 
      message: "Sneaker added to wishlist",
      item: wishlistItem 
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE endpoint to remove a sneaker from the wishlist
export async function DELETE(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
    }

    let userId;
    try {
      const decodedToken = verifyToken(token) as { userId: string };
      userId = decodedToken.userId;
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Make sure the item belongs to the user
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!wishlistItem) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Delete the item
    await prisma.wishlistItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}