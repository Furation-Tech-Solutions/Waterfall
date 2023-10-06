// Import necessary modules and classes
import { SupportEntity } from "@domain/support/entities/support"; // Import SupportEntity from the support module
import { SupportRepository } from "@domain/support/repositories/support-repository"; // Import SupportRepository from the support module
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import ErrorClass from the error-handling module
import { Either } from "monet"; // Import the Either type from the Monet library

// Define an interface for the GetAllSupports use case
export interface GetAllSupportsUsecase {
  execute: () => Promise<Either<ErrorClass, SupportEntity[]>>; // A method 'execute' that returns a Promise of Either<ErrorClass, SupportEntity[]>
}

// Implement the GetAllSupportsUsecase interface
export class GetAllSupports implements GetAllSupportsUsecase {
  private readonly supportRepository: SupportRepository; // Private property to store a SupportRepository instance

  // Constructor to initialize the GetAllSupports class with a SupportRepository instance
  constructor(supportRepository: SupportRepository) {
    this.supportRepository = supportRepository;
  }

  // Implementation of the 'execute' method defined in the interface
  async execute(): Promise<Either<ErrorClass, SupportEntity[]>> {
    // Call the 'getSupports' method from the support repository and return the result
    return await this.supportRepository.getSupports();
  }
}
