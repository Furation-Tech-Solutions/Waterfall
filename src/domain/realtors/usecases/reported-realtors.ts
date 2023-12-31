
// Import necessary modules and classes
import { RealtorEntity } from "@domain/realtors/entities/realtors";
import { RealtorRepository } from "@domain/realtors/repositories/realtor-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define an interface for the GetAllRealtorsUsecase
export interface GetAllReportedRealtorsUsecase {
  execute: (query: object) => Promise<Either<ErrorClass, RealtorEntity[]>>;
}

// Implementation of the GetAllRealtors use case
export class GetAllReportedRealtors implements GetAllReportedRealtorsUsecase {
  private readonly realtorRepository: RealtorRepository;

  // Constructor to inject the RealtorRepository dependency
  constructor(realtorRepository: RealtorRepository) {
    this.realtorRepository = realtorRepository;
  }

  // Method to execute the use case and retrieve all Realtors
  async execute(query: object): Promise<Either<ErrorClass, RealtorEntity[]>> {
    // Call the repository's method to retrieve all Realtors and return the result
    return await this.realtorRepository.reportedRealtors(query);
  }
}
