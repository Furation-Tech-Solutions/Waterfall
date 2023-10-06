// Import necessary modules and classes
import { RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define an interface for the DeleteRealtorUsecase
export interface DeleteRealtorUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, void>>;
}

// Implementation of the DeleteRealtor use case
export class DeleteRealtor implements DeleteRealtorUsecase {
  private readonly realtorRepository: RealtorRepository;

  // Constructor to inject the RealtorRepository dependency
  constructor(realtorRepository: RealtorRepository) {
    this.realtorRepository = realtorRepository;
  }

  // Method to execute the use case and delete a Realtor by ID
  async execute(id: string): Promise<Either<ErrorClass, void>> {
    // Call the repository's method to delete a Realtor by ID and return the result
    return await this.realtorRepository.deleteRealtor(id);
  }
}
