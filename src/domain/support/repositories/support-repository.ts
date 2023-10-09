// Import necessary dependencies and modules
import { SupportEntity, SupportModel } from "@domain/support/entities/support"; // Import SupportEntity and SupportModel from a specific location
import { Either } from "monet"; // Import the Either type from the Monet library
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass from the specified location

// Define an interface for the SupportRepository
export interface SupportRepository {
  // Define a method to create a new support entry
  createSupport(
    support: SupportModel
  ): Promise<Either<ErrorClass, SupportEntity>>;

  // Define a method to delete a support entry by its ID
  deleteSupport(id: string): Promise<Either<ErrorClass, void>>;

  // Define a method to update a support entry by its ID and data
  updateSupport(
    id: string,
    data: SupportModel
  ): Promise<Either<ErrorClass, SupportEntity>>;

  // Define a method to get all support entries
  getSupports(): Promise<Either<ErrorClass, SupportEntity[]>>;

  // Define a method to get a support entry by its ID
  getSupportById(id: string): Promise<Either<ErrorClass, SupportEntity>>;
}
