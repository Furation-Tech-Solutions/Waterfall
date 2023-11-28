// Import necessary dependencies and modules
import { Either } from "monet"; // Import the Either type from the Monet library
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass from the specified location
import { ScrapperEntity, ScrapperModel } from "../entities/scrapper";

// Define an interface for the SupportRepository
export interface ScrapperRepository {
  // Define a method to create a new support entry
  getScrapper(
    scrapper: ScrapperModel
  ): Promise<Either<ErrorClass, ScrapperEntity>>;


}
