import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    console.log("Logout request received");

    const response = NextResponse.json({ message: "Logout successful" });

    // Cookie löschen
    response.headers.set(
      "Set-Cookie",
      "token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"
    );

    // User-ID aus dem Request-Body holen (falls vorhanden)
    let userId = null;
    try {
      const body = await req.json();
      userId = body?.userId || null;
    } catch (err) {
      console.error("Error parsing request body:", err);
    }

    // Session aus der DB löschen, falls userId existiert
    if (userId) {
      try {
        console.log("Deleting session for userId:", userId);
        await prisma.session.deleteMany({ where: { userId } });
      } catch (err) {
        console.error("Error deleting session:", err);
      }
    } else {
      console.log("No userId provided, skipping session deletion.");
    }

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
