import { Prisma } from '@prisma/client/extension';
import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/error.middleware.js';
import { transactionRepository } from '../repositories/transaction.repository.js';
import { auditService } from './audit.service.js';

export const transactionService = {
  async create(params: {
    medicationId: string;
    nurseId: string;
    witnessId: string;
    type: 'CHECKOUT' | 'RETURN' | 'WASTE';
    quantity: number;
    notes?: string | undefined;
  }) {
    const { medicationId, nurseId, witnessId, type, quantity, notes } = params;

    // ── Basic validation ─────────────────────────────────────────────
    if (nurseId === witnessId) {
      throw new AppError('Witness must be different from nurse', 400);
    }

    if (type === 'WASTE' && !notes) {
      throw new AppError('Waste transaction requires notes', 400);
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const medication = await tx.medication.findUnique({
        where: { id: medicationId },
      });

      if (!medication) {
        throw new AppError('Medication not found', 404);
      }

      // ── Calculate new stock ─────────────────────────────────────────
      let newStock = medication.stock;

      switch (type) {
        case 'CHECKOUT':
          if (newStock < quantity) {
            throw new AppError('Insufficient stock', 400);
          }
          newStock -= quantity;
          break;

        case 'RETURN':
          newStock += quantity;
          break;

        case 'WASTE':
          // stock unchanged
          break;
      }

      // ── Create transaction ──────────────────────────────────────────
      const transaction = await tx.transaction.create({
        data: { medicationId, nurseId, witnessId, type, quantity, notes },
      });

      // ── Update stock when needed ────────────────────────────────────
      if (type !== 'WASTE') {
        await tx.medication.update({
          where: { id: medicationId },
          data: { stock: newStock },
        });
      }

      // ── Audit log ───────────────────────────────────────────────────
      await auditService.log({
        action: type,
        entityType: 'TRANSACTION',
        entityId: transaction.id,
        performedBy: nurseId,
        details: { quantity, medicationId },
      });

      return transaction;
    });
  },

  async getAll(
    type: string | undefined,
    medicationId: string | undefined,
    page: number,
    limit: number,
  ) {
    const skip = (page - 1) * limit;

    const { data, total } = await transactionRepository.findAll({
      ...(type ? { type } : {}),
      ...(medicationId ? { medicationId } : {}),
      skip,
      take: limit,
    });

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },
};
