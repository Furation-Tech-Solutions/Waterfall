import { ReportEntity, ReportModel } from "@domain/report/entities/report";
import { ReportRepository } from "@domain/report/repositories/report-repository";
import { ReportDataSource } from "@data/report/datasources/report-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

export class ReportRepositoryImpl implements ReportRepository {
  private readonly dataSource: ReportDataSource;

  constructor(dataSource: ReportDataSource) {
    this.dataSource = dataSource;
  }

  async createReport(
    report: ReportModel
  ): Promise<Either<ErrorClass, ReportEntity>> {
    try {
      const i = await this.dataSource.create(report);
      return Right<ErrorClass, ReportEntity>(i);
    } catch (error: any) {
      console.log(error);

      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, ReportEntity>(ApiError.unAuthorized());
      }
      return Left<ErrorClass, ReportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async deleteReport(id: string): Promise<Either<ErrorClass, void>> {
    try {
      const res = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(res);
    } catch (error: any) {
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  async updateReport(
    id: string,
    data: ReportModel
  ): Promise<Either<ErrorClass, ReportEntity>> {
    try {
      const response = await this.dataSource.update(id, data);
      return Right<ErrorClass, ReportEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, ReportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getReports(): Promise<Either<ErrorClass, ReportEntity[]>> {
    try {
      const response = await this.dataSource.getAll();
      return Right<ErrorClass, ReportEntity[]>(response);
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, ReportEntity[]>(ApiError.notFound());
      }
      return Left<ErrorClass, ReportEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getReportById(id: string): Promise<Either<ErrorClass, ReportEntity>> {
    try {
      const response = await this.dataSource.read(id);
      if (response === null) {
        return Left<ErrorClass, ReportEntity>(ApiError.notFound());
      }
      return Right<ErrorClass, ReportEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, ReportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
