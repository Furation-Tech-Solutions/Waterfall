import { NextFunction, Request, Response } from "express";
import {
  UpcomingTaskEntity,
  UpcomingTaskModel,
  UpcomingTaskMapper,
} from "@domain/upcomingTask/entities/upcomingTask";
import { CreateUpcomingTaskUsecase } from "@domain/upcomingTask/usecases/create-upcomingTask";
import { GetUpcomingTaskByIdUsecase } from "@domain/upcomingTask/usecases/get-upcomingTask-by-id";
import { UpdateUpcomingTaskUsecase } from "@domain/upcomingTask/usecases/update-upcomingTask";
import { GetAllUpcomingTasksUsecase } from "@domain/upcomingTask/usecases/get-all-upcomingTasks";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export class UpcomingTaskService {
  private readonly createUpcomingTaskUsecase: CreateUpcomingTaskUsecase;
  private readonly getUpcomingTaskByIdUsecase: GetUpcomingTaskByIdUsecase;
  private readonly updateUpcomingTaskUsecase: UpdateUpcomingTaskUsecase;
  private readonly getAllUpcomingTasksUsecase: GetAllUpcomingTasksUsecase;

  constructor(
    createUpcomingTaskUsecase: CreateUpcomingTaskUsecase,
    getUpcomingTaskByIdUsecase: GetUpcomingTaskByIdUsecase,
    updateUpcomingTaskUsecase: UpdateUpcomingTaskUsecase,
    getAllUpcomingTasksUsecase: GetAllUpcomingTasksUsecase
  ) {
    this.createUpcomingTaskUsecase = createUpcomingTaskUsecase;
    this.getUpcomingTaskByIdUsecase = getUpcomingTaskByIdUsecase;
    this.updateUpcomingTaskUsecase = updateUpcomingTaskUsecase;
    this.getAllUpcomingTasksUsecase = getAllUpcomingTasksUsecase;
  }

  async createUpcomingTask(req: Request, res: Response): Promise<void> {
    const upcomingTaskData: UpcomingTaskModel = UpcomingTaskMapper.toModel(
      req.body
    );

    const newUpcomingTask: Either<ErrorClass, UpcomingTaskEntity> =
      await this.createUpcomingTaskUsecase.execute(upcomingTaskData);      

    newUpcomingTask.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: UpcomingTaskEntity) => {
        const resData = UpcomingTaskMapper.toEntity(result, true);
        
        return res.json(resData);
      }
    );
  }

  async getUpcomingTaskById(req: Request, res: Response): Promise<void> {
    const upcomingTaskId: string = req.params.id;

    const upcomingTask: Either<ErrorClass, UpcomingTaskEntity> =
      await this.getUpcomingTaskByIdUsecase.execute(upcomingTaskId);

    upcomingTask.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: UpcomingTaskEntity) => {
        const resData = UpcomingTaskMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  async updateUpcomingTask(req: Request, res: Response): Promise<void> {
    const upcomingTaskId: string = req.params.id;
    const UpcomingTaskData: UpcomingTaskModel = req.body;

    const existingUpcomingTask: Either<ErrorClass, UpcomingTaskEntity> =
      await this.getUpcomingTaskByIdUsecase.execute(upcomingTaskId);

    existingUpcomingTask.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (result: UpcomingTaskEntity) => {
        const resData = UpcomingTaskMapper.toEntity(result, true);

        const updatedUpcomingTaskEntity: UpcomingTaskEntity =
          UpcomingTaskMapper.toEntity(UpcomingTaskData, true, resData);

        const updatedUpcomingTask: Either<ErrorClass, UpcomingTaskEntity> =
          await this.updateUpcomingTaskUsecase.execute(
            upcomingTaskId,
            updatedUpcomingTaskEntity
          );

        updatedUpcomingTask.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (response: UpcomingTaskEntity) => {
            const responseData = UpcomingTaskMapper.toModel(response);

            res.json(responseData);
          }
        );
      }
    );
  }

  async getAllUpcomingTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const jobs: Either<ErrorClass, UpcomingTaskEntity[]> =
      await this.getAllUpcomingTasksUsecase.execute();

    jobs.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (upcomingTasks: UpcomingTaskEntity[]) => {
        const resData = upcomingTasks.map((upcomingTask: any) =>
          UpcomingTaskMapper.toEntity(upcomingTask)
        );
        return res.json(resData);
      }
    );
  }
}
