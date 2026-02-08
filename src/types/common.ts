import { listAuditLogSchema } from '../validators/audit.validator.js';
import { listMedicationSchema } from '../validators/medication.validator.js';
import { listTransactionsSchema } from '../validators/transaction.validator.js';

export type ListAuditValidated = ReturnType<(typeof listAuditLogSchema)['parse']>;
export type ListMedicationValidated = ReturnType<(typeof listMedicationSchema)['parse']>;
export type ListTransactionValidated = ReturnType<(typeof listTransactionsSchema)['parse']>;
