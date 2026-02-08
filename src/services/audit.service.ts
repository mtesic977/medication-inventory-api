import { auditRepository } from '../repositories/audit.repository.js';

export const auditService = {
  log(params: {
    action: string;
    entityType: string;
    entityId: string;
    performedBy: string;
    details?: unknown;
  }) {
    return auditRepository.create(params);
  },

  async getAll(entityType?: string, page = 1, limit = 25) {
    const skip = (page - 1) * limit;

    const { data, total } = await auditRepository.findAll({
      ...(entityType ? { entityType } : {}),
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
