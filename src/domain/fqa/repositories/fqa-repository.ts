import { FQAModel, FQAEntity } from "@domain/fqa/entities/fqa";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";

// Define the FQARepository interface
export interface FQARepository {
  // Method to create a new FQA entry
  createFQA(fqa: FQAModel): Promise<Either<ErrorClass, FQAEntity>>;
  
  // Method to get all FQA entries
  getFQAs(): Promise<Either<ErrorClass, FQAEntity[]>>;
  
  // Method to get an FQA entry by its ID
  getFQAById(id: string): Promise<Either<ErrorClass, FQAEntity>>;
  
  // Method to update an existing FQA entry by its ID
  updateFQA(id: string, data: FQAModel): Promise<Either<ErrorClass, FQAEntity>>;
  
  // Method to delete an FQA entry by its ID
  deleteFQA(id: string): Promise<Either<ErrorClass, void>>;
}
