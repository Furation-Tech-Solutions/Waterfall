// Import necessary modules and classes
import { FQAEntity, FQAModel } from "@domain/fqa/entities/fqa";
import { FQARepository } from "@domain/fqa/repositories/fqa-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define an interface for the UpdateFQAUsecase
export interface UpdateFQAUsecase {
  execute: (
    id: string,
    fqaData: FQAModel
  ) => Promise<Either<ErrorClass, FQAEntity>>;
}

// Implementation of the UpdateFQA use case
export class UpdateFQA implements UpdateFQAUsecase {
  private readonly fqaRepository: FQARepository;

  // Constructor to inject the FQARepository dependency
  constructor(fqaRepository: FQARepository) {
    this.fqaRepository = fqaRepository;
  }

  // Method to execute the use case and update an FQA entity
  async execute(id: string, fqaData: FQAModel): Promise<Either<ErrorClass, FQAEntity>> {
    // Call the repository's method to update an FQA entity and return the result
    return await this.fqaRepository.updateFQA(id, fqaData);
  }
}
