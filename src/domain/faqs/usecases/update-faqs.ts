import { FAQSEntity, FAQSModel } from "@domain/faqs/entities/faqs";
import { FAQSRepository } from "@domain/faqs/repositories/faqs-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";

export interface UpdateFAQSUsecase {
  execute: (
    id: string,
    faqsData: FAQSModel
  ) => Promise<Either<ErrorClass, FAQSEntity>>;
}

export class UpdateFAQS implements UpdateFAQSUsecase {
  private readonly faqsRepository: FAQSRepository;

  constructor(faqsRepository: FAQSRepository) {
    this.faqsRepository = faqsRepository;
  }

  async execute(id: string, faqsData: FAQSModel): Promise<Either<ErrorClass, FAQSEntity>> {
    return await this.faqsRepository.updateFAQS(id, faqsData);
  }
}
