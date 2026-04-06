import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { AppConfig } from '../config/AppConfig';

export interface JwtPayload {
  sub: string;
  username: string;
  role: Role;
}

type VerifiedPayload = JwtPayload & { iat: number; exp: number };

export class JwtService {
  private static instance: JwtService;
  private readonly secret: string;
  private readonly expiresIn: string;

  private constructor() {
    const config = AppConfig.getInstance();
    this.secret = config.jwtSecret;
    this.expiresIn = config.jwtExpiresIn;
  }

  static getInstance(): JwtService {
    if (!JwtService.instance) {
      JwtService.instance = new JwtService();
    }
    return JwtService.instance;
  }

  sign(payload: JwtPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn } as jwt.SignOptions);
  }

  verify(token: string): VerifiedPayload {
    return jwt.verify(token, this.secret) as VerifiedPayload;
  }
}
