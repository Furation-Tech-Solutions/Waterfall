// Import necessary dependencies and modules
import {
  SavedJobEntity,
  SavedJobModel,
} from "@domain/savedJobs/entities/savedJobs";
import { SavedJobRepository } from "@domain/savedJobs/repositories/savedJob-repository";
import { SavedJobDataSource } from "@data/savedJobs/datasources/savedJobs-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

// Implement the SavedJobRepository interface with SavedJobRepositoryImpl class
export class SavedJobRepositoryImpl implements SavedJobRepository {
  // Define a private member "dataSource" of type SavedJobDataSource
  private readonly dataSource: SavedJobDataSource;

  // Constructor that accepts a "dataSource" parameter and sets it as a member
  constructor(dataSource: SavedJobDataSource) {
    this.dataSource = dataSource;
  }

  // Implement the "createSavedJob" method defined in the SavedJobRepository interface
  async createSavedJob(
    savedJob: SavedJobModel
  ): Promise<Either<ErrorClass, SavedJobEntity>> {
    try {
      // Create a new saved job using the "dataSource" and return it as a Right Either
      const i = await this.dataSource.create(savedJob);
      return Right<ErrorClass, SavedJobEntity>(i);
    } catch (error: any) {
      console.log(error);

      // Handle error cases:
      // If the error is an unauthorized ApiError with a status code of 401, return it as Left
      if (error instanceof ApiError && error.status === 401) {
        return Left<ErrorClass, SavedJobEntity>(ApiError.unAuthorized());
      }

      // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, SavedJobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "deleteSavedJob" method defined in the SavedJobRepository interface
  async deleteSavedJob(id: string): Promise<Either<ErrorClass, void>> {
    try {
      // Delete the saved job with the given ID using the "dataSource" and return success as Right
      const res = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(res);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  // Implement the "updateSavedJob" method defined in the SavedJobRepository interface
  async updateSavedJob(
    id: string,
    data: SavedJobModel
  ): Promise<Either<ErrorClass, SavedJobEntity>> {
    try {
      // Update the saved job with the given ID using the "dataSource" and return the updated job as Right
      const response = await this.dataSource.update(id, data);
      return Right<ErrorClass, SavedJobEntity>(response);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, SavedJobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "getSavedJobs" method defined in the SavedJobRepository interface
  async getSavedJobs(): Promise<Either<ErrorClass, SavedJobEntity[]>> {
    try {
      // Retrieve all saved jobs using the "dataSource" and return them as Right
      const response = await this.dataSource.getAll();
      return Right<ErrorClass, SavedJobEntity[]>(response);
    } catch (error: any) {
      // Handle error cases:
      // If the error is a not-found ApiError with a status code of 404, return it as Left
      if (error instanceof ApiError && error.status === 404) {
        return Left<ErrorClass, SavedJobEntity[]>(ApiError.notFound());
      }

      // Otherwise, return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, SavedJobEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "getSavedJobById" method defined in the SavedJobRepository interface
  async getSavedJobById(
    id: string
  ): Promise<Either<ErrorClass, SavedJobEntity>> {
    try {
      // Retrieve the saved job with the given ID using the "dataSource"
      const response = await this.dataSource.read(id);

      // If the response is null, return a not-found ApiError as Left
      if (response === null) {
        return Left<ErrorClass, SavedJobEntity>(ApiError.notFound());
      }

      // Otherwise, return the saved job as Right
      return Right<ErrorClass, SavedJobEntity>(response);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, SavedJobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
