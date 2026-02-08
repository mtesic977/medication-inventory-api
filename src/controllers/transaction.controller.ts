import z from 'zod';
import { Request, Response, NextFunction } from 'express';
import { transactionService } from '../services/transaction.service.js';
import { ValidatedRequest } from '../middlewares/validation.middleware.js';
import { ListTransactionValidated } from '../types/common.js';
import { createTransactionSchema } from '../validators/transaction.validator.js';

export const transactionController = {
  async create(
    req: ValidatedRequest<z.infer<typeof createTransactionSchema>['body']>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = req.validated!.body!;

      const transaction = await transactionService.create(body);

      res.status(201).json({
        success: true,
        data: transaction,
      });
    } catch (err) {
      next(err);
    }
  },

  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = (req as Request & { validated: ListTransactionValidated }).validated;
      const { page, limit, type, medicationId } = query;

      const result = await transactionService.getAll(type, medicationId, page, limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  },
};
