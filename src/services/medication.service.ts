import { medicationRepository } from '../repositories/medication.repository.js';
import { AppError } from '../middlewares/error.middleware.js';

export const medicationService = {
  async getAll(schedule: string | undefined, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const { data, total } = await medicationRepository.findAll({
      ...(schedule ? { schedule } : {}),
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

  async getById(id: string) {
    const medication = await medicationRepository.findById(id);

    if (!medication) {
      throw new AppError('Medication not found', 404);
    }

    return medication;
  },
};
