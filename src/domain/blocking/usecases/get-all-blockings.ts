// Import necessary modules and types
import { BlockingEntity } from "@domain/blocking/entities/blocking";
import { BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define the interface for the GetAllBlockingsUsecase
export interface GetAllBlockingsUsecase {
  execute: () => Promise<Either<ErrorClass, BlockingEntity[]>>;
}

// Create a class that implements the GetAllBlockingsUsecase interface
export class GetAllBlockings implements GetAllBlockingsUsecase {
  private readonly blockingRepository: BlockingRepository;

  constructor(blockingRepository: BlockingRepository) {
    this.blockingRepository = blockingRepository;
  }

  // Implement the execute method to retrieve all blocking entities
  async execute(): Promise<Either<ErrorClass, BlockingEntity[]>> {
    return await this.blockingRepository.getBlockings();
  }
}
