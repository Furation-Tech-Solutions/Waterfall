// Import necessary modules and classes
import { FAQEntity } from "@domain/faq/entities/faq";
import { FAQRepository } from "@domain/faq/repositories/faq-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define an interface for the GetFAQById use case
export interface GetFAQByIdUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, FAQEntity>>;
}

// Implementation of the GetFAQById use case
export class GetFAQById implements GetFAQByIdUsecase {
  private readonly faqRepository: FAQRepository;

  // Constructor to inject the FAQRepository dependency
  constructor(faqRepository: FAQRepository) {
    this.faqRepository = faqRepository;
  }

  // Method to execute the use case and retrieve an FAQ entity by its ID
  async execute(id: string): Promise<Either<ErrorClass, FAQEntity>> {
    // Call the repository's method to get an FAQ by its ID and return the result
    return await this.faqRepository.getFAQById(id);
  }
}
