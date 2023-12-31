// Import necessary dependencies and modules
import { ReportEntity, ReportModel } from "@domain/report/entities/report";
import { ReportRepository } from "@domain/report/repositories/report-repository";
import { ReportDataSource } from "@data/report/datasources/report-data-sources";
import { Either, Left, Right } from "monet"; // Using the Monet library for Either monad
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

// Implement the ReportRepository interface with ReportRepositoryImpl class
export class ReportRepositoryImpl implements ReportRepository {
  // Define a private member "dataSource" of type ReportDataSource
  private readonly dataSource: ReportDataSource;

  // Constructor that accepts a "dataSource" parameter and sets it as a member
  constructor(dataSource: ReportDataSource) {
    this.dataSource = dataSource;
  }

  // Implement the "createReport" method defined in the ReportRepository interface
  async createReport(
    report: ReportModel
  ): Promise<Either<ErrorClass, ReportEntity>> {
    try {
      // Create a new report using the "dataSource" and return it as a Right Either
      const createdReport = await this.dataSource.create(report);
      return Right<ErrorClass, ReportEntity>(createdReport);
    } catch (error: any) {
      // Handle error cases:
      // If the error is an unauthorized ApiError with a status code of 401, return it as Left
      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, ReportEntity>(ApiError.unAuthorized());
      }

      // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, ReportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "deleteReport" method defined in the ReportRepository interface
  async deleteReport(id: string): Promise<Either<ErrorClass, void>> {
    try {
      // Delete the report with the given ID using the "dataSource" and return success as Right
      const deletionResult = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(deletionResult);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  // Implement the "updateReport" method defined in the ReportRepository interface
  async updateReport(
    id: string,
    data: ReportModel
  ): Promise<Either<ErrorClass, ReportEntity>> {
    try {
      // Update the report with the given ID using the "dataSource" and return the updated report as Right
      const updatedReport = await this.dataSource.update(id, data);
      return Right<ErrorClass, ReportEntity>(updatedReport);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, ReportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "getReports" method defined in the ReportRepository interface
  async getReports(realtId: string): Promise<Either<ErrorClass, ReportEntity[]>> {
    try {
      // Retrieve all reports using the "dataSource" and return them as Right
      const allReports = await this.dataSource.getAll(realtId);
      // Check if the data length is zero
      if (allReports.length === 0) {
        // If data length is zero, send a success response with status code 200
        return Right<ErrorClass, ReportEntity[]>([]);
      }
      return Right<ErrorClass, ReportEntity[]>(allReports);
    } catch (error: any) {
      // Handle error cases:
      // If the error is a not-found ApiError with a status code of 404, return it as Left
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, ReportEntity[]>(ApiError.notFound());
      }

      // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, ReportEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "getReportById" method defined in the ReportRepository interface
  async getReportById(id: string): Promise<Either<ErrorClass, ReportEntity>> {
    try {
      // Retrieve the report with the given ID using the "dataSource"
      const retrievedReport = await this.dataSource.read(id);

      // If the response is null, return a not-found ApiError as Left
      if (retrievedReport === null) {
        return Left<ErrorClass, ReportEntity>(ApiError.notFound());
      }

      // Otherwise, return the report as Right
      return Right<ErrorClass, ReportEntity>(retrievedReport);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, ReportEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
