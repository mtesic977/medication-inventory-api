import { z } from 'zod';

export const listAuditLogSchema = z.object({
  query: z.object({
    entityType: z
      .enum(['MEDICATION', 'USER', 'TRANSACTION', 'AUDITLOG'])
      .optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
  }),
});
