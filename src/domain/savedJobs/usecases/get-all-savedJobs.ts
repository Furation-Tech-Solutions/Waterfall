// Import necessary dependencies and modules
import { SavedJobEntity } from "@domain/savedJobs/entities/savedJobs";
import { SavedJobRepository } from "@domain/savedJobs/repositories/savedJob-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define an interface for the GetAllSavedJobs use case
export interface GetAllSavedJobsUsecase {
  // Define a method called "execute" that returns a Promise
  // It returns an Either type which represents a result that can be either an Error or an array of SavedJobEntity objects
  execute: () => Promise<Either<ErrorClass, SavedJobEntity[]>>;
}

// Implement the GetAllSavedJobs use case
export class GetAllSavedJobs implements GetAllSavedJobsUsecase {
  private readonly savedJobRepository: SavedJobRepository;

  // Constructor that takes a SavedJobRepository as a parameter
  constructor(savedJobRepository: SavedJobRepository) {
    // Initialize the savedJobRepository property with the provided repository
    this.savedJobRepository = savedJobRepository;
  }

  // Implementation of the "execute" method defined in the interface
  async execute(): Promise<Either<ErrorClass, SavedJobEntity[]>> {
    // Call the "getSavedJobs" method of the savedJobRepository to fetch saved jobs data
    return await this.savedJobRepository.getSavedJobs();
  }
}
