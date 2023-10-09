// Importing the necessary modules and types
import { SavedJobEntity } from "@domain/savedJobs/entities/savedJobs";
import { SavedJobRepository } from "@domain/savedJobs/repositories/savedJob-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define an interface for the GetSavedJobById use case
export interface GetSavedJobByIdUsecase {
  // Method signature for executing the use case, taking a savedJobId parameter
  // and returning a Promise that resolves to Either an ErrorClass or a SavedJobEntity
  execute: (savedJobId: string) => Promise<Either<ErrorClass, SavedJobEntity>>;
}

// Implement the GetSavedJobById use case
export class GetSavedJobById implements GetSavedJobByIdUsecase {
  // Private member to store the SavedJobRepository instance
  private readonly savedJobRepository: SavedJobRepository;

  // Constructor to initialize the SavedJobRepository instance
  constructor(savedJobRepository: SavedJobRepository) {
    this.savedJobRepository = savedJobRepository;
  }

  // Implementation of the execute method from the interface
  async execute(
    savedJobId: string
  ): Promise<Either<ErrorClass, SavedJobEntity>> {
    // Call the getSavedJobById method of the repository and return its result
    return await this.savedJobRepository.getSavedJobById(savedJobId);
  }
}
