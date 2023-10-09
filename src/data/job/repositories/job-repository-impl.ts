// Import necessary modules and dependencies
import { JobEntity, JobModel } from "@domain/job/entities/job";
import { JobRepository } from "@domain/job/repositories/job-repository";
import { JobDataSource } from "@data/job/datasources/job-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";

// Define a class for the implementation of the JobRepository interface
export class JobRepositoryImpl implements JobRepository {
  // Private member variable to store the data source
  private readonly dataSource: JobDataSource;

  // Constructor to initialize the data source
  constructor(dataSource: JobDataSource) {
    this.dataSource = dataSource;
  }

  // Method to create a new job
  async createJob(job: JobModel): Promise<Either<ErrorClass, JobEntity>> {
    try {
      // Attempt to create a job using the data source
      const i = await this.dataSource.create(job);
      // Return a Right monad with the created job on success
      return Right<ErrorClass, JobEntity>(i);
    } catch (error: any) {
      // Check if the error is an instance of ApiError and has a status of 401 (Unauthorized)
      if (error instanceof ApiError && error.status === 401) {
        // Return a Left monad with an unauthorized error
        return Left<ErrorClass, JobEntity>(ApiError.unAuthorized());
      }

      // Return a Left monad with a custom error and the error message
      return Left<ErrorClass, JobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Method to delete a job by ID
  async deleteJob(id: string): Promise<Either<ErrorClass, void>> {
    try {
      // Attempt to delete a job using the data source
      const res = await this.dataSource.delete(id);
      // Return a Right monad with a successful response on success
      return Right<ErrorClass, void>(res);
    } catch (error: any) {
      // If an error occurs during job deletion

      // Return a Left monad with a custom error and the error message
      return Left<ErrorClass, void>(
        ApiError.customError(HttpStatus.BAD_REQUEST, `${error.message}`)
      );
    }
  }

  // Method to update a job by ID
  async updateJob(
    id: string,
    data: JobModel
  ): Promise<Either<ErrorClass, JobEntity>> {
    try {
      // Attempt to update a job using the data source
      const response = await this.dataSource.update(id, data);
      // Return a Right monad with the updated job on success
      return Right<ErrorClass, JobEntity>(response);
    } catch (error: any) {
      // If an error occurs during job update

      // Return a Left monad with a custom error and the error message
      return Left<ErrorClass, JobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Method to retrieve all jobs
  async getJobs(): Promise<Either<ErrorClass, JobEntity[]>> {
    try {
      // Attempt to retrieve all jobs using the data source
      const response = await this.dataSource.getAll();
      // Return a Right monad with an array of job entities on success
      return Right<ErrorClass, JobEntity[]>(response);
    } catch (error: any) {
      // If an error occurs during job retrieval

      // Check if the error is an instance of ApiError and has a status of 404 (Not Found)
      if (error instanceof ApiError && error.status === 404) {
        // Return a Left monad with a not found error
        return Left<ErrorClass, JobEntity[]>(ApiError.notFound());
      }

      // Return a Left monad with a custom error and the error message
      return Left<ErrorClass, JobEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Method to retrieve a job by ID
  async getJobById(id: string): Promise<Either<ErrorClass, JobEntity>> {
    try {
      // Attempt to retrieve a job by ID using the data source
      const response = await this.dataSource.read(id);

      // Check if the response is null (job not found)
      if (response === null) {
        // Return a Left monad with a not found error
        return Left<ErrorClass, JobEntity>(ApiError.notFound());
      }

      // Return a Right monad with the retrieved job entity on success
      return Right<ErrorClass, JobEntity>(response);
    } catch (error: any) {
      // If an error occurs during job retrieval

      // Return a Left monad with a custom error and the error message
      return Left<ErrorClass, JobEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
}
