import { type FAQRepository } from "@domain/faq/repositories/faq-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

// Define the DeleteFAQUsecase interface
export interface DeleteFAQUsecase {
  // Method to execute the deletion of an FAQ entry by its ID
  execute: (id: string) => Promise<Either<ErrorClass, void>>;
}

// Create a class named DeleteFAQ that implements the DeleteFAQUsecase interface
export class DeleteFAQ implements DeleteFAQUsecase {
  private readonly faqRepository: FAQRepository;

  // Constructor to inject the FAQRepository dependency
  constructor(faqRepository: FAQRepository) {
    this.faqRepository = faqRepository;
  }

  // Implementation of the execute method defined by the DeleteFAQUsecase interface
  async execute(id: string): Promise<Either<ErrorClass, void>> {
    // Call the deleteFAQ method of the FAQRepository with the provided ID
    return await this.faqRepository.deleteFAQ(id);
  }
}
