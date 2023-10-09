// Import necessary modules and types
import { BlockingEntity, BlockingModel } from "@domain/blocking/entities/blocking";
import { BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define the interface for the CreateBlockingUsecase
export interface CreateBlockingUsecase {
  execute: (blockingData: BlockingModel) => Promise<Either<ErrorClass, BlockingEntity>>;
}

// Create a class that implements the CreateBlockingUsecase interface
export class CreateBlocking implements CreateBlockingUsecase {
  private readonly BlockingRepository: BlockingRepository;

  constructor(BlockingRepository: BlockingRepository) {
    this.BlockingRepository = BlockingRepository;
  }

  // Implement the execute method to create a blocking entity
  async execute(blockingData: BlockingModel): Promise<Either<ErrorClass, BlockingEntity>> {
    return await this.BlockingRepository.createBlocking(blockingData);
  }
}
