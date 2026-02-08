// src/controllers/audit.controller.ts
import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/audit.service.js';
import { ListAuditValidated } from '../types/common.js';

export const auditController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = (req as Request & { validated: ListAuditValidated }).validated;
      const { page, limit, entityType } = query;

      const result = await auditService.getAll(entityType, page, limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  },
};
