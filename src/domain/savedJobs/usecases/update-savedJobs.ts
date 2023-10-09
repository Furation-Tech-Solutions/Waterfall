import { JobEntity, JobModel } from "@domain/job/entities/job";
import { SavedJobRepository } from "@domain/savedJobs/repositories/savedJob-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
import { SavedJobModel, SavedJobEntity} from "@domain/savedJobs/entities/savedJobs";
export interface UpdateSavedJobUsecase {
  execute: (
    savedJobId: string,
    savedJobData: SavedJobModel
  ) => Promise<Either<ErrorClass, SavedJobEntity>>;
}

export class UpdateSavedJob implements UpdateSavedJobUsecase {
  private readonly savedJobRepository: SavedJobRepository;

  constructor(savedJobRepository: SavedJobRepository) {
    this.savedJobRepository = savedJobRepository;
  }

  async execute(
    savedJobId: string,
    savedJobData: SavedJobModel
  ): Promise<Either<ErrorClass, SavedJobEntity>> {
    return await this.savedJobRepository.updateSavedJob(savedJobId, savedJobData);
  }
}
