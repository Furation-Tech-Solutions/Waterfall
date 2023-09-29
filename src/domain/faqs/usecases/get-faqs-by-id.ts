import { FAQSEntity } from "@domain/faqs/entities/faqs";
import { FAQSRepository } from "@domain/faqs/repositories/faqs-repository";
import { Either } from "monet";
import  ErrorClass  from "@presentation/error-handling/api-error";

export interface GetFAQSByIdUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, FAQSEntity | null>>;
}

export class GetFAQSById implements GetFAQSByIdUsecase {
  private readonly faqsRepository:FAQSRepository;

  constructor(faqsRepository: FAQSRepository) {
    this.faqsRepository = faqsRepository;
  }

  async execute(id: string): Promise<Either<ErrorClass, FAQSEntity | null>> {
    return await this.faqsRepository.getFAQSById(id);
  }
}