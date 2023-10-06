// Import necessary modules and classes
import { SupportRepository } from "@domain/support/repositories/support-repository"; // Importing SupportRepository from a specific location
import { ErrorClass } from "@presentation/error-handling/api-error"; // Importing ErrorClass from a specific location
import { Either } from "monet"; // Importing Either from the Monet library

// Define an interface for the DeleteSupport use case
export interface DeleteSupportUsecase {
  // Define a method 'execute' that takes a 'supportId' parameter and returns a Promise of 'Either' containing 'ErrorClass' or 'void'
  execute: (supportId: string) => Promise<Either<ErrorClass, void>>;
}

// Define a class called 'DeleteSupport' that implements the 'DeleteSupportUsecase' interface
export class DeleteSupport implements DeleteSupportUsecase {
  // Declare a private member 'supportRepository' of type 'SupportRepository'
  private readonly supportRepository: SupportRepository;

  // Constructor for the 'DeleteSupport' class that takes a 'supportRepository' parameter
  constructor(supportRepository: SupportRepository) {
    // Initialize the 'supportRepository' member with the provided parameter
    this.supportRepository = supportRepository;
  }

  // Implementation of the 'execute' method defined in the 'DeleteSupportUsecase' interface
  async execute(supportId: string): Promise<Either<ErrorClass, void>> {
    // Call the 'deleteSupport' method from the 'supportRepository' and return its result as a Promise
    return await this.supportRepository.deleteSupport(supportId);
  }
}
