import { Request, Response, NextFunction } from "express";
import { AdminService } from "../services/AdminService";

type EmployeeIdParam = { id: string };

export class AdminController {
  private static instance: AdminController;

  private constructor() {}

  static getInstance(): AdminController {
    if (!AdminController.instance) {
      AdminController.instance = new AdminController();
    }
    return AdminController.instance;
  }

  getOverview = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const overview = await AdminService.getInstance().getOverview();
      res.status(200).json(overview);
    } catch (error) {
      next(error);
    }
  };

  getRecentActivity = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const activity = await AdminService.getInstance().getRecentActivity(30);
      res.status(200).json(activity);
    } catch (error) {
      next(error);
    }
  };

  getEmployeeActivity = async (
    req: Request<EmployeeIdParam>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const activity = await AdminService.getInstance().getEmployeeActivity(
        req.params.id,
      );
      res.status(200).json(activity);
    } catch (error) {
      next(error);
    }
  };
}
