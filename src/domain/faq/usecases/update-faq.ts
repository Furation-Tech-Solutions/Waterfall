// Import necessary modules and classes
import { FAQEntity, FAQModel } from "@domain/faq/entities/faq";
import { FAQRepository } from "@domain/faq/repositories/faq-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define an interface for the UpdateFAQUsecase
export interface UpdateFAQUsecase {
  execute: (
    id: string,
    faqData: FAQModel
  ) => Promise<Either<ErrorClass, FAQEntity>>;
}

// Implementation of the UpdateFAQ use case
export class UpdateFAQ implements UpdateFAQUsecase {
  private readonly faqRepository: FAQRepository;

  // Constructor to inject the FAQRepository dependency
  constructor(faqRepository: FAQRepository) {
    this.faqRepository = faqRepository;
  }

  // Method to execute the use case and update an FAQ entity
  async execute(
    id: string,
    faqData: FAQModel
  ): Promise<Either<ErrorClass, FAQEntity>> {
    // Call the repository's method to update an FAQ entity and return the result
    return await this.faqRepository.updateFAQ(id, faqData);
  }
}
