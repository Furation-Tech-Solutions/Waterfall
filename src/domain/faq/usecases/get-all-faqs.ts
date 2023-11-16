// Import necessary modules and classes
import { FAQEntity } from "@domain/faq/entities/faq";
import { FAQRepository } from "@domain/faq/repositories/faq-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define an interface for the GetAllFAQs use case
export interface GetAllFAQsUsecase {
  execute: () => Promise<Either<ErrorClass, FAQEntity[]>>;
}

// Implementation of the GetAllFAQs use case
export class GetAllFAQs implements GetAllFAQsUsecase {
  private readonly faqRepository: FAQRepository;

  // Constructor to inject the FAQRepository dependency
  constructor(faqRepository: FAQRepository) {
    this.faqRepository = faqRepository;
  }

  // Method to execute the use case and retrieve all FAQs
  async execute(): Promise<Either<ErrorClass, FAQEntity[]>> {
    // Call the repository's method to get all FAQs and return the result
    return await this.faqRepository.getFAQs();
  }
}
