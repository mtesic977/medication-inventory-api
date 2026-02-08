import { Router } from 'express';
import { medicationController } from '../controllers/medication.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { listMedicationSchema } from '../validators/medication.validator.js';

const router = Router();

router.get('/', validate(listMedicationSchema), medicationController.getAll);

router.get('/:id', medicationController.getById);

export default router;
