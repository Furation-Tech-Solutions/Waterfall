import { SupportEntity, SupportModel } from "@domain/support/entities/support";
import { SupportRepository } from "@domain/support/repositories/support-repository";
import { SupportDataSource } from "@data/support/datasources/support-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

export class SupportRepositoryImpl implements SupportRepository {
  private readonly dataSource: SupportDataSource;

  constructor(dataSource: SupportDataSource) {
    this.dataSource = dataSource;
  }

  async createSupport(support: SupportModel): Promise<Either<ErrorClass, SupportEntity>> {
    try {
      const i = await this.dataSource.create(support);
      return Right<ErrorClass, SupportEntity>(i);
    } catch (error: any) {
      console.log(error);

      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, SupportEntity>(ApiError.unAuthorized());
      }
      return Left<ErrorClass, SupportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async deleteSupport(id: string): Promise<Either<ErrorClass, void>> {
    try {
      const res = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(res);
    } catch (error: any) {
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  async updateSupport(
    id: string,
    data: SupportModel
  ): Promise<Either<ErrorClass, SupportEntity>> {
    try {
      const response = await this.dataSource.update(id, data);
      return Right<ErrorClass, SupportEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, SupportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getSupports(): Promise<Either<ErrorClass, SupportEntity[]>> {
    try {
      const response = await this.dataSource.getAll();
      return Right<ErrorClass, SupportEntity[]>(response);
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, SupportEntity[]>(ApiError.notFound());
      }
      return Left<ErrorClass, SupportEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getSupportById(id: string): Promise<Either<ErrorClass, SupportEntity>> {
    try {
      const response = await this.dataSource.read(id);
      if (response === null) {
        return Left<ErrorClass, SupportEntity>(ApiError.notFound());
      }
      return Right<ErrorClass, SupportEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, SupportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
