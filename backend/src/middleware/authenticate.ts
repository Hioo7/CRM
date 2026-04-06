import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { JwtService } from '../lib/JwtService';
import { BEARER_PREFIX } from '../config/constants';
import { AppError } from '../lib/AppError';

declare global {
  namespace Express {
    interface Request {
      employee: {
        id: string;
        username: string;
        role: Role;
      };
    }
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith(BEARER_PREFIX)) {
    return next(new AppError(401, 'Missing or malformed authorization header'));
  }

  const token = authHeader.slice(BEARER_PREFIX.length);

  try {
    const payload = JwtService.getInstance().verify(token);
    req.employee = { id: payload.sub, username: payload.username, role: payload.role };
    next();
  } catch {
    next(new AppError(401, 'Invalid or expired token'));
  }
}
