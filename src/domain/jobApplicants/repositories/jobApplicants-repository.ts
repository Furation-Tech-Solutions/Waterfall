// Importing necessary modules and types
import {
  JobApplicantEntity,
  JobApplicantModel,
} from "@domain/jobApplicants/entites/jobApplicants";
import { Either } from "monet";
import { ErrorClass } from "@presentation/error-handling/api-error";

// Defining an interface for the JobApplicantRepository
export interface JobApplicantRepository {
  // Method to create a job applicant
  createJobApplicant(
    jobApplicant: JobApplicantModel
  ): Promise<Either<ErrorClass, JobApplicantEntity>>;

  // Method to update a job applicant by ID
  updateJobApplicant(
    id: string,
    data: JobApplicantModel
  ): Promise<Either<ErrorClass, JobApplicantEntity>>;

  // Method to get a list of job applicants
  getJobApplicants(
    id: string,
    q: string
  ): Promise<Either<ErrorClass, JobApplicantEntity[]>>;

  // Method to get a job applicant by ID
  getJobApplicantById(
    id: string
  ): Promise<Either<ErrorClass, JobApplicantEntity>>;

  // Define a method to delete a jobApplicant by its ID and return an Either monad with a void result or an ErrorClass
  deleteJobApplicant(id: string): Promise<Either<ErrorClass, void>>;
}
