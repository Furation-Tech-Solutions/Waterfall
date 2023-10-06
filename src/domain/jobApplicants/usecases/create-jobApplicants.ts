// Importing necessary modules and classes
import {
  JobApplicantEntity,
  JobApplicantModel,
} from "@domain/jobApplicants/entites/jobApplicants"; // Importing Entity and Model classes for Job Applicants
import { JobApplicantRepository } from "@domain/jobApplicants/repositories/jobApplicants-repository"; // Importing the Job Applicant Repository
import { ErrorClass } from "@presentation/error-handling/api-error"; // Importing the ErrorClass for handling errors
import { Either } from "monet"; // Importing the Either type from the Monet library for handling Either/Or scenarios

// Defining an interface for the CreateJobApplicant use case
export interface CreateJobApplicantUsecase {
  execute: (
    jobApplicantData: JobApplicantModel
  ) => Promise<Either<ErrorClass, JobApplicantEntity>>; // The execute method takes JobApplicantModel as input and returns Either<ErrorClass, JobApplicantEntity>
}

// Implementing the CreateJobApplicant use case
export class CreateJobApplicant implements CreateJobApplicantUsecase {
  private readonly jobApplicantRepository: JobApplicantRepository; // Declaring a private property to hold the JobApplicantRepository instance

  // Constructor to initialize the CreateJobApplicant class with a JobApplicantRepository
  constructor(jobApplicantRepository: JobApplicantRepository) {
    this.jobApplicantRepository = jobApplicantRepository; // Assigning the injected repository to the private property
  }

  // Implementation of the execute method from the interface
  async execute(
    jobApplicantData: JobApplicantModel
  ): Promise<Either<ErrorClass, JobApplicantEntity>> {
    // Calling the createJobApplicant method from the repository to create a new Job Applicant
    return await this.jobApplicantRepository.createJobApplicant(
      jobApplicantData
    );
  }
}
