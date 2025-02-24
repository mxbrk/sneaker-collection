import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Stelle sicher, dass Prisma hier importiert wird
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 1. Nutzer aus DB abrufen
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await comparePassword(password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // 2. JWT generieren
    const token = generateToken(user.id);

    // 3. Token in Session speichern (optional)
    await prisma.session.upsert({
      where: { userId: user.id },
      update: { token, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
      create: { userId: user.id, token, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    });

    // 4. Cookie setzen
    const response = NextResponse.json({ message: "Login successful" });
    response.headers.set("Set-Cookie", `token=${token}; Path=/; HttpOnly; Secure; Max-Age=604800`);
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
