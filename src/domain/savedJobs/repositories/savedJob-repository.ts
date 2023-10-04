import {
  SavedJobEntity,
  SavedJobModel,
} from "@domain/savedJobs/entities/savedJobs";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface SavedJobRepository {
  createSavedJob(
    savedJob: SavedJobModel
  ): Promise<Either<ErrorClass, SavedJobEntity>>;
  updateSavedJob(
    id: string,
    data: SavedJobModel
  ): Promise<Either<ErrorClass, SavedJobEntity>>;
  getSavedJobs(): Promise<Either<ErrorClass, SavedJobEntity[]>>;
  getSavedJobById(id: string): Promise<Either<ErrorClass, SavedJobEntity>>;
  deleteSavedJob(id: string): Promise<Either<ErrorClass, void>>;
}
