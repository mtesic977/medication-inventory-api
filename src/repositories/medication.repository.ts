import { prisma } from '../config/prisma.js';

export const medicationRepository = {
  async findAll(params: { schedule?: string; skip: number; take: number }) {
    const { schedule, skip, take } = params;

    const [data, total] = await Promise.all([
      prisma.medication.findMany({
        where: schedule ? { schedule } : undefined,
        orderBy: { name: 'asc' },
        skip,
        take,
      }),
      prisma.medication.count({
        where: schedule ? { schedule } : undefined,
      }),
    ]);

    return { data, total };
  },

  findById(id: string) {
    return prisma.medication.findUnique({
      where: { id },
      include: {
        transactions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },
};
