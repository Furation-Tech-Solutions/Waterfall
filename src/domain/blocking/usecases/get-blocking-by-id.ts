// Import necessary modules and types
import { BlockingEntity } from "@domain/blocking/entities/blocking";
import { BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define the interface for the GetBlockingByIdUsecase
export interface GetBlockingByIdUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, BlockingEntity>>;
}

// Create a class that implements the GetBlockingByIdUsecase interface
export class GetBlockingById implements GetBlockingByIdUsecase {
  private readonly blockingRepository: BlockingRepository;

  constructor(blockingRepository: BlockingRepository) {
    this.blockingRepository = blockingRepository;
  }

  // Implement the execute method to retrieve a blocking entity by its ID
  async execute(id: string): Promise<Either<ErrorClass, BlockingEntity>> {
    return await this.blockingRepository.getBlockingById(id);
  }
}
