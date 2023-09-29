import { FAQSModel, FAQSEntity } from "@domain/faqs/entities/faqs";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface FAQSRepository {
  createFAQS(faqs: FAQSModel): Promise<Either<ErrorClass, FAQSEntity>>;
  getFAQS(): Promise<Either<ErrorClass, FAQSEntity[]>>;
  getFAQSById(id: string): Promise<Either<ErrorClass, FAQSEntity | null>>;
  updateFAQS(id: string, data: FAQSModel): Promise<Either<ErrorClass, FAQSEntity>>;
}


