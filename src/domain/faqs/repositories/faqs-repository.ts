import { FAQSModel, FAQSEntity } from "@domain/faqs/entities/faqs";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";
export interface FAQSRepository {
  createFAQS(faqs: FAQSModel): Promise<Either<ErrorClass, FAQSEntity>>;
  getFAQS(): Promise<Either<ErrorClass, FAQSEntity[]>>;
}


