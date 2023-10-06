// Import necessary modules and classes
import { RealtorEntity } from "@domain/realtors/entities/realtors";
import { RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define an interface for the GetRealtorByIdUsecase
export interface GetRealtorByIdUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, RealtorEntity>>;
}

// Implementation of the GetRealtorById use case
export class GetRealtorById implements GetRealtorByIdUsecase {
  private readonly realtorRepository: RealtorRepository;

  // Constructor to inject the RealtorRepository dependency
  constructor(realtorRepository: RealtorRepository) {
    this.realtorRepository = realtorRepository;
  }

  // Method to execute the use case and retrieve a Realtor by ID
  async execute(id: string): Promise<Either<ErrorClass, RealtorEntity>> {
    // Call the repository's method to retrieve a Realtor by ID and return the result
    return await this.realtorRepository.getRealtorById(id);
  }
}
