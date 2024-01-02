// Importing necessary modules and types
import {
  JobApplicantEntity, // Importing the JobApplicantEntity type
  JobApplicantModel, // Importing the JobApplicantModel type
} from "@domain/jobApplicants/entites/jobApplicants";

import { Either } from "monet"; // Importing the Either monad from the 'monet' library
import { ErrorClass } from "@presentation/error-handling/api-error"; // Importing the ErrorClass type
import { JobApplicantQuery } from "@data/jobApplicants/datasources/jobApplicants-data-sources"; // Importing the JobApplicantQuery type
import { JobApplicantsResponse } from "types/jobApplicant/responseType";

// Defining an interface for the JobApplicantRepository
export interface JobApplicantRepository {
  // Method to create a job applicant
  createJobApplicant(
    jobApplicant: JobApplicantModel,
    loginId:string
  ): Promise<Either<ErrorClass, JobApplicantEntity>>;
  // The above method returns a Promise that resolves to an Either monad containing either an ErrorClass or the created JobApplicantEntity.

  // Method to update a job applicant by ID
  updateJobApplicant(
    id: string,
    data: JobApplicantModel
  ): Promise<Either<ErrorClass, JobApplicantEntity>>;
  // The above method returns a Promise that resolves to an Either monad containing either an ErrorClass or the updated JobApplicantEntity.

  // Method to get a list of job applicants
  getJobApplicants(
    query: JobApplicantQuery
  ): Promise<Either<ErrorClass, JobApplicantsResponse>>;
  // The above method returns a Promise that resolves to an Either monad containing either an ErrorClass or an array of JobApplicantEntity.

  // Method to get a job applicant by ID
  getJobApplicantById(
    id: string
  ): Promise<Either<ErrorClass, JobApplicantEntity>>;
  // The above method returns a Promise that resolves to an Either monad containing either an ErrorClass or the retrieved JobApplicantEntity.

  // Define a method to delete a jobApplicant by its ID and return an Either monad with a void result or an ErrorClass
  deleteJobApplicant(id: string): Promise<Either<ErrorClass, void>>;
  // The above method returns a Promise that resolves to an Either monad containing either an ErrorClass or void (indicating success with no specific result).
}
