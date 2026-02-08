import { Request, Response, NextFunction } from 'express';
import { medicationService } from '../services/medication.service.js';
import { ListMedicationValidated } from '../types/common.js';
import { AppError } from '../middlewares/error.middleware.js';

export const medicationController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { query } = (req as Request & { validated: ListMedicationValidated }).validated;
      const { page, limit, schedule } = query;

      const result = await medicationService.getAll(schedule, page, limit);

      res.json({
        success: true,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

      if (!id) {
        return next(new AppError('Medication ID is required', 400));
      }

      const medication = await medicationService.getById(id);

      res.json({
        success: true,
        data: medication,
      });
    } catch (err) {
      next(err);
    }
  },
};
