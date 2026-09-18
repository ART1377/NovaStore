// src/app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { apiErrorResponse } from '@/lib/api-error';
import { db } from '@/lib/prisma';
import { LOW_STOCK_THRESHOLD } from '@/constants/constants';
import { requireAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdmin();
    const [
      users,
      products,
      orders,
      revenue,
      lowStock,
      allOrders,
      grouped,
      recentRevenue,
    ] = await db.$transaction([
      db.user.count({ where: { role: 'USER' } }),
      db.product.count(),
      db.order.count(),
      db.order.aggregate({
        where: { paymentStatus: 'PAID' },
        _sum: { total: true },
      }),
      db.productVariant.findMany({
        where: { stock: { lte: LOW_STOCK_THRESHOLD } },
        include: { product: { select: { name: true } } },
        orderBy: { stock: 'asc' },
        take: 10,
      }),
      db.order.findMany({ select: { orderStatus: true } }),
      db.orderItem.groupBy({
        by: ['productId'],
        _sum: { quantity: true },
        where: { order: { orderStatus: { not: 'CANCELLED' } } },
        orderBy: { productId: 'asc' },
      }),
      db.order.findMany({
        where: { paymentStatus: 'PAID' },
        select: { total: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    const statusCounts = allOrders.reduce<Record<string, number>>(
      (acc, order) => {
        acc[order.orderStatus] = (acc[order.orderStatus] ?? 0) + 1;
        return acc;
      },
      {},
    );
    const ranked = grouped
      .sort((a, b) => (b._sum?.quantity ?? 0) - (a._sum?.quantity ?? 0))
      .slice(0, 5);
    const topProducts = ranked.length
      ? await db.product.findMany({
          where: { id: { in: ranked.map((item) => item.productId) } },
          select: { id: true, name: true },
        })
      : [];
    const names = new Map(
      topProducts.map((product) => [product.id, product.name]),
    );
    const best = ranked.map((item) => ({
      name: names.get(item.productId) ?? 'محصول حذف‌شده',
      quantity: item._sum?.quantity ?? 0,
    }));
    const dailyMap = recentRevenue.reduce<Record<string, number>>(
      (acc, item) => {
        const key = item.createdAt.toISOString().slice(0, 10);
        acc[key] = (acc[key] ?? 0) + item.total;
        return acc;
      },
      {},
    );
    const dailyRevenue = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7)
      .map(([date, value]) => ({ date, value }));
    return NextResponse.json({
      totals: { users, products, orders, revenue: revenue._sum.total ?? 0 },
      lowStock,
      statusCounts,
      topProducts: best,
      dailyRevenue,
    });
  } catch (error) {
    const r = apiErrorResponse(error, 'دریافت آمار انجام نشد.');
    return NextResponse.json(r.body, { status: r.status });
  }
}
