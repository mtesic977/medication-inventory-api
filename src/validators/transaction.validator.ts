import { z } from 'zod';

export const createTransactionSchema = z.object({
  body: z.object({
    medicationId: z.uuid(),
    nurseId: z.uuid(),
    witnessId: z.uuid(),
    type: z.enum(['CHECKOUT', 'RETURN', 'WASTE']),
    quantity: z.number().positive(),
    notes: z.string().optional(),
  }),
});

export const listTransactionsSchema = z.object({
  query: z.object({
    type: z.enum(['CHECKOUT', 'RETURN', 'WASTE']).optional(),
    medicationId: z.uuid().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().int().min(1).max(100).default(10),
  }),
});
