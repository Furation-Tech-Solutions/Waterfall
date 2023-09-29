import { FAQSEntity, FAQSModel } from "@domain/faqs/entities/faqs";
import { FAQSRepository } from "@domain/faqs/repositories/faqs-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface CreateFAQSUsecase {
  execute: (faqsData: FAQSModel) => Promise<Either<ErrorClass, FAQSEntity>>;
}

export class CreateFAQS implements CreateFAQSUsecase {
  private readonly FAQSRepository: FAQSRepository;

  constructor(FAQSRepository: FAQSRepository) {
    this.FAQSRepository = FAQSRepository;
  }

  async execute(faqsData: FAQSModel): Promise<Either<ErrorClass, FAQSEntity>> {
    return await this.FAQSRepository.createFAQS(faqsData);
  }
}