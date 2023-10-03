import { NextFunction, Request, Response } from "express";
import { SavedJobEntity, SavedJobModel, SavedJobMapper } from "@domain/savedJobs/entities/savedJobs";
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

  async createSavedJob(req: Request, res: Response): Promise<void> {
    const savedJobData: SavedJobModel = SavedJobMapper.toModel(req.body);

    const newSavedJob: Either<ErrorClass, SavedJobEntity> =
      await this.createSavedJobUsecase.execute(savedJobData);

    newSavedJob.cata(
      (error: ErrorClass) =>
        res.status(error.status).json({ error: error.message }),
      (result: SavedJobEntity) => {
        const resData = SavedJobMapper.toEntity(result, true);
        return res.json(resData);
      }
    );
  }

  // async deleteSavedJob(req: Request, res: Response): Promise<void> {
  //   const savedJobId: string = req.params.id;

  //   const response: Either<ErrorClass, void> =
  //     await this.deleteSavedJobUsecase.execute(savedJobId);

  //   response.cata(
  //     (error: ErrorClass) =>
  //       res.status(error.status).json({ error: error.message }),
  //     () => {
  //       return res.json({ message: "SavedJob deleted successfully." });
  //     }
  //   );
  // }

  // async getSavedJobById(req: Request, res: Response): Promise<void> {
  //   const savedJobId: string = req.params.id;

  //   const savedJob: Either<ErrorClass, SavedJobEntity> =
  //     await this.getSavedJobByIdUsecase.execute(savedJobId);

  //   savedJob.cata(
  //     (error: ErrorClass) =>
  //       res.status(error.status).json({ error: error.message }),
  //     (result: SavedJobEntity) => {
  //       const resData = SavedJobMapper.toEntity(result, true);
  //       return res.json(resData);
  //     }
  //   );
  // }

  // async updateSavedJob(req: Request, res: Response): Promise<void> {
  //   const savedJobId: string = req.params.id;
  //   const savedJobData: SavedJobModel = req.body;

  //   const existingSavedJob: Either<ErrorClass, SavedJobEntity> =
  //     await this.getSavedJobByIdUsecase.execute(savedJobId);

  //   existingSavedJob.cata(
  //     (error: ErrorClass) => {
  //       res.status(error.status).json({ error: error.message });
  //     },
  //     async (result: SavedJobEntity) => {
  //       const resData = SavedJobMapper.toEntity(result, true);

  //       const updatedSavedJobEntity: SavedJobEntity = SavedJobMapper.toEntity(
  //         savedJobData,
  //         true,
  //         resData
  //       );

  //       const updatedSavedJob: Either<ErrorClass, SavedJobEntity> =
  //         await this.updateSavedJobUsecase.execute(savedJobId, updatedSavedJobEntity);

  //       updatedSavedJob.cata(
  //         (error: ErrorClass) => {
  //           res.status(error.status).json({ error: error.message });
  //         },
  //         (response: SavedJobEntity) => {
  //           const responseData = SavedJobMapper.toModel(response);

  //           res.json(responseData);
  //         }
  //       );
  //     }
  //   );
  // }

  // async getAllSavedJobs(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   const savedJobs: Either<ErrorClass, SavedJobEntity[]> =
  //     await this.getAllSavedJobsUsecase.execute();

  //   savedJobs.cata(
  //     (error: ErrorClass) =>
  //       res.status(error.status).json({ error: error.message }),
  //     (savedJobs: SavedJobEntity[]) => {
  //       const resData = savedJobs.map((savedJob: any) => SavedJobMapper.toEntity(savedJob));
  //       return res.json(resData);
  //     }
  //   );
  // }
}
