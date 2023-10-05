import { SavedJobEntity } from "@domain/savedJobs/entities/savedJobs";
import { SavedJobRepository } from "@domain/savedJobs/repositories/savedJob-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface GetSavedJobByIdUsecase {
  execute: (savedJobId: string) => Promise<Either<ErrorClass, SavedJobEntity>>;
}

export class GetSavedJobById implements GetSavedJobByIdUsecase {
  private readonly savedJobRepository: SavedJobRepository;

  constructor(savedJobRepository: SavedJobRepository) {
    this.savedJobRepository = savedJobRepository;
  }

  async execute(savedJobId: string): Promise<Either<ErrorClass, SavedJobEntity>> {
    return await this.savedJobRepository.getSavedJobById(savedJobId);
  }
}
