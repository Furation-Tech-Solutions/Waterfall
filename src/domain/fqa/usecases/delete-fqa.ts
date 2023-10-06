import { type FQARepository } from "@domain/fqa/repositories/fqa-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define the DeleteFQAUsecase interface
export interface DeleteFQAUsecase {
  // Method to execute the deletion of an FQA entry by its ID
  execute: (id: string) => Promise<Either<ErrorClass, void>>;
}

// Create a class named DeleteFQA that implements the DeleteFQAUsecase interface
export class DeleteFQA implements DeleteFQAUsecase {
  private readonly fqaRepository: FQARepository;

  // Constructor to inject the FQARepository dependency
  constructor(fqaRepository: FQARepository) {
    this.fqaRepository = fqaRepository;
  }

  // Implementation of the execute method defined by the DeleteFQAUsecase interface
  async execute(id: string): Promise<Either<ErrorClass, void>> {
    // Call the deleteFQA method of the FQARepository with the provided ID
    return await this.fqaRepository.deleteFQA(id);
  }
}
