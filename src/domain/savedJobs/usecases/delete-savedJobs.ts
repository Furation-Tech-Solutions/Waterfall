import { SavedJobRepository } from "@domain/savedJobs/repositories/savedJob-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

export interface DeleteSavedJobUsecase {
  execute: (SavedjobId: string) => Promise<Either<ErrorClass, void>>;
}

export class DeleteSavedJob implements DeleteSavedJobUsecase {
  private readonly savedJobRepository: SavedJobRepository;

  constructor(savedJobRepository: SavedJobRepository) {
    this.savedJobRepository = savedJobRepository;
  }

  async execute(savedJobId: string): Promise<Either<ErrorClass, void>> {
    return await this.savedJobRepository.deleteSavedJob(savedJobId);
  }
}
