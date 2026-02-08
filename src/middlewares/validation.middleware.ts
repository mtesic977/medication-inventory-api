import z, { ZodObject, ZodType, ZodError } from 'zod';
import { Response, NextFunction } from 'express';
import { AppError } from './error.middleware.js';
import { Request } from 'express';

export interface ValidatedRequest<
  Body = unknown,
  Params = unknown,
  Query = unknown
> extends Request {
  validated?: {
    body?: Body;
    params?: Params;
    query?: Query;
  };
}

// Accept a ZodObject with shape for body, params, query
export const validate =
  <
    BodySchema extends ZodType = ZodType,
    ParamsSchema extends ZodType = ZodType,
    QuerySchema extends ZodType = ZodType
  >(
    schema: ZodObject<{ body?: BodySchema; params?: ParamsSchema; query?: QuerySchema }>
  ) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // Cast req to generic ValidatedRequest
      (req as ValidatedRequest<
        BodySchema['_output'],
        ParamsSchema['_output'],
        QuerySchema['_output']
      >).validated = parsed;

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(new AppError('Validation failed', 400, z.treeifyError(err)));
      }
      next(err);
    }
  };
