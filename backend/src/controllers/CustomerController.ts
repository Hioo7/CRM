import { Request, Response, NextFunction } from "express";
import { CustomerService } from "../services/CustomerService";
import {
  CreateCustomerDto,
  UpdateCustomerDto,
} from "../schema/customer.schema";
import { GrantCustomerAccessDto } from "../schema/customer-access.schema";

type IdParam = { id: string };
type AccessParam = { id: string; employeeId: string };

export class CustomerController {
  private static instance: CustomerController;

  private constructor() {}

  static getInstance(): CustomerController {
    if (!CustomerController.instance) {
      CustomerController.instance = new CustomerController();
    }
    return CustomerController.instance;
  }

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as CreateCustomerDto;
      const customer = await CustomerService.getInstance().create(
        req.employee.id,
        dto,
      );
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  };

  list = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const createdById = req.query.createdById as string | undefined;
      const customers = await CustomerService.getInstance().findAll(
        req.employee.id,
        req.employee.role,
        createdById,
      );
      res.status(200).json(customers);
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request<IdParam>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const customer = await CustomerService.getInstance().findById(
        req.params.id,
      );
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request<IdParam>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as UpdateCustomerDto;
      const customer = await CustomerService.getInstance().update(
        req.params.id,
        dto,
      );
      res.status(200).json(customer);
    } catch (error) {
      next(error);
    }
  };

  delete = async (
    req: Request<IdParam>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await CustomerService.getInstance().delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  grantAccess = async (
    req: Request<IdParam>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as GrantCustomerAccessDto;
      const access = await CustomerService.getInstance().grantAccess(
        req.params.id,
        dto,
      );
      res.status(201).json(access);
    } catch (error) {
      next(error);
    }
  };

  revokeAccess = async (
    req: Request<AccessParam>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await CustomerService.getInstance().revokeAccess(
        req.params.id,
        req.params.employeeId,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
