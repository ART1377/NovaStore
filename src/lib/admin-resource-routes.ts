// src/lib/admin-resource-routes.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { apiErrorResponse } from './api-error';
import { requireAdmin } from './auth';

const nameSchema = z.object({ name: z.string().trim().min(2).max(80) });
const updateSchema = z.object({
  name: z.string().trim().min(2).max(80),
  isActive: z.boolean().optional(),
});

function respondWithError(error: unknown, fallback: string) {
  const r = apiErrorResponse(error, fallback);
  return NextResponse.json(r.body, { status: r.status });
}

/** GET list handler shared by every simple admin resource (brands, categories, ...). */
export async function handleResourceList<T>(
  fetchAll: () => Promise<T>,
  fetchErrorMessage: string,
) {
  try {
    await requireAdmin();
    return NextResponse.json(await fetchAll());
  } catch (error) {
    return respondWithError(error, fetchErrorMessage);
  }
}

/** POST create handler shared by every simple admin resource. */
export async function handleResourceCreate<T>(
  request: Request,
  createItem: (name: string) => Promise<T>,
  createErrorMessage: string,
) {
  try {
    await requireAdmin();
    const { name } = nameSchema.parse(await request.json());
    return NextResponse.json(await createItem(name), { status: 201 });
  } catch (error) {
    return respondWithError(error, createErrorMessage);
  }
}

/** PATCH update handler shared by every simple admin resource. */
export async function handleResourceUpdate<T>(
  request: Request,
  params: Promise<{ id: string }>,
  ops: {
    exists: (id: string) => Promise<boolean>;
    update: (
      id: string,
      data: { name: string; isActive?: boolean },
    ) => Promise<T>;
  },
  messages: { notFound: string; updateError: string },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = updateSchema.parse(await request.json());
    if (!(await ops.exists(id)))
      return NextResponse.json({ error: messages.notFound }, { status: 404 });
    return NextResponse.json(await ops.update(id, body));
  } catch (error) {
    return respondWithError(error, messages.updateError);
  }
}

/** DELETE handler shared by every simple admin resource that products reference. */
export async function handleResourceDelete(
  params: Promise<{ id: string }>,
  ops: {
    countProductsUsing: (id: string) => Promise<number>;
    deleteIfExists: (id: string) => Promise<number>;
  },
  messages: { inUse: string; notFound: string; deleteError: string },
) {
  try {
    await requireAdmin();
    const { id } = await params;
    const usageCount = await ops.countProductsUsing(id);
    if (usageCount > 0)
      return NextResponse.json({ error: messages.inUse }, { status: 409 });
    const deletedCount = await ops.deleteIfExists(id);
    if (deletedCount === 0)
      return NextResponse.json({ error: messages.notFound }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return respondWithError(error, messages.deleteError);
  }
}
