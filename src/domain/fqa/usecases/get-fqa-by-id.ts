// Import necessary modules and classes
import { FQAEntity } from "@domain/fqa/entities/fqa";
import { FQARepository } from "@domain/fqa/repositories/fqa-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define an interface for the GetFQAById use case
export interface GetFQAByIdUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, FQAEntity>>;
}

// Implementation of the GetFQAById use case
export class GetFQAById implements GetFQAByIdUsecase {
  private readonly fqaRepository: FQARepository;

  // Constructor to inject the FQARepository dependency
  constructor(fqaRepository: FQARepository) {
    this.fqaRepository = fqaRepository;
  }

  // Method to execute the use case and retrieve an FQA entity by its ID
  async execute(id: string): Promise<Either<ErrorClass, FQAEntity>> {
    // Call the repository's method to get an FQA by its ID and return the result
    return await this.fqaRepository.getFQAById(id);
  }
}
