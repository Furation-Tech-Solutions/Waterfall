import { FAQSEntity } from "@domain/faqs/entities/faqs";
import { FAQSRepository } from "@domain/faqs/repositories/faqs-repository";
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetAllFAQSsUsecase {
  execute: () => Promise<Either<ErrorClass, FAQSEntity[]>>;
}

export class GetAllFAQSs implements GetAllFAQSsUsecase {
  private readonly faqsRepository: FAQSRepository;

  constructor(faqsRepository: FAQSRepository) {
    this.faqsRepository = faqsRepository;
  }

  async execute(): Promise<Either<ErrorClass, FAQSEntity[]>> {
    return await this.faqsRepository.getFAQS();
  }
}
