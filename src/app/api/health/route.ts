import { NextResponse } from "next/server";
import { pool } from "@/db";

export async function GET() {
  const health: {
    status: string;
    timestamp: string;
    database: string;
    version?: string;
    error?: string;
  } = {
    status: "ok",
    timestamp: new Date().toISOString(),
    database: "unknown",
  };

  try {
    const result = await pool.query("SELECT version(), NOW() as time");
    health.database = "connected";
    health.version = result.rows[0]?.version?.split(" ").slice(0, 2).join(" ");
  } catch (e) {
    health.status = "degraded";
    health.database = "disconnected";
    health.error = e instanceof Error ? e.message : "Unknown database error";
  }

  const statusCode = health.status === "ok" ? 200 : 503;
  return NextResponse.json(health, { status: statusCode });
}
