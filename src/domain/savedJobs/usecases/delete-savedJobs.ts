// Import the SavedJobRepository from a specific location in the project.
import { SavedJobRepository } from "@domain/savedJobs/repositories/savedJob-repository";

// Import the ErrorClass from a specific location in the project.
import { ErrorClass } from "@presentation/error-handling/api-error";

// Import the Either type from the "monet" library for handling either success or failure.
import { Either } from "monet";

// Define an interface for the DeleteSavedJob use case.
export interface DeleteSavedJobUsecase {
  // Declare a method called "execute" that takes a SavedJobId (string) and returns a Promise of Either (success or error).
  execute: (SavedjobId: string) => Promise<Either<ErrorClass, void>>;
}

// Define a class named "DeleteSavedJob" that implements the DeleteSavedJobUsecase interface.
export class DeleteSavedJob implements DeleteSavedJobUsecase {
  // Declare a private member variable to store the SavedJobRepository instance.
  private readonly savedJobRepository: SavedJobRepository;

  // Create a constructor that accepts a SavedJobRepository instance as a parameter and initializes the member variable.
  constructor(savedJobRepository: SavedJobRepository) {
    this.savedJobRepository = savedJobRepository;
  }

  // Implement the "execute" method from the interface.
  async execute(savedJobId: string): Promise<Either<ErrorClass, void>> {
    // Call the "deleteSavedJob" method of the savedJobRepository with the provided savedJobId and return the result.
    // This method should return a Promise that resolves to an Either containing either an ErrorClass or void.
    return await this.savedJobRepository.deleteSavedJob(savedJobId);
  }
}
