// Import necessary modules and dependencies
import {
  JobApplicantEntity,
  JobApplicantModel,
} from "@domain/jobApplicants/entites/jobApplicants";
import { JobApplicantRepository } from "@domain/jobApplicants/repositories/jobApplicants-repository";
import { JobApplicantDataSource } from "@data/jobApplicants/datasources/jobApplicants-data-sources";
import { Either, Left, Right } from "monet";
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error";
import * as HttpStatus from "@presentation/error-handling/http-status";


// Create a class for the JobApplicantRepositoryImpl implementing the JobApplicantRepository interface
export class JobApplicantRepositoryImpl implements JobApplicantRepository {
  private readonly dataSource: JobApplicantDataSource;

  constructor(dataSource: JobApplicantDataSource) {
    this.dataSource = dataSource;
  }

  // Method to create a new job applicant
  async createJobApplicant(
    jobApplicant: JobApplicantModel
  ): Promise<Either<ErrorClass, JobApplicantEntity>> {
    try {
      // Attempt to create a job applicant using the data source
      const i = await this.dataSource.create(jobApplicant);

      // Return a Right Either indicating success with the created job applicant
      return Right<ErrorClass, JobApplicantEntity>(i);
    } catch (error: any) {
      console.log(error);

      // Handle different error scenarios
      if (error instanceof ApiError && error.status === 401) {
        // If unauthorized, return an Unauthorized error
        return Left<ErrorClass, JobApplicantEntity>(ApiError.unAuthorized());
      }
      // Return a custom error with a Bad Request status and the error message
      return Left<ErrorClass, JobApplicantEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Method to update a job applicant by ID
  async updateJobApplicant(
    id: string,
    data: JobApplicantModel
  ): Promise<Either<ErrorClass, JobApplicantEntity>> {
    try {
      // Attempt to update the job applicant using the data source
      const response = await this.dataSource.update(id, data);

      // Return a Right Either indicating success with the updated job applicant
      return Right<ErrorClass, JobApplicantEntity>(response);
    } catch (error: any) {
      // Return a custom error with a Bad Request status and the error message
      return Left<ErrorClass, JobApplicantEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Method to retrieve all job applicants
  async getJobApplicants(
    id: string,
    q: string
  ): Promise<Either<ErrorClass, JobApplicantEntity[]>> {
    try {
      // Attempt to get all job applicants using the data source
      const response = await this.dataSource.getAll(id, q);

      // Return a Right Either indicating success with an array of job applicants
      return Right<ErrorClass, JobApplicantEntity[]>(response);
    } catch (error: any) {
      // Handle different error scenarios
      if (error instanceof ApiError && error.status === 404) {
        // If not found, return a Not Found error
        return Left<ErrorClass, JobApplicantEntity[]>(ApiError.notFound());
      }
      // Return a custom error with a Bad Request status and the error message
      return Left<ErrorClass, JobApplicantEntity[]>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Method to retrieve a job applicant by ID
  async getJobApplicantById(
    id: string
  ): Promise<Either<ErrorClass, JobApplicantEntity>> {
    try {
      // Attempt to read a job applicant by ID using the data source
      const response = await this.dataSource.read(id);

      // Check if the response is null (not found)
      if (response === null) {
        // If not found, return a Not Found error
        return Left<ErrorClass, JobApplicantEntity>(ApiError.notFound());
      }

      // Return a Right Either indicating success with the retrieved job applicant
      return Right<ErrorClass, JobApplicantEntity>(response);
    } catch (error: any) {
      // Return a custom error with a Bad Request status and the error message
      return Left<ErrorClass, JobApplicantEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }
  // Method to delete a jobApplicant by ID
  async deleteJobApplicant(id: string): Promise<Either<ErrorClass, void>> {
    try {
      // Attempt to delete a jobApplicant using the data source
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
}
