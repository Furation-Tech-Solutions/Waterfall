import { FAQModel, FAQEntity } from "@domain/faq/entities/faq";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";

// Define the FAQRepository interface
export interface FAQRepository {
  // Method to create a new FAQ entry
  createFAQ(faq: FAQModel): Promise<Either<ErrorClass, FAQEntity>>;

  // Method to get all FAQ entries
  getFAQs(): Promise<Either<ErrorClass, FAQEntity[]>>;

  // Method to get an FAQ entry by its ID
  getFAQById(id: string): Promise<Either<ErrorClass, FAQEntity>>;

  // Method to update an existing FAQ entry by its ID
  updateFAQ(id: string, data: FAQModel): Promise<Either<ErrorClass, FAQEntity>>;

  // Method to delete an FAQ entry by its ID
  deleteFAQ(id: string): Promise<Either<ErrorClass, void>>;
}
