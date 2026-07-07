import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { verifyPassword, createToken } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 login attempts per minute per IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const { success } = rateLimit(`login:${ip}`, 10, 60000);
    if (!success) {
      return NextResponse.json(
        { error: "Too many login attempts. Please wait a moment." },
        { status: 429 }
      );
    }

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = createToken(user.id);
    const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
