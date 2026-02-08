import { prisma } from '../config/prisma.js';

export const auditRepository = {
  create(data: {
    action: string;
    entityType: string;
    entityId: string;
    performedBy: string;
    details?: unknown;
  }) {
    return prisma.auditLog.create({ data });
  },

  async findAll(params: { entityType?: string; skip: number; take: number }) {
    const { entityType, skip, take } = params;

    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: entityType ? { entityType } : undefined,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.auditLog.count({
        where: entityType ? { entityType } : undefined,
      }),
    ]);

    return { data, total };
  },
};
