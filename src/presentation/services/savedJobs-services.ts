import { NextFunction, Request, Response } from "express";
import {
  SavedJobEntity,
  SavedJobModel,
  SavedJobMapper,
} from "@domain/savedJobs/entities/savedJobs";
import { CreateSavedJobUsecase } from "@domain/savedJobs/usecases/create-savedJobs";
import { DeleteSavedJobUsecase } from "@domain/savedJobs/usecases/delete-savedJobs";
import { GetSavedJobByIdUsecase } from "@domain/savedJobs/usecases/get-savedJobs-by-id";
import { UpdateSavedJobUsecase } from "@domain/savedJobs/usecases/update-savedJobs";
import { GetAllSavedJobsUsecase } from "@domain/savedJobs/usecases/get-all-savedJobs";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export class SavedJobService {
  private readonly createSavedJobUsecase: CreateSavedJobUsecase;
  private readonly deleteSavedJobUsecase: DeleteSavedJobUsecase;
  private readonly getSavedJobByIdUsecase: GetSavedJobByIdUsecase;
  private readonly updateSavedJobUsecase: UpdateSavedJobUsecase;
  private readonly getAllSavedJobsUsecase: GetAllSavedJobsUsecase;

  constructor(
    createSavedJobUsecase: CreateSavedJobUsecase,
    deleteSavedJobUsecase: DeleteSavedJobUsecase,
    getSavedJobByIdUsecase: GetSavedJobByIdUsecase,
    updateSavedJobUsecase: UpdateSavedJobUsecase,
    getAllSavedJobsUsecase: GetAllSavedJobsUsecase
  ) {
    this.createSavedJobUsecase = createSavedJobUsecase;
    this.deleteSavedJobUsecase = deleteSavedJobUsecase;
    this.getSavedJobByIdUsecase = getSavedJobByIdUsecase;
    this.updateSavedJobUsecase = updateSavedJobUsecase;
    this.getAllSavedJobsUsecase = getAllSavedJobsUsecase;
  }

  private sendSuccessResponse(
    res: Response,
    data: any,
    message: string = "Success",
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  private sendErrorResponse(
    res: Response,
    error: ErrorClass,
    statusCode: number = 500
  ): void {
    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }

  async createSavedJob(req: Request, res: Response): Promise<void> {
    const savedJobData: SavedJobModel = SavedJobMapper.toModel(req.body);

    const newSavedJob: Either<ErrorClass, SavedJobEntity> =
      await this.createSavedJobUsecase.execute(savedJobData);

    newSavedJob.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 400),
      (result: SavedJobEntity) => {
        const resData = SavedJobMapper.toEntity(result, true);
        this.sendSuccessResponse(
          res,
          resData,
          "Saved job created successfully",
          201
        );
      }
    );
  }

  async deleteSavedJob(req: Request, res: Response): Promise<void> {
    const savedJobId: string = req.params.id;

    const response: Either<ErrorClass, void> =
      await this.deleteSavedJobUsecase.execute(savedJobId);

    response.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      () => {
        this.sendSuccessResponse(
          res,
          {},
          "Saved job deleted successfully",
          204
        );
      }
    );
  }
  async getSavedJobById(req: Request, res: Response): Promise<void> {
    const savedJobId: string = req.params.id;

    const savedJob: Either<ErrorClass, SavedJobEntity> =
      await this.getSavedJobByIdUsecase.execute(savedJobId);

    savedJob.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error),
      (result: SavedJobEntity) => {
        const resData = SavedJobMapper.toEntity(result, true);
        this.sendSuccessResponse(res, resData, "Saved job retrieved successfully");
      }
    );
  }

  async updateSavedJob(req: Request, res: Response): Promise<void> {
    const savedJobId: string = req.params.id;
    const savedJobData: SavedJobModel = req.body;

    const existingSavedJob: Either<ErrorClass, SavedJobEntity> =
      await this.getSavedJobByIdUsecase.execute(savedJobId);

    existingSavedJob.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error, 404),
      async (result: SavedJobEntity) => {
        const resData = SavedJobMapper.toEntity(result, true);

        const updatedSavedJobEntity: SavedJobEntity = SavedJobMapper.toEntity(
          savedJobData,
          true,
          resData
        );

        const updatedSavedJob: Either<ErrorClass, SavedJobEntity> =
          await this.updateSavedJobUsecase.execute(
            savedJobId,
            updatedSavedJobEntity
          );

        updatedSavedJob.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (response: SavedJobEntity) => {
            const responseData = SavedJobMapper.toModel(response);
            this.sendSuccessResponse(res, responseData, "Saved job updated successfully");
          }
        );
      }
    );
  }

  async getAllSavedJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    let Id = req.headers.id;
    // let loginId = req.user;
    // loginId = "1"; // For testing purposes, manually set loginId to "2"
    const query: any = {}; // Create an empty query object

    // Assign values to properties of the query object
    query.id = Id;
    query.page = parseInt(req.query.page as string, 10); // Parse 'page' as a number
    query.limit = parseInt(req.query.limit as string, 10); // Parse 'limit' as a number
    const savedJobs: Either<ErrorClass, SavedJobEntity[]> =
      await this.getAllSavedJobsUsecase.execute(query);

    savedJobs.cata(
      (error: ErrorClass) => this.sendErrorResponse(res, error),
      (savedJobs: SavedJobEntity[]) => {
        const resData = savedJobs.map((savedJob: any) =>
          SavedJobMapper.toEntity(savedJob)
        );
        this.sendSuccessResponse(res, resData, "Saved jobs retrieved successfully");
      }
    );
  }
}
