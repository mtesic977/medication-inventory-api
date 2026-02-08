import { OpenAPIObject } from 'openapi3-ts/oas31';

export const openApiDoc: OpenAPIObject = {
  openapi: '3.0.3',
  info: {
    title: 'Medication Inventory API',
    version: '1.0.0',
    description: 'API for tracking medication inventory with transactions and audit logs',
  },
  servers: [
    { url: 'http://localhost:3000/api' },
  ],
  paths: {
    // --- Medications ---
    '/medications': {
      get: {
        summary: 'List all medications',
        description: 'Optional schedule filter, paginated',
        parameters: [
          {
            name: 'schedule',
            in: 'query',
            schema: { type: 'string', enum: ['II', 'III', 'IV', 'V'] },
            description: 'Filter by schedule',
          },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 25 } },
        ],
        responses: {
          '200': {
            description: 'List of medications with pagination',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Medication' } },
                    meta: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                        totalPages: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/medications/{id}': {
      get: {
        summary: 'Get single medication by ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Medication UUID',
          },
        ],
        responses: {
          '200': {
            description: 'Medication with transaction history',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Medication' },
                  },
                },
              },
            },
          },
          '404': { description: 'Medication not found' },
        },
      },
    },

    // --- Transactions ---
    '/transactions': {
      post: {
        summary: 'Create a transaction (checkout, return, or waste)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['medicationId', 'nurseId', 'witnessId', 'type', 'quantity'],
                properties: {
                  medicationId: { type: 'string', format: 'uuid' },
                  nurseId: { type: 'string', format: 'uuid' },
                  witnessId: { type: 'string', format: 'uuid' },
                  type: { type: 'string', enum: ['CHECKOUT', 'RETURN', 'WASTE'] },
                  quantity: { type: 'number' },
                  notes: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Transaction created successfully' },
          '400': { description: 'Invalid input or business rule violation' },
        },
      },
      get: {
        summary: 'List transactions',
        description: 'Optional filters by type or medicationId, paginated',
        parameters: [
          { name: 'type', in: 'query', schema: { type: 'string', enum: ['CHECKOUT', 'RETURN', 'WASTE'] } },
          { name: 'medicationId', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 25 } },
        ],
        responses: {
          '200': {
            description: 'Paginated list of transactions',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } },
                    meta: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                        totalPages: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // --- Audit Log ---
    '/audit-log': {
      get: {
        summary: 'List audit log entries',
        description: 'Optional filter by entity type, paginated',
        parameters: [
          { name: 'entityType', in: 'query', schema: { type: 'string', enum: ['MEDICATION', 'USER', 'TRANSACTION', 'AUDITLOG'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 25 } },
        ],
        responses: {
          '200': {
            description: 'Paginated list of audit logs',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/AuditLog' } },
                    meta: {
                      type: 'object',
                      properties: {
                        page: { type: 'integer' },
                        limit: { type: 'integer' },
                        total: { type: 'integer' },
                        totalPages: { type: 'integer' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  components: {
    schemas: {
      Medication: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          schedule: { type: 'string', enum: ['II','III','IV','V'] },
          unit: { type: 'string', example: 'mg' },
          currentStock: { type: 'number' },
          transactions: { type: 'array', items: { $ref: '#/components/schemas/Transaction' } },
        },
      },
      Transaction: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          medicationId: { type: 'string', format: 'uuid' },
          nurseId: { type: 'string', format: 'uuid' },
          witnessId: { type: 'string', format: 'uuid' },
          type: { type: 'string', enum: ['CHECKOUT','RETURN','WASTE'] },
          quantity: { type: 'number' },
          notes: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
      AuditLog: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          action: { type: 'string' },
          entityType: { type: 'string' },
          entityId: { type: 'string' },
          performedBy: { type: 'string' },
          details: { type: 'object' },
          timestamp: { type: 'string', format: 'date-time' },
        },
      },
    },
  },
};
