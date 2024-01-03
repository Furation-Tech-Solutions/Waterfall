/// Import necessary modules and dependencies
import {
  JobApplicantEntity,
  JobApplicantModel,
} from "@domain/jobApplicants/entites/jobApplicants"; // Importing entity types
import { JobApplicantRepository } from "@domain/jobApplicants/repositories/jobApplicants-repository"; // Importing repository interface
import {
  JobApplicantDataSource,
  JobApplicantQuery,
} from "@data/jobApplicants/datasources/jobApplicants-data-sources"; // Importing data source and query interfaces
import { Either, Left, Right } from "monet"; // Importing Either monad for handling success and failure
import ApiError, { ErrorClass } from "@presentation/error-handling/api-error"; // Importing custom error handling class
import * as HttpStatus from "@presentation/error-handling/http-status"; // Importing HTTP status codes
import { JobApplicantsResponse } from "types/jobApplicant/responseType";

// Create a class for the JobApplicantRepositoryImpl implementing the JobApplicantRepository interface
export class JobApplicantRepositoryImpl implements JobApplicantRepository {
  private readonly dataSource: JobApplicantDataSource;

  constructor(dataSource: JobApplicantDataSource) {
    this.dataSource = dataSource;
  }

  // Method to create a new job applicant
  async createJobApplicant(
    jobApplicant: JobApplicantModel,
    loginId: string
  ): Promise<Either<ErrorClass, JobApplicantEntity>> {
    try {
      // Attempt to create a job applicant using the data source
      const createdJobApplicant = await this.dataSource.create(jobApplicant, loginId);

      // Return a Right Either indicating success with the created job applicant
      return Right<ErrorClass, JobApplicantEntity>(createdJobApplicant);
    } catch (error: any) {
      if (error instanceof ApiError && error.name === "account Exist") {
        return Left<ErrorClass, any>(ApiError.accountExist());
      }
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
      const updatedJobApplicant = await this.dataSource.update(id, data);

      // Return a Right Either indicating success with the updated job applicant
      return Right<ErrorClass, JobApplicantEntity>(updatedJobApplicant);
    } catch (error: any) {
      // Return a custom error with a Bad Request status and the error message
      return Left<ErrorClass, JobApplicantEntity>(
        ApiError.customError(HttpStatus.BAD_REQUEST, error.message)
      );
    }
  }

  // Method to retrieve all job applicants
  async getJobApplicants(
    query: JobApplicantQuery
  ): Promise<Either<ErrorClass, JobApplicantsResponse>> {
    try {
      // Attempt to get all job applicants using the data source
      const jobApplicants = await this.dataSource.getAll(query);

      // // Check if the data length is zero
      // if (jobApplicants.length === 0) {
      //   // If data length is zero, send a success response with status code 200
      //   return Right<ErrorClass, JobApplicantEntity[]>([]);
      // }

      // // Return a Right Either indicating success with an array of job applicants
      // return Right<ErrorClass, JobApplicantEntity[]>(jobApplicants);

      // Check if the data length is zero
      if (jobApplicants.jobApplicants.length === 0) {
        // If data length is zero, send a success response with status code 200
        return Right<ErrorClass, JobApplicantsResponse>({
          jobApplicants: [],
          totalCount: 0,
        });
      }

      // Return a Right Either indicating success with an array of job applicants and totalCount
      return Right<ErrorClass, JobApplicantsResponse>({
        jobApplicants: jobApplicants.jobApplicants,
        totalCount: jobApplicants.totalCount,
      });
    } catch (error: any) {
      // Handle different error scenarios
      if (error instanceof ApiError && error.status === 404) {
        // If not found, return a Not Found error
        return Left<ErrorClass, JobApplicantsResponse>(ApiError.notFound());
      }
      // Return a custom error with a Bad Request status and the error message
      return Left<ErrorClass, JobApplicantsResponse>(
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
      const jobApplicant = await this.dataSource.read(id);

      // Check if the response is null (not found)
      if (!jobApplicant) {
        // If not found, return a Not Found error
        return Left<ErrorClass, JobApplicantEntity>(ApiError.notFound());
      }

      // Return a Right Either indicating success with the retrieved job applicant
      return Right<ErrorClass, JobApplicantEntity>(jobApplicant);
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
