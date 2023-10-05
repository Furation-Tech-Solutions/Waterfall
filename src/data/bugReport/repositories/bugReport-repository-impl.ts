import { BugReportEntity, BugReportModel } from "@domain/bugReport/entities/bugReport";
import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository";
import { BugReportDataSource } from "@data/bugReport/datasources/bugReport-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

export class BugReportRepositoryImpl implements BugReportRepository {
  private readonly dataSource: BugReportDataSource;

  constructor(dataSource: BugReportDataSource) {
    this.dataSource = dataSource;
  }

  async createBugReport(bugReport: BugReportModel): Promise<Either<ErrorClass, BugReportEntity>> {
    try {
      const i = await this.dataSource.create(bugReport);
      return Right<ErrorClass, BugReportEntity>(i);
    } catch (error: any) {
      console.log(error);

      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, BugReportEntity>(ApiError.unAuthorized());
      }
      return Left<ErrorClass, BugReportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async deleteBugReport(id: string): Promise<Either<ErrorClass, void>> {
    try {
      const res = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(res);
    } catch (error: any) {
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  async updateBugReport(
    id: string,
    data: BugReportModel
  ): Promise<Either<ErrorClass, BugReportEntity>> {
    try {
      const response = await this.dataSource.update(id, data);
      return Right<ErrorClass, BugReportEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, BugReportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getBugReports(): Promise<Either<ErrorClass, BugReportEntity[]>> {
    try {
      const response = await this.dataSource.getAll();
      return Right<ErrorClass, BugReportEntity[]>(response);
    } catch (error: any) {
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, BugReportEntity[]>(ApiError.notFound());
      }
      return Left<ErrorClass, BugReportEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  async getBugReportById(id: string): Promise<Either<ErrorClass, BugReportEntity>> {
    try {
      const response = await this.dataSource.read(id);
      if (response === null) {
        return Left<ErrorClass, BugReportEntity>(ApiError.notFound());
      }
      return Right<ErrorClass, BugReportEntity>(response);
    } catch (error: any) {
      return Left<ErrorClass, BugReportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
