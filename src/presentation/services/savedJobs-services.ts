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

// Create a class for the SavedJobService
export class SavedJobService {
  private readonly createSavedJobUsecase: CreateSavedJobUsecase;
  private readonly deleteSavedJobUsecase: DeleteSavedJobUsecase;
  private readonly getSavedJobByIdUsecase: GetSavedJobByIdUsecase;
  private readonly updateSavedJobUsecase: UpdateSavedJobUsecase;
  private readonly getAllSavedJobsUsecase: GetAllSavedJobsUsecase;

  // Constructor to initialize dependencies
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

  // Function to create a new saved job
  async createSavedJob(req: Request, res: Response): Promise<void> {
    // Extract saved job data from the request body
    const savedJobData: SavedJobModel = SavedJobMapper.toModel(req.body);

    // Execute the createSavedJobUsecase and handle the result using Either
    const newSavedJob: Either<ErrorClass, SavedJobEntity> =
      await this.createSavedJobUsecase.execute(savedJobData);

    // Handle the result and send a JSON response
    newSavedJob.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: SavedJobEntity) => {
        const resData = SavedJobMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Function to delete a saved job
  async deleteSavedJob(req: Request, res: Response): Promise<void> {
    // Extract saved job ID from the request parameters
    const savedJobId: string = req.params.id;

    // Execute the deleteSavedJobUsecase and handle the result using Either
    const response: Either<ErrorClass, void> =
      await this.deleteSavedJobUsecase.execute(savedJobId);

    // Handle the result and send a JSON response
    response.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      () => {
        return res.json({ message: "SavedJob deleted successfully." });
      }
    );
  }

  // Function to get a saved job by ID
  async getSavedJobById(req: Request, res: Response): Promise<void> {
    // Extract saved job ID from the request parameters
    const savedJobId: string = req.params.id;

    // Execute the getSavedJobByIdUsecase and handle the result using Either
    const savedJob: Either<ErrorClass, SavedJobEntity> =
      await this.getSavedJobByIdUsecase.execute(savedJobId);

    // Handle the result and send a JSON response
    savedJob.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: SavedJobEntity) => {
        const resData = SavedJobMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // Function to update a saved job
  async updateSavedJob(req: Request, res: Response): Promise<void> {
    // Extract saved job ID from the request parameters
    const savedJobId: string = req.params.id;
    // Extract saved job data from the request body
    const savedJobData: SavedJobModel = req.body;

    // Execute the getSavedJobByIdUsecase to fetch the existing saved job
    const existingSavedJob: Either<ErrorClass, SavedJobEntity> =
      await this.getSavedJobByIdUsecase.execute(savedJobId);

    // Handle the result of fetching the existing saved job
    existingSavedJob.cata(
      (error: ErrorClass) => {
        res.status(error.status).json({ error: error.message });
      },
      async (result: SavedJobEntity) => {
        const resData = SavedJobMapper.toEntity(result, true);

        // Map the updated saved job data to an entity
        const updatedSavedJobEntity: SavedJobEntity = SavedJobMapper.toEntity(
          savedJobData,
          true,
          resData
        );

        // Execute the updateSavedJobUsecase and handle the result using Either
        const updatedSavedJob: Either<ErrorClass, SavedJobEntity> =
          await this.updateSavedJobUsecase.execute(
            savedJobId,
            updatedSavedJobEntity
          );

        // Handle the result and send a JSON response
        updatedSavedJob.cata(
          (error: ErrorClass) => {
            res.status(error.status).json({ error: error.message });
          },
          (response: SavedJobEntity) => {
            const responseData = SavedJobMapper.toModel(response);

            res.json(responseData);
          }
        );
      }
    );
  }

  // Function to get all saved jobs
  async getAllSavedJobs(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Execute the getAllSavedJobsUsecase and handle the result using Either
    const savedJobs: Either<ErrorClass, SavedJobEntity[]> =
      await this.getAllSavedJobsUsecase.execute();

    // Handle the result and send a JSON response
    savedJobs.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (savedJobs: SavedJobEntity[]) => {
        const resData = savedJobs.map((savedJob: any) =>
          SavedJobMapper.toEntity(savedJob)
        );
        return res.json(resData);
      }
    );
  }
}
