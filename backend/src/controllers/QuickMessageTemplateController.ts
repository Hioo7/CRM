import { Request, Response, NextFunction } from 'express';
import { QuickMessageTemplateService } from '../services/QuickMessageTemplateService';
import type {
  CreateQuickMessageTemplateDto,
  QuickMessageTemplateListQueryDto,
  RenderQuickMessageTemplateDto,
  UpdateQuickMessageTemplateDto,
} from '../schema/quick-message-template.schema';

type IdParam = { id: string };

export class QuickMessageTemplateController {
  private static instance: QuickMessageTemplateController;

  private constructor() {}

  static getInstance(): QuickMessageTemplateController {
    if (!QuickMessageTemplateController.instance) {
      QuickMessageTemplateController.instance = new QuickMessageTemplateController();
    }

    return QuickMessageTemplateController.instance;
  }

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as CreateQuickMessageTemplateDto;
      const template = await QuickMessageTemplateService.getInstance().create(req.employee.id, dto);
      res.status(201).json(template);
    } catch (error) {
      next(error);
    }
  };

  list = async (
    req: Request<Record<string, never>, Record<string, never>, Record<string, never>, QuickMessageTemplateListQueryDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const templates = await QuickMessageTemplateService.getInstance().findAll(req.query.platform);
      res.status(200).json(templates);
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const template = await QuickMessageTemplateService.getInstance().findById(req.params.id);
      res.status(200).json(template);
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as UpdateQuickMessageTemplateDto;
      const template = await QuickMessageTemplateService.getInstance().update(req.params.id, dto);
      res.status(200).json(template);
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request<IdParam>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await QuickMessageTemplateService.getInstance().delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getMetadata = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const metadata = QuickMessageTemplateService.getInstance().getMetadata();
      res.status(200).json(metadata);
    } catch (error) {
      next(error);
    }
  };

  render = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const dto = req.body as RenderQuickMessageTemplateDto;
      const rendered = await QuickMessageTemplateService.getInstance().render(
        req.employee.id,
        req.employee.role,
        dto,
      );
      res.status(200).json(rendered);
    } catch (error) {
      next(error);
    }
  };
}
