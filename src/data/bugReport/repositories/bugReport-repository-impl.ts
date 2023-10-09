// Import necessary dependencies and modules
import {
  BugReportEntity,
  BugReportModel,
} from "@domain/bugReport/entities/bugReport";
import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository";
import { BugReportDataSource } from "@data/bugReport/datasources/bugReport-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

// Implement the BugReportRepository interface with BugReportRepositoryImpl class
export class BugReportRepositoryImpl implements BugReportRepository {
  // Define a private member "dataSource" of type BugReportDataSource
  private readonly dataSource: BugReportDataSource;

  // Constructor that accepts a "dataSource" parameter and sets it as a member
  constructor(dataSource: BugReportDataSource) {
    this.dataSource = dataSource;
  }

  // Implement the "createBugReport" method defined in the BugReportRepository interface
  async createBugReport(
    bugReport: BugReportModel
  ): Promise<Either<ErrorClass, BugReportEntity>> {
    try {
      // Create a new bug report using the "dataSource" and return it as a Right Either
      const i = await this.dataSource.create(bugReport);
      return Right<ErrorClass, BugReportEntity>(i);
    } catch (error: any) {
      console.log(error);

      // Handle error cases:
      // If the error is an unauthorized ApiError with a status code of 401, return it as Left
      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, BugReportEntity>(ApiError.unAuthorized());
      }

      // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, BugReportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "deleteBugReport" method defined in the BugReportRepository interface
  async deleteBugReport(id: string): Promise<Either<ErrorClass, void>> {
    try {
      // Delete the bug report with the given ID using the "dataSource" and return success as Right
      const res = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(res);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  // Implement the "updateBugReport" method defined in the BugReportRepository interface
  async updateBugReport(
    id: string,
    data: BugReportModel
  ): Promise<Either<ErrorClass, BugReportEntity>> {
    try {
      // Update the bug report with the given ID using the "dataSource" and return the updated report as Right
      const response = await this.dataSource.update(id, data);
      return Right<ErrorClass, BugReportEntity>(response);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, BugReportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "getBugReports" method defined in the BugReportRepository interface
  async getBugReports(): Promise<Either<ErrorClass, BugReportEntity[]>> {
    try {
      // Retrieve all bug reports using the "dataSource" and return them as Right
      const response = await this.dataSource.getAll();
      return Right<ErrorClass, BugReportEntity[]>(response);
    } catch (error: any) {
      // Handle error cases:
      // If the error is a not-found ApiError with a status code of 404, return it as Left
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, BugReportEntity[]>(ApiError.notFound());
      }

      // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, BugReportEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "getBugReportById" method defined in the BugReportRepository interface
  async getBugReportById(
    id: string
  ): Promise<Either<ErrorClass, BugReportEntity>> {
    try {
      // Retrieve the bug report with the given ID using the "dataSource"
      const response = await this.dataSource.read(id);

      // If the response is null, return a not-found ApiError as Left
      if (response === null) {
        return Left<ErrorClass, BugReportEntity>(ApiError.notFound());
      }

      // Otherwise, return the bug report as Right
      return Right<ErrorClass, BugReportEntity>(response);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, BugReportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
