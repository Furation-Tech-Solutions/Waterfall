// Import necessary modules and types from external dependencies
import { SupportEntity, SupportModel } from "@domain/support/entities/support"; // Import SupportEntity and SupportModel from the support module
import { SupportRepository } from "@domain/support/repositories/support-repository"; // Import SupportRepository from the support repository module
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import ErrorClass from the error-handling module
import { Either } from "monet"; // Import the Either type from the 'monet' library
import { ScrapperEntity, ScrapperModel } from "../entities/scrapper";
import { ScrapperRepository } from "../repositories/scrapper-repository";

// Define an interface for the CreateSupport use case
export interface GetScrapperUsecase {
  execute: (
    scrapperData: ScrapperModel
  ) => Promise<Either<ErrorClass, ScrapperEntity>>;
}

// Implement the CreateSupportUsecase interface with the CreateSupport class
export class GetScrapper implements GetScrapperUsecase {
  private readonly scrapperRepository: ScrapperRepository;

  // Constructor for the CreateSupport class, taking a SupportRepository instance as a parameter
  constructor(scrapperRepository: ScrapperRepository) {
    this.scrapperRepository = scrapperRepository; // Assign the provided SupportRepository to the instance variable
  }

  // Implementation of the 'execute' method defined in the CreateSupportUsecase interface
  async execute(
    scrapperData: ScrapperModel
  ): Promise<Either<ErrorClass, ScrapperEntity>> {
    return await this.scrapperRepository.getScrapper(scrapperData); // Call the 'createSupport' method of the SupportRepository and return the result
  }
}
