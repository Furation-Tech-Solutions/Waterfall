// Import necessary modules and classes
import { RealtorEntity, RealtorModel } from "@domain/realtors/entities/realtors";
import { RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define an interface for the CreateRealtorUsecase
export interface CreateRealtorUsecase {
  execute: (realtorData: RealtorModel) => Promise<Either<ErrorClass, RealtorEntity>>;
}

// Implementation of the CreateRealtor use case
export class CreateRealtor implements CreateRealtorUsecase {
  private readonly RealtorRepository: RealtorRepository;

  // Constructor to inject the RealtorRepository dependency
  constructor(RealtorRepository: RealtorRepository) {
    this.RealtorRepository = RealtorRepository;
  }

  // Method to execute the use case and create a new Realtor
  async execute(realtorData: RealtorModel): Promise<Either<ErrorClass, RealtorEntity>> {
    // Call the repository's method to create a new Realtor and return the result
    return await this.RealtorRepository.createRealtor(realtorData);
  }
}
