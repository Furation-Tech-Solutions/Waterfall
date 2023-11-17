import { FAQEntity, FAQModel } from "@domain/faq/entities/faq";
import { FAQRepository } from "@domain/faq/repositories/faq-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define the CreateFAQUsecase interface
export interface CreateFAQUsecase {
  // Method to execute the creation of a new FAQ entry
  execute: (faqData: FAQModel) => Promise<Either<ErrorClass, FAQEntity>>;
}

// Create a class named CreateFAQ that implements the CreateFAQUsecase interface
export class CreateFAQ implements CreateFAQUsecase {
  private readonly FAQRepository: FAQRepository;

  // Constructor to inject the FAQRepository dependency
  constructor(FAQRepository: FAQRepository) {
    this.FAQRepository = FAQRepository;
  }

  // Implementation of the execute method defined by the CreateFAQUsecase interface
  async execute(faqData: FAQModel): Promise<Either<ErrorClass, FAQEntity>> {
    // Call the createFAQ method of the FAQRepository with the provided faqData
    return await this.FAQRepository.createFAQ(faqData);
  }
}
