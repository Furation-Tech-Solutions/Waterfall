// Import statements for required modules and classes
import { JobEntity, JobModel } from "@domain/job/entities/job";
import { SavedJobRepository } from "@domain/savedJobs/repositories/savedJob-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";
import {
  SavedJobModel,
  SavedJobEntity,
} from "@domain/savedJobs/entities/savedJobs";

// Define an interface for the 'UpdateSavedJob' use case
export interface UpdateSavedJobUsecase {
  // Define the 'execute' method with two parameters:
  // 1. 'savedJobId' (a string representing the ID of the saved job to update)
  // 2. 'savedJobData' (a 'SavedJobModel' containing the updated data)
  // The method returns a Promise that resolves to either an 'ErrorClass' or a 'SavedJobEntity'
  execute: (
    savedJobId: string,
    savedJobData: SavedJobModel
  ) => Promise<Either<ErrorClass, SavedJobEntity>>;
}

// Define the 'UpdateSavedJob' class which implements the 'UpdateSavedJobUsecase' interface
export class UpdateSavedJob implements UpdateSavedJobUsecase {
  // Private property to hold a reference to the 'SavedJobRepository'
  private readonly savedJobRepository: SavedJobRepository;

  // Constructor to initialize the 'savedJobRepository' property
  constructor(savedJobRepository: SavedJobRepository) {
    this.savedJobRepository = savedJobRepository;
  }

  // Implementation of the 'execute' method
  async execute(
    savedJobId: string,
    savedJobData: SavedJobModel
  ): Promise<Either<ErrorClass, SavedJobEntity>> {
    // Call the 'updateSavedJob' method of the 'savedJobRepository' to update the saved job
    return await this.savedJobRepository.updateSavedJob(
      savedJobId,
      savedJobData
    );
  }
}
