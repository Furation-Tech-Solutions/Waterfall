// Import necessary modules and types from external dependencies
import {
  SavedJobEntity,
  SavedJobModel,
} from "@domain/savedJobs/entities/savedJobs";
import { SavedJobRepository } from "@domain/savedJobs/repositories/savedJob-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define an interface for the CreateSavedJob use case
export interface CreateSavedJobUsecase {
  // Define a method called 'execute' that takes 'savedJobData' of type 'SavedJobModel'
  // and returns a Promise that resolves to an 'Either' containing 'ErrorClass' or 'SavedJobEntity'.
  execute: (
    savedJobData: SavedJobModel
  ) => Promise<Either<ErrorClass, SavedJobEntity>>;
}

// Implement the CreateSavedJob use case class that implements the CreateSavedJobUsecase interface
export class CreateSavedJob implements CreateSavedJobUsecase {
  // Declare a private member variable 'savedJobRepository' of type 'SavedJobRepository'
  private readonly savedJobRepository: SavedJobRepository;

  // Constructor for the CreateSavedJob class that takes a 'savedJobRepository' parameter
  constructor(savedJobRepository: SavedJobRepository) {
    // Assign the 'savedJobRepository' parameter to the class member variable
    this.savedJobRepository = savedJobRepository;
  }

  // Implement the 'execute' method from the interface
  async execute(
    savedJobData: SavedJobModel
  ): Promise<Either<ErrorClass, SavedJobEntity>> {
    // Call the 'createSavedJob' method from 'savedJobRepository' with 'savedJobData'
    // and return the result as a Promise
    return await this.savedJobRepository.createSavedJob(savedJobData);
  }
}
