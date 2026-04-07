import { Request, Response, NextFunction } from 'express';
import { OpportunityService } from '../services/OpportunityService';
import { CreateOpportunityDto, UpdateOpportunityDto } from '../schema/opportunity.schema';
import { StageChangeDto } from '../schema/opportunity-stage.schema';
import { NoteEditDto } from '../schema/opportunity-note.schema';
import { GrantOpportunityAccessDto } from '../schema/opportunity-access.schema';

type IdParam = { id: string };
type HistoryParam = { id: string; historyId: string };
type AccessParam = { id: string; employeeId: string };

export class OpportunityController {
  private static instance: OpportunityController;

  private constructor() {}

  static getInstance(): OpportunityController {
    if (!OpportunityController.instance) {
      OpportunityController.instance = new OpportunityController();
    }
    return OpportunityController.instance;
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateOpportunityDto;
      const opportunity = await OpportunityService.getInstance().create(
        req.employee.id,
        req.employee.role,
        dto,
      );
      res.status(201).json(opportunity);
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const customerId = req.query.customerId as string | undefined;
      const opportunities = await OpportunityService.getInstance().findAll(
        req.employee.id,
        req.employee.role,
        customerId,
      );
      res.status(200).json(opportunities);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const opportunity = await OpportunityService.getInstance().findById(req.params.id);
      res.status(200).json(opportunity);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as UpdateOpportunityDto;
      const opportunity = await OpportunityService.getInstance().update(req.params.id, dto);
      res.status(200).json(opportunity);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await OpportunityService.getInstance().delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  changeStage = async (
    req: Request<IdParam>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as StageChangeDto;
      const opportunity = await OpportunityService.getInstance().changeStage(
        req.params.id,
        req.employee.id,
        dto,
      );
      res.status(200).json(opportunity);
    } catch (error) {
      next(error);
    }
  };

  editNotes = async (
    req: Request<HistoryParam>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const dto = req.body as NoteEditDto;
      const opportunity = await OpportunityService.getInstance().editNotes(
        req.params.id,
        req.params.historyId,
        req.employee.id,
        dto,
      );
      res.status(200).json(opportunity);
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
      const dto = req.body as GrantOpportunityAccessDto;
      const access = await OpportunityService.getInstance().grantAccess(req.params.id, dto);
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
      await OpportunityService.getInstance().revokeAccess(req.params.id, req.params.employeeId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
