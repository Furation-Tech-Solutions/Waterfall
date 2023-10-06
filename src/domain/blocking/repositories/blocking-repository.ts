// Import necessary types and classes
import { BlockingModel, BlockingEntity } from "@domain/blocking/entities/blocking";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";

// Define the BlockingRepository interface
export interface BlockingRepository {
  // Method to create a blocking entity
  createBlocking(blocking: BlockingModel): Promise<Either<ErrorClass, BlockingEntity>>;

  // Method to get a list of blocking entities
  getBlockings(): Promise<Either<ErrorClass, BlockingEntity[]>>;

  // Method to get a blocking entity by its ID
  getBlockingById(id: string): Promise<Either<ErrorClass, BlockingEntity>>;

  // Method to update a blocking entity by its ID
  updateBlocking(id: string, data: BlockingModel): Promise<Either<ErrorClass, BlockingEntity>>;

  // Method to delete a blocking entity by its ID
  deleteBlocking(id: string): Promise<Either<ErrorClass, void>>;
}
