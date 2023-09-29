import { type FAQSRepository } from "@domain/faqs/repositories/faqs-repository";
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";
export interface DeleteFAQSUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, void>>
}

export class DeleteFAQS implements DeleteFAQSUsecase {
  private readonly faqsRepository: FAQSRepository;

  constructor(faqsRepository: FAQSRepository) {
    this.faqsRepository = faqsRepository;
  }

  async execute(id: string): Promise<Either<ErrorClass, void>> {
    return await this.faqsRepository.deleteFAQS(id);
  }
}
