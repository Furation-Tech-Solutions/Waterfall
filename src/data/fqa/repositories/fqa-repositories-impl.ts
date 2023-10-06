import { FQAModel, FQAEntity } from "@domain/fqa/entities/fqa";
import { FQARepository } from "@domain/fqa/repositories/fqa-repository";
import { FQADataSource } from "@data/fqa/datasources/fqa-data-source";
import { Either, Right, Left } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import ApiError from "@presentation/error-handling/api-error";

export class FQARepositoryImpl implements FQARepository {
  private readonly fqaDataSource: FQADataSource;
  constructor(fqaDataSource: FQADataSource) {
      this.fqaDataSource = fqaDataSource;
  }

  async createFQA(fqa: FQAModel): Promise<Either<ErrorClass, FQAEntity>> {
      try {
          const fqas = await this.fqaDataSource.create(fqa); // Use the fqa data source
          return Right<ErrorClass, FQAEntity>(fqas);
      } catch (error:any) {
          if (error instanceof ApiError && error.name === "badRequest") {
              return Left<ErrorClass, FQAEntity>(ApiError.badRequest());
          }
          return Left<ErrorClass, FQAEntity>(ApiError.customError(400, error.message));
      }
  }

  async getFQAs(): Promise<Either<ErrorClass, FQAEntity[]>> {
      try {
          const fqas = await this.fqaDataSource.getAllFQAs(); // Use the tag fqa data source
          return Right<ErrorClass, FQAEntity[]>(fqas);
      } catch (e) {
          if (e instanceof ApiError && e.name === "notfound") {
              return Left<ErrorClass, FQAEntity[]>(ApiError.notFound());
          }
          return Left<ErrorClass, FQAEntity[]>(ApiError.badRequest());
      }
  }

  async getFQAById(id: string): Promise<Either<ErrorClass, FQAEntity>> {
      try {
          const fqa = await this.fqaDataSource.read(id); // Use the tag fqa data source
          return fqa
              ? Right<ErrorClass, FQAEntity>(fqa)
              : Left<ErrorClass, FQAEntity>(ApiError.notFound());
      } catch (e) {
          if (e instanceof ApiError && e.name === "notfound") {
              return Left<ErrorClass, FQAEntity>(ApiError.notFound());
          }
          return Left<ErrorClass, FQAEntity>(ApiError.badRequest());
      }
  }

  async updateFQA(id: string, data: FQAModel): Promise<Either<ErrorClass, FQAEntity>> {
      try {
          const updatedFQA = await this.fqaDataSource.update(id, data); // Use the tag fqa data source
          return Right<ErrorClass, FQAEntity>(updatedFQA);
      } catch (e) {
          if (e instanceof ApiError && e.name === "conflict") {
              return Left<ErrorClass, FQAEntity>(ApiError.emailExist());
          }
          return Left<ErrorClass, FQAEntity>(ApiError.badRequest());
      }
  }

  async deleteFQA(id: string): Promise<Either<ErrorClass, void>> {
      try {
          const result = await this.fqaDataSource.delete(id); // Use the tag fqa data source
          return Right<ErrorClass, void>(result); // Return Right if the deletion was successful
      } catch (e) {
          if (e instanceof ApiError && e.name === "notfound") {
              return Left<ErrorClass, void>(ApiError.notFound());
          }
          return Left<ErrorClass, void>(ApiError.badRequest());
      }
  }
}

