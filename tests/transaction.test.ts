// tests/transaction.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';

import { randomUUID } from 'crypto';

// --- Mock Prisma ---
vi.mock('../src/config/prisma', () => {
  const medication = { id: randomUUID(), stock: 100 };

  return {
    prisma: {
      medication: {
        findUnique: vi.fn().mockResolvedValue(medication),
        update: vi.fn().mockImplementation(async ({ data }) => ({ ...medication, ...data })),
      },
      transaction: {
        create: vi.fn().mockImplementation(async ({ data }) => ({ id: 'tx-1', ...data })),
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
      },
      auditLog: {
        create: vi.fn().mockResolvedValue({ id: 'audit-1' }),
      },
      $transaction: async (fn: any) =>
        fn({
          medication: {
            findUnique: vi.fn().mockResolvedValue(medication),
            update: vi.fn().mockImplementation(async ({ data }) => ({ ...medication, ...data })),
          },
          transaction: {
            create: vi.fn().mockImplementation(async ({ data }) => ({ id: 'tx-1', ...data })),
          },
        }),
    },
  };
});

import transactionRoutes from '../src/routes/transaction.routes.js';
import { errorHandler } from '../src/middlewares/error.middleware.js';

const app = express();
app.use(express.json());
app.use('/api/transactions', transactionRoutes);
app.use(errorHandler);

// --- Tests ---

const medicationId = randomUUID();
const nurseId = randomUUID();
const witnessId = randomUUID();

describe('Transaction API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // --- Transaction creation tests ---
  it('creates CHECKOUT transaction successfully', async () => {
    const res = await request(app).post('/api/transactions').send({
      medicationId,
      nurseId,
      witnessId,
      type: 'CHECKOUT',
      quantity: 10,
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it('fails when nurse equals witness', async () => {
    const res = await request(app).post('/api/transactions').send({
      medicationId,
      nurseId: witnessId,
      witnessId,
      type: 'CHECKOUT',
      quantity: 10,
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('fails when insufficient stock', async () => {
    const res = await request(app).post('/api/transactions').send({
      medicationId,
      nurseId,
      witnessId,
      type: 'CHECKOUT',
      quantity: 100000,
    });

    expect(res.status).toBe(400);
  });

  it('fails when waste has no notes', async () => {
    const res = await request(app).post('/api/transactions').send({
      medicationId,
      nurseId,
      witnessId,
      type: 'WASTE',
      quantity: 5,
    });

    expect(res.status).toBe(400);
  });

  // --- Stock calculation tests ---
  it('CHECKOUT decreases stock', async () => {
    const res = await request(app).post('/api/transactions').send({
      medicationId,
      nurseId,
      witnessId,
      type: 'CHECKOUT',
      quantity: 10,
    });

    expect(res.status).toBe(201);
  });

  it('RETURN increases stock', async () => {
    const res = await request(app).post('/api/transactions').send({
      medicationId,
      nurseId,
      witnessId,
      type: 'RETURN',
      quantity: 20,
    });

    expect(res.status).toBe(201);
  });

  it('WASTE does not change stock', async () => {
    const res = await request(app).post('/api/transactions').send({
      medicationId: '3a2e10e8-4054-4abd-a1c5-ccac422840fb',
      nurseId,
      witnessId,
      type: 'WASTE',
      quantity: 5,
      notes: 'Expired',
    });

    expect(res.status).toBe(201);
  });

  // --- Input validation tests ---
  it('fails with missing fields', async () => {
    const res = await request(app).post('/api/transactions').send({});

    expect(res.status).toBe(400);
  });

  it('fails with invalid types', async () => {
    const res = await request(app).post('/api/transactions').send({
      medicationId: 123,
      nurseId: true,
      witnessId: [],
      type: 'INVALID',
      quantity: 'ten',
    });

    expect(res.status).toBe(400);
  });

  // --- List transactions ---
  it('lists transactions with pagination', async () => {
    const res = await request(app).get('/api/transactions?page=1&limit=10');

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.meta).toBeDefined();
  });
});
