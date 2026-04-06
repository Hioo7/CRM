import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/EmployeeService';
import { CreateEmployeeDto, UpdateEmployeeDto } from '../schema/employee.schema';

type IdParam = { id: string };

export class EmployeeController {
  private static instance: EmployeeController;

  private constructor() {}

  static getInstance(): EmployeeController {
    if (!EmployeeController.instance) {
      EmployeeController.instance = new EmployeeController();
    }
    return EmployeeController.instance;
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateEmployeeDto;
      const employee = await EmployeeService.getInstance().create(dto);
      res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  };

  list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employees = await EmployeeService.getInstance().findAll();
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const employee = await EmployeeService.getInstance().findById(req.params.id);
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as UpdateEmployeeDto;
      const employee = await EmployeeService.getInstance().update(
        req.employee.role,
        req.params.id,
        dto,
      );
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  };

  remove = async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await EmployeeService.getInstance().remove(
        req.employee.id,
        req.employee.role,
        req.params.id,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
