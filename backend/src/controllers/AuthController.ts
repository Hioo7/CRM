import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { LoginDto } from '../schema/auth.schema';

export class AuthController {
  private static instance: AuthController;

  private constructor() {}

  static getInstance(): AuthController {
    if (!AuthController.instance) {
      AuthController.instance = new AuthController();
    }
    return AuthController.instance;
  }

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as LoginDto;
      const result = await AuthService.getInstance().login(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };
}
