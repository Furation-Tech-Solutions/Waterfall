// Import necessary modules and types
import { BlockingEntity } from "@domain/blocking/entities/blocking";
import { BlockingRepository } from "@domain/blocking/repositories/blocking-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define the interface for the GetBlockingByIdUsecase
export interface IsUserBlockedUsecase {
  execute: (id: string, blockingId: string) => Promise<Either<ErrorClass, BlockingEntity>>;
}

// Create a class that implements the GetBlockingByIdUsecase interface
export class IsUserBlocked implements IsUserBlockedUsecase {
  private readonly blockingRepository: BlockingRepository;

  constructor(blockingRepository: BlockingRepository) {
    this.blockingRepository = blockingRepository;
  }

  // Implement the execute method to retrieve a blocking entity by its ID
  async execute(id: string, blockingId: string): Promise<Either<ErrorClass, BlockingEntity>> {
    return await this.blockingRepository.isUserBlocked(id, blockingId);
  }
}
