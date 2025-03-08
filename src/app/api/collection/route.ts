import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

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

    // Fetch user's collection without specifying purchasePrice
    const collection = await prisma.sneakerCollection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ collection });
  } catch (error) {
    console.error("Fehler beim Abrufen der Sammlung:", error);
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

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

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "Benutzer nicht gefunden." }, { status: 404 });
    }

    // Get sneaker data from request
    const {
      sneakerId,
      sneakerName,
      brand,
      model,
      imageUrl,
      sizeUS,
      sizeEU,
      sizeUK,
      condition,
      notes,
      purchaseDate,
      releaseDate,
    } = await req.json();

    // Create new collection entry
    const newCollectionEntry = await prisma.sneakerCollection.create({
      data: {
        userId,
        sneakerId,
        sneakerName,
        brand,
        model,
        imageUrl,
        sizeUS: parseFloat(sizeUS),
        sizeEU: parseFloat(sizeEU),
        sizeUK: parseFloat(sizeUK),
        condition,
        notes,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        releaseDate: releaseDate ? new Date(releaseDate) : null,
      },
    });

    return NextResponse.json({ 
      message: "Sneaker erfolgreich zur Sammlung hinzugefügt",
      collectionEntry: newCollectionEntry 
    });
  } catch (error) {
    console.error("Fehler beim Hinzufügen zur Sammlung:", error);
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}