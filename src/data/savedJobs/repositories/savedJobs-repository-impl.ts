// Import necessary dependencies and modules

// Import entities and models related to Saved Jobs
import {
  SavedJobEntity,
  SavedJobModel,
} from "@domain/savedJobs/entities/savedJobs";

// Import the repository interface for Saved Jobs
import { SavedJobRepository } from "@domain/savedJobs/repositories/savedJob-repository";

// Import data sources and queries for Saved Jobs
import {
  SavedJobDataSource,
  SavedJobQuery,
} from "@data/savedJobs/datasources/savedJobs-data-sources";

// Import Either, Left, and Right from the 'monet' library for functional programming
import { Either, Left, Right } from "monet";

// Import the ApiError class and the HttpStatus module for error handling
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
      const newSavedJob = await this.dataSource.create(savedJob);
      return Right<ErrorClass, SavedJobEntity>(newSavedJob);
    } catch (error: any) {
      // Handle error cases:
      if (error instanceof ApiError) {
        if (error.status === 401) {
          // If the error is an unauthorized ApiError with a status code of 401, return it as Left
          return Left<ErrorClass, SavedJobEntity>(ApiError.unAuthorized());
        } else if (error.status === 409) {
          // If the error is a conflict ApiError with a status code of 409, return it as Left
          return Left<ErrorClass, SavedJobEntity>(ApiError.savedJobExist());
        }
      }

      // If the error is not explicitly handled, return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, SavedJobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "deleteSavedJob" method defined in the SavedJobRepository interface
  async deleteSavedJob(id: string): Promise<Either<ErrorClass, void>> {
    try {
      // Delete the saved job with the given ID using the "dataSource" and return success as Right
      const deletionResult = await this.dataSource.delete(id);
      return Right<ErrorClass, void>(deletionResult);
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
      const updatedJob = await this.dataSource.update(id, data);
      return Right<ErrorClass, SavedJobEntity>(updatedJob);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, SavedJobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Implement the "getSavedJobs" method defined in the SavedJobRepository interface
  async getSavedJobs(
    query: SavedJobQuery
  ): Promise<Either<ErrorClass, SavedJobEntity[]>> {
    try {
      // Retrieve all saved jobs using the "dataSource" and return them as Right
      const allSavedJobs = await this.dataSource.getAll(query);
      // Check if the data length is zero
      if (allSavedJobs.length === 0) {
        // If data length is zero, send a success response with status code 200
        return Right<ErrorClass, SavedJobEntity[]>([]);
      }
      return Right<ErrorClass, SavedJobEntity[]>(allSavedJobs);
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
      const retrievedJob = await this.dataSource.read(id);

      // If the response is null, return a not-found ApiError as Left
      if (retrievedJob === null) {
        return Left<ErrorClass, SavedJobEntity>(ApiError.notFound());
      }

      // Otherwise, return the saved job as Right
      return Right<ErrorClass, SavedJobEntity>(retrievedJob);
    } catch (error: any) {
      // Return a custom error with a BAD_REQUEST status and the error message as Left
      return Left<ErrorClass, SavedJobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
