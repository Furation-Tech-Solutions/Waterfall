// Import necessary modules and dependencies
import { FAQModel, FAQEntity } from "@domain/faq/entities/faq";
import { FAQRepository } from "@domain/faq/repositories/faq-repository";
import { FAQDataSource } from "@data/faq/datasources/faq-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

// Define the implementation class for the FAQRepository interface
export class FAQRepositoryImpl implements FAQRepository {
  private readonly faqDataSource: FAQDataSource;

  constructor(faqDataSource: FAQDataSource) {
    this.faqDataSource = faqDataSource;
  }

  // Create a new FAQ (Frequently Asked Question) entry
  async createFAQ(faq: FAQModel): Promise<Either<ErrorClass, FAQEntity>> {
    try {
      const faqs = await this.faqDataSource.create(faq); // Use the faq data source
      return Right<ErrorClass, FAQEntity>(faqs);
    } catch (error: any) {
      if (error instanceof ApiError && error.name === "question_conflict") {
        return Left<ErrorClass, FAQEntity>(ApiError.questionExist());
      }
      return Left<ErrorClass, FAQEntity>(
        ApiError.customError(400, error.message)
      );
    }
  }

  // Retrieve all FAQ entries
  async getFAQs(): Promise<Either<ErrorClass, FAQEntity[]>> {
    try {
      const faqs = await this.faqDataSource.getAllFAQs(); // Use the tag faq data source
      return Right<ErrorClass, FAQEntity[]>(faqs);
    } catch (e) {
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, FAQEntity[]>(ApiError.notFound());
      }
      return Left<ErrorClass, FAQEntity[]>(ApiError.badRequest());
    }
  }

  // Retrieve an FAQ entry by its ID
  async getFAQById(id: string): Promise<Either<ErrorClass, FAQEntity>> {
    try {
      const faq = await this.faqDataSource.read(id); // Use the tag faq data source
      return Right<ErrorClass, FAQEntity>(faq)

    } catch (e) {
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, FAQEntity>(ApiError.notFound());
      }
      return Left<ErrorClass, FAQEntity>(ApiError.badRequest());
    }
  }

  // Update an FAQ entry by ID
  async updateFAQ(
    id: string,
    data: FAQModel
  ): Promise<Either<ErrorClass, FAQEntity>> {
    try {
      const updatedFAQ = await this.faqDataSource.update(id, data); // Use the tag faq data source
      return Right<ErrorClass, FAQEntity>(updatedFAQ);
    } catch (e) {
      if (e instanceof ApiError && e.name === "conflict") {
        return Left<ErrorClass, FAQEntity>(ApiError.emailExist());
      }
      return Left<ErrorClass, FAQEntity>(ApiError.badRequest());
    }
  }

  // Delete an FAQ entry by ID
  async deleteFAQ(id: string): Promise<Either<ErrorClass, void>> {
    try {
      const result = await this.faqDataSource.delete(id); // Use the tag faq data source
      return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
    } catch (e) {
      if (e instanceof ApiError && e.name === "notfound") {
        return Left<ErrorClass, void>(ApiError.notFound());
      }
      return Left<ErrorClass, void>(ApiError.badRequest());
    }
  }
}
