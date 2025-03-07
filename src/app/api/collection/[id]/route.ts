import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// DELETE endpoint to remove a sneaker from collection
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    const id = params.id;

    if (!token) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    let userId: string;
    try {
      const decodedToken = verifyToken(token) as { userId: string };
      userId = decodedToken.userId;
    } catch (error) {
      return NextResponse.json({ error: "Ungültiges Token." }, { status: 401 });
    }

    // Check if the collection item exists and belongs to the user
    const collectionItem = await prisma.sneakerCollection.findUnique({
      where: { id },
    });

    if (!collectionItem) {
      return NextResponse.json({ error: "Eintrag nicht gefunden." }, { status: 404 });
    }

    if (collectionItem.userId !== userId) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 403 });
    }

    // Delete the collection item
    await prisma.sneakerCollection.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Sneaker erfolgreich aus der Sammlung entfernt" });
  } catch (error) {
    console.error("Fehler beim Löschen aus der Sammlung:", error);
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}

// GET endpoint to get a single sneaker from collection
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];
    const id = params.id;

    if (!token) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    let userId: string;
    try {
      const decodedToken = verifyToken(token) as { userId: string };
      userId = decodedToken.userId;
    } catch (error) {
      return NextResponse.json({ error: "Ungültiges Token." }, { status: 401 });
    }

    // Get the collection item
    const collectionItem = await prisma.sneakerCollection.findUnique({
      where: { id },
    });

    if (!collectionItem) {
      return NextResponse.json({ error: "Eintrag nicht gefunden." }, { status: 404 });
    }

    if (collectionItem.userId !== userId) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 403 });
    }

    return NextResponse.json({ collectionItem });
  } catch (error) {
    console.error("Fehler beim Abrufen des Sammlungselements:", error);
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}