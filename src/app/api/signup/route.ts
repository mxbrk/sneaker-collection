import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Alle Felder sind erforderlich." }, { status: 400 });
    }

    // Prüfen, ob E-Mail oder Benutzername bereits existieren
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "E-Mail oder Benutzername bereits vergeben." }, { status: 409 });
    }

    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10);

    // Benutzer in der DB erstellen
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash: hashedPassword,
      },
    });

    // Vorherige Session löschen
    await prisma.session.deleteMany({ where: { userId: newUser.id } });

    // Neues Token generieren
    const token = generateToken(newUser.id);

    // Neue Session erstellen
    await prisma.session.create({
      data: {
        userId: newUser.id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    // Cookie setzen
    const response = NextResponse.json({ message: "Registrierung erfolgreich", user: newUser });
    response.headers.set("Set-Cookie", `token=${token}; Path=/; HttpOnly; Secure; Max-Age=604800`);
    return response;
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    return NextResponse.json({ error: "Interner Serverfehler." }, { status: 500 });
  }
}
