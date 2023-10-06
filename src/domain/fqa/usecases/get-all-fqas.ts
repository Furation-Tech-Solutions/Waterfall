// Import necessary modules and classes
import { FQAEntity } from "@domain/fqa/entities/fqa";
import { FQARepository } from "@domain/fqa/repositories/fqa-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define an interface for the GetAllFQAs use case
export interface GetAllFQAsUsecase {
  execute: () => Promise<Either<ErrorClass, FQAEntity[]>>;
}

// Implementation of the GetAllFQAs use case
export class GetAllFQAs implements GetAllFQAsUsecase {
  private readonly fqaRepository: FQARepository;

  // Constructor to inject the FQARepository dependency
  constructor(fqaRepository: FQARepository) {
    this.fqaRepository = fqaRepository;
  }

  // Method to execute the use case and retrieve all FQAs
  async execute(): Promise<Either<ErrorClass, FQAEntity[]>> {
    // Call the repository's method to get all FQAs and return the result
    return await this.fqaRepository.getFQAs();
  }
}
