// Import necessary modules and classes
import { RealtorEntity, RealtorModel } from "@domain/realtors/entities/realtors";
import { RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define an interface for the UpdateRealtorUsecase
export interface UpdateRealtorUsecase {
  execute: (
    id: string,
    realtorData: RealtorModel
  ) => Promise<Either<ErrorClass, RealtorEntity>>;
}

// Implementation of the UpdateRealtor use case
export class UpdateRealtor implements UpdateRealtorUsecase {
  private readonly realtorRepository: RealtorRepository;

  // Constructor to inject the RealtorRepository dependency
  constructor(realtorRepository: RealtorRepository) {
    this.realtorRepository = realtorRepository;
  }

  // Method to execute the use case and update a Realtor by ID
  async execute(id: string, realtorData: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>> {
    // Call the repository's method to update a Realtor by ID and return the result
    return await this.realtorRepository.updateRealtor(id, realtorData);
  }
}
