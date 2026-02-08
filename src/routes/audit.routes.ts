import { Router } from 'express';
import { auditController } from '../controllers/audit.controller.js';
import { validate } from '../middlewares/validation.middleware.js';
import { listAuditLogSchema } from '../validators/audit.validator.js';

const router = Router();

router.get('/', validate(listAuditLogSchema), auditController.getAll);

export default router;
