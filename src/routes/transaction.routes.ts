import { Router } from 'express';
import { transactionController } from '../controllers/transaction.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createTransactionSchema,
  listTransactionsSchema,
} from '../validators/transaction.validator.js';

const router = Router();

router.post('/', validate(createTransactionSchema), transactionController.create);

router.get('/', validate(listTransactionsSchema), transactionController.getAll);

export default router;
