import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/EmployeeService';
import { UpdateSelfDto } from '../schema/employee.schema';

export class MeController {
  private static instance: MeController;

  private constructor() {}

  static getInstance(): MeController {
    if (!MeController.instance) {
      MeController.instance = new MeController();
    }
    return MeController.instance;
  }

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employee = await EmployeeService.getInstance().findById(req.employee.id);
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as UpdateSelfDto;
      const employee = await EmployeeService.getInstance().updateSelf(req.employee.id, dto);
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  };
}
