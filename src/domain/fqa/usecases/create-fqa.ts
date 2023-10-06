import { FQAEntity, FQAModel } from "@domain/fqa/entities/fqa";
import { FQARepository } from "@domain/fqa/repositories/fqa-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define the CreateFQAUsecase interface
export interface CreateFQAUsecase {
  // Method to execute the creation of a new FQA entry
  execute: (fqaData: FQAModel) => Promise<Either<ErrorClass, FQAEntity>>;
}

// Create a class named CreateFQA that implements the CreateFQAUsecase interface
export class CreateFQA implements CreateFQAUsecase {
  private readonly FQARepository: FQARepository;

  // Constructor to inject the FQARepository dependency
  constructor(FQARepository: FQARepository) {
    this.FQARepository = FQARepository;
  }

  // Implementation of the execute method defined by the CreateFQAUsecase interface
  async execute(fqaData: FQAModel): Promise<Either<ErrorClass, FQAEntity>> {
    // Call the createFQA method of the FQARepository with the provided fqaData
    return await this.FQARepository.createFQA(fqaData);
  }
}
