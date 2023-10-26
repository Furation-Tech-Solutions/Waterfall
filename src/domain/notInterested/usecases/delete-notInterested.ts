// Import the NotInterestedRepository from a specific location in the project.
import { NotInterestedRepository } from "@domain/notInterested/repositories/notInterested-repository";

// Import the ErrorClass from a specific location in the project.
import { ErrorClass } from "@presentation/error-handling/api-error";

// Import the Either type from the "monet" library for handling either success or failure.
import { Either } from "monet";

// Define an interface for the DeleteNotInterested use case.
export interface DeleteNotInterestedUsecase {
  // Declare a method called "execute" that takes a NotInterestedId (string) and returns a Promise of Either (success or error).
  execute: (SavedjobId: string) => Promise<Either<ErrorClass, void>>;
}

// Define a class named "DeleteNotInterested" that implements the DeleteNotInterestedUsecase interface.
export class DeleteNotInterested implements DeleteNotInterestedUsecase {
  // Declare a private member variable to store the NotInterestedRepository instance.
  private readonly notInterestedRepository: NotInterestedRepository;

  // Create a constructor that accepts a NotInterestedRepository instance as a parameter and initializes the member variable.
  constructor(notInterestedRepository: NotInterestedRepository) {
    this.notInterestedRepository = notInterestedRepository;
  }

  // Implement the "execute" method from the interface.
  async execute(notInterestedId: string): Promise<Either<ErrorClass, void>> {
    // Call the "deleteNotInterested" method of the notInterestedRepository with the provided notInterestedId and return the result.
    // This method should return a Promise that resolves to an Either containing either an ErrorClass or void.
    return await this.notInterestedRepository.deleteNotInterested(notInterestedId);
  }
}