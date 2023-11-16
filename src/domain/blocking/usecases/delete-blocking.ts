// Import necessary modules and types
import { BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define the interface for the DeleteBlockingUsecase
export interface DeleteBlockingUsecase {
  // Method to execute the use case and delete a blocking entity by ID
  execute: (id: string) => Promise<Either<ErrorClass, void>>;
}

// Create a class that implements the DeleteBlockingUsecase interface
export class DeleteBlocking implements DeleteBlockingUsecase {
  private readonly blockingRepository: BlockingRepository;

  // Constructor to initialize the BlockingRepository dependency
  constructor(blockingRepository: BlockingRepository) {
    this.blockingRepository = blockingRepository;
  }

  // Implement the execute method to delete a blocking entity by ID
  async execute(id: string): Promise<Either<ErrorClass, void>> {
    // Call the deleteBlocking method of the BlockingRepository
    return await this.blockingRepository.deleteBlocking(id);
  }
}
