import { FAQSModel, FAQSEntity } from "@domain/faqs/entities/faqs";
import { FAQSRepository } from "@domain/faqs/repositories/faqs-repository";
import { FAQSDataSource } from "@data/faqs/datasources/faqs-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class FAQSRepositoryImpl implements FAQSRepository {
  private readonly dataSource: FAQSDataSource;

  constructor(dataSource: FAQSDataSource) {
    this.dataSource = dataSource;
  }

  async createFAQS(faqs: FAQSModel): Promise<Either<ErrorClass, FAQSEntity>> {
    // return await this.dataSource.create(faqs);
    try {
      let i = await this.dataSource.create(faqs);
      return Right<ErrorClass, FAQSEntity>(i);
    } catch (e) {
      if(e instanceof ApiError && e.name === "conflict"){
        return Left<ErrorClass, FAQSEntity>(ApiError.emailExist());
      }
      return Left<ErrorClass, FAQSEntity>(ApiError.badRequest());
    }
  }

  async getFAQS(): Promise<Either<ErrorClass, FAQSEntity[]>> {
    // return await this.dataSource.getAllFAQSs();
    try {
      let i = await this.dataSource.getAllFAQSs();
      return Right<ErrorClass, FAQSEntity[]>(i);
    } catch {
      return Left<ErrorClass, FAQSEntity[]>(ApiError.badRequest());
    }
  }

  async getFAQSById(id: string): Promise<Either<ErrorClass, FAQSEntity | null>> {
    // return await this.dataSource.read(id);
    try {
      let i = await this.dataSource.read(id);
      return Right<ErrorClass, FAQSEntity | null>(i);
    } catch {
      return Left<ErrorClass, FAQSEntity | null>(ApiError.badRequest());
    }
  }

  async updateFAQS(id: string, data: FAQSModel): Promise<Either<ErrorClass, FAQSEntity>> {
    // return await this.dataSource.update(id, data);
    try {
      let i = await this.dataSource.update(id, data);
      return Right<ErrorClass, FAQSEntity>(i);
    } catch {
      return Left<ErrorClass, FAQSEntity>(ApiError.badRequest());
    }
  }
}


