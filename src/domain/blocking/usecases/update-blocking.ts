// Import necessary modules and types
import { BlockingEntity, BlockingModel } from "@domain/blocking/entities/blocking";
import { BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define the interface for the UpdateBlockingUsecase
export interface UpdateBlockingUsecase {
  execute: (
    id: string,
    blockingData: BlockingModel
  ) => Promise<Either<ErrorClass, BlockingEntity>>;
}

// Create a class that implements the UpdateBlockingUsecase interface
export class UpdateBlocking implements UpdateBlockingUsecase {
  private readonly blockingRepository: BlockingRepository;

  constructor(blockingRepository: BlockingRepository) {
    this.blockingRepository = blockingRepository;
  }

  // Implement the execute method to update a blocking entity with new data
  async execute(id: string, blockingData: BlockingModel): Promise<Either<ErrorClass, BlockingEntity>> {
    return await this.blockingRepository.updateBlocking(id, blockingData);
  }
}
