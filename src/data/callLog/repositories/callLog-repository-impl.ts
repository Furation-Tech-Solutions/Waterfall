// Import necessary modules and dependencies
import { CallLogEntity, CallLogModel } from "@domain/callLog/entities/callLog";
import { CallLogRepository } from "@domain/callLog/repositories/callLog-repository";
import { CallLogDataSource } from "@data/callLog/datasources/callLog-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

// Create a class for the CallLogRepositoryImpl implementing CallLogRepository
export class CallLogRepositoryImpl implements CallLogRepository {
  // Define a private property to hold the data source instance
  private readonly dataSource: CallLogDataSource;

  // Constructor to initialize the data source
  constructor(dataSource: CallLogDataSource) {
    this.dataSource = dataSource;
  }

  // Method to create a call log
  async createCallLog(
    callLog: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>> {
    try {
      // Call the data source's create method and await the result
      const i = await this.dataSource.create(callLog);
      // Return a Right with the created CallLogEntity on success
      return Right<ErrorClass, CallLogEntity>(i);
    } catch (error: any) {
      // Handle errors:
      // If it's an unauthorized error, return a Left with an unauthorized ApiError
      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, CallLogEntity>(ApiError.unAuthorized());
      }
      // Otherwise, return a Left with a custom ApiError indicating a bad request
      return Left<ErrorClass, CallLogEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Method to delete a call log by ID
  async deleteCallLog(id: string): Promise<Either<ErrorClass, void>> {
    try {
      // Call the data source's delete method and await the result
      const res = await this.dataSource.delete(id);
      // Return a Right indicating successful deletion
      return Right<ErrorClass, void>(res);
    } catch (error: any) {
      // If an error occurs, return a Left with a custom ApiError indicating a bad request
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  // Method to update a call log by ID
  async updateCallLog(
    id: string,
    data: CallLogModel
  ): Promise<Either<ErrorClass, CallLogEntity>> {
    try {
      // Call the data source's update method and await the result
      const response = await this.dataSource.update(id, data);
      // Return a Right with the updated CallLogEntity on success
      return Right<ErrorClass, CallLogEntity>(response);
    } catch (error: any) {
      // If an error occurs, return a Left with a custom ApiError indicating a bad request
      return Left<ErrorClass, CallLogEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Method to retrieve all call logs
  async getCallLogs(): Promise<Either<ErrorClass, CallLogEntity[]>> {
    try {
      // Call the data source's getAll method and await the result
      const response = await this.dataSource.getAll();
      // Return a Right with an array of CallLogEntity objects on success
      return Right<ErrorClass, CallLogEntity[]>(response);
    } catch (error: any) {
      // Handle errors:
      // If it's a not found error, return a Left with a not found ApiError
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, CallLogEntity[]>(ApiError.notFound());
      }
      // Otherwise, return a Left with a custom ApiError indicating a bad request
      return Left<ErrorClass, CallLogEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Method to retrieve a call log by ID
  async getCallLogById(id: string): Promise<Either<ErrorClass, CallLogEntity>> {
    try {
      // Call the data source's read method and await the result
      const response = await this.dataSource.read(id);
      // If the response is null (not found), return a Left with a not found ApiError
      if (response === null) {
        return Left<ErrorClass, CallLogEntity>(ApiError.notFound());
      }
      // Otherwise, return a Right with the retrieved CallLogEntity
      return Right<ErrorClass, CallLogEntity>(response);
    } catch (error: any) {
      // If an error occurs, return a Left with a custom ApiError indicating a bad request
      return Left<ErrorClass, CallLogEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
