// Import necessary modules and types from external dependencies
import { SupportEntity, SupportModel } from "@domain/support/entities/support"; // Import SupportEntity and SupportModel from the support module
import { SupportRepository } from "@domain/support/repositories/support-repository"; // Import SupportRepository from the support repository module
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import ErrorClass from the error-handling module
import { Either } from "monet"; // Import the Either type from the 'monet' library

// Define an interface for the CreateSupport use case
export interface CreateSupportUsecase {
  execute: (
    supportData: SupportModel
  ) => Promise<Either<ErrorClass, SupportEntity>>;
}

// Implement the CreateSupportUsecase interface with the CreateSupport class
export class CreateSupport implements CreateSupportUsecase {
  private readonly supportRepository: SupportRepository;

  // Constructor for the CreateSupport class, taking a SupportRepository instance as a parameter
  constructor(supportRepository: SupportRepository) {
    this.supportRepository = supportRepository; // Assign the provided SupportRepository to the instance variable
  }

  // Implementation of the 'execute' method defined in the CreateSupportUsecase interface
  async execute(
    supportData: SupportModel
  ): Promise<Either<ErrorClass, SupportEntity>> {
    return await this.supportRepository.createSupport(supportData); // Call the 'createSupport' method of the SupportRepository and return the result
  }
}
