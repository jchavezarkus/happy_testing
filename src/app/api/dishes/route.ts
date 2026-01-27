
import { requireSession } from '@/app/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: List all dishes
export async function GET() {
  let userId;
  try {
    userId = await requireSession();
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const dishes = await prisma.dish.findMany({ where: { userId: Number(userId) } });
  return NextResponse.json({ dishes });
}

// POST: Create a new dish
export async function POST(request: Request) {
  let userId;
  try {
    userId = await requireSession();
  } catch {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }
  const data = await request.json();
  const { name, description, quickPrep, prepTime, cookTime, imageUrl, steps, calories } = data;

  if (!name || !description || prepTime == null || cookTime == null) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const dish = await prisma.dish.create({
      data: {
        name,
        description,
        quickPrep: !!quickPrep,
        prepTime: Number(prepTime),
        cookTime: Number(cookTime),
        imageUrl,
        userId: Number(userId),
        steps: Array.isArray(steps) ? steps : [],
        calories: calories === undefined || calories === null || calories === '' ? null : Number(calories),
      },
    });
    return NextResponse.json({ dish });
  } catch (error: unknown) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
