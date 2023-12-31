// Import necessary types and classes
import {
  BlockingModel,
  BlockingEntity,
} from "@domain/blocking/entities/blocking";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { BlockQuery } from "@data/blocking/datasources/blocking-data-source";

// Define the BlockingRepository interface
export interface BlockingRepository {
  // Method to create a blocking entity
  createBlocking(
    blocking: any
  ): Promise<Either<ErrorClass, BlockingEntity>>;

  // Method to get a list of blocking entities
  getBlockings(
    query: BlockQuery
  ): Promise<Either<ErrorClass, BlockingEntity[]>>;

  // Method to get a blocking entity by its ID
  getBlockingById(id: string): Promise<Either<ErrorClass, BlockingEntity>>;

  // Method to check if a user is blocked
  isUserBlocked(id: string, blockingId: string): Promise<Either<ErrorClass, BlockingEntity>>;
  // Method to update a blocking entity by its ID
  updateBlocking(
    id: string,
    data: BlockingModel
  ): Promise<Either<ErrorClass, BlockingEntity>>;

  // Method to delete a blocking entity by its ID
  deleteBlocking(id: string): Promise<Either<ErrorClass, void>>;
}
