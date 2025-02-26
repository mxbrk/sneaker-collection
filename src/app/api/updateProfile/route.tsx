import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { verifyToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  try {
    const { email, username, password } = await req.json();
    const token = req.headers.get("cookie")?.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = verifyToken(token);
    } catch (error) {
      return NextResponse.json({ error: "Ungültiges Token." }, { status: 401 });
    }

    if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.userId) {
      return NextResponse.json({ error: "Token ungültig oder abgelaufen." }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id: decodedToken.userId } });
    if (!user) {
      return NextResponse.json({ error: "Benutzer nicht gefunden." }, { status: 404 });
    }

    // Prüfen, ob E-Mail oder Benutzername bereits vergeben sind
    if (email || username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            email ? { email } : {},
            username ? { username } : {},
          ],
          NOT: { id: user.id },
        },
      });

      if (existingUser) {
        return NextResponse.json({ error: "E-Mail oder Benutzername bereits vergeben." }, { status: 409 });
      }
    }

    // Passwort hashen, falls es geändert wird
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

    // Benutzer aktualisieren
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        email: email || user.email,
        username: username || user.username,
        passwordHash: hashedPassword || user.passwordHash,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Profil erfolgreich aktualisiert", user: updatedUser });
  } catch (error) {
    console.error("Fehler bei der Profilaktualisierung:", error);
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}
