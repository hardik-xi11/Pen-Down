import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  const start = Date.now();
  let db = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = true;
  } catch {
    db = false;
  }
  const duration = Date.now() - start;
  return NextResponse.json({ status: 'ok', db, durationMs: duration, time: new Date().toISOString() });
}
