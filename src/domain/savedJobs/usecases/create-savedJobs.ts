import {
  SavedJobEntity,
  SavedJobModel,
} from "@domain/savedJobs/entities/savedJobs";
import { SavedJobRepository } from "@domain/savedJobs/repositories/savedJob-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface CreateSavedJobUsecase {
  execute: (
    savedJobData: SavedJobModel
  ) => Promise<Either<ErrorClass, SavedJobEntity>>;
}

export class CreateSavedJob implements CreateSavedJobUsecase {
  private readonly savedJobRepository: SavedJobRepository;

  constructor(savedJobRepository: SavedJobRepository) {
    this.savedJobRepository = savedJobRepository;
  }

  async execute(
    savedJobData: SavedJobModel
  ): Promise<Either<ErrorClass, SavedJobEntity>> {
    return await this.savedJobRepository.createSavedJob(savedJobData);
  }
}
