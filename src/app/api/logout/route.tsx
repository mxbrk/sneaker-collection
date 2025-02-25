import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    console.log("Logout request received");

    const response = NextResponse.json({ message: "Logout successful" });

    // Token im Cookie löschen
    response.headers.set("Set-Cookie", "token=; Path=/; HttpOnly; Secure; Max-Age=0");

    // Versuche, die User-ID aus dem Request zu bekommen
    let userId;
    try {
      const body = await req.json();
      userId = body.userId;
    } catch (err) {
      console.error("Error parsing request body:", err);
    }

    // Falls userId vorhanden, lösche die Session in der DB
    if (userId) {
      console.log("Deleting session for userId:", userId);
      await prisma.session.deleteMany({ where: { userId } });
    } else {
      console.log("No userId provided, skipping session deletion.");
    }

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
