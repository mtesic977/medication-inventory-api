import { z } from 'zod';

export const listMedicationSchema = z.object({
  query: z.object({
    schedule: z.enum(['II', 'III', 'IV', 'V']).optional(),
    page: z.coerce.number().default(1),
    limit: z.coerce.number().default(10),
  }),
});
