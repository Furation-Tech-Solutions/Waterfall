import { AgreementEntity, AgreementModel } from "@domain/agreement/entities/agreement";
import { AgreementRepository } from "@domain/agreement/repositories/agreement-repository";
import { AgreementDataSource } from "@data/agreement/datasources/agreement-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

export class AgreementRepositoryImpl implements AgreementRepository {
  private readonly dataSource: AgreementDataSource;

  constructor(dataSource: AgreementDataSource) {
    this.dataSource = dataSource;
  }

  async createAgreement(
    agreement: AgreementModel
  ): Promise<Either<ErrorClass, AgreementEntity>> {
    try {
      const i = await this.dataSource.create(agreement);
      return Right<ErrorClass, AgreementEntity>(i);
    } catch (error: any) {
      console.log(error);

      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, AgreementEntity>(ApiError.unAuthorized());
      }
      return Left<ErrorClass, AgreementEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async updateAgreement(
    id: string,
    data: AgreementModel
  ): Promise<Either<ErrorClass, AgreementEntity>> {
    try {
      const response = await this.dataSource.update(id, data);
      return Right<ErrorClass, AgreementEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, AgreementEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getAgreements(): Promise<Either<ErrorClass, AgreementEntity[]>> {
    try {
      const response = await this.dataSource.getAll();
      return Right<ErrorClass, AgreementEntity[]>(response);
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, AgreementEntity[]>(ApiError.notFound());
      }
      return Left<ErrorClass, AgreementEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getAgreementById(
    id: string
  ): Promise<Either<ErrorClass, AgreementEntity>> {
    try {
      const response = await this.dataSource.read(id);
      if (response === null) {
        return Left<ErrorClass, AgreementEntity>(ApiError.notFound());
      }
      return Right<ErrorClass, AgreementEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, AgreementEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
