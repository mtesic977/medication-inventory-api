import { prisma } from '../config/prisma.js';

export const transactionRepository = {
  create(data: {
    medicationId: string;
    nurseId: string;
    witnessId: string;
    type: 'CHECKOUT' | 'RETURN' | 'WASTE';
    quantity: number;
    notes?: string;
  }) {
    return prisma.transaction.create({ data });
  },

  async findAll(params: { type?: string; medicationId?: string; skip: number; take: number }) {
    const { type, medicationId, skip, take } = params;

    const where = {
      ...(type && { type }),
      ...(medicationId && { medicationId }),
    };

    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.transaction.count({ where }),
    ]);

    return { data, total };
  },
};
