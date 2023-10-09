// Import necessary modules and classes
import { JobApplicantEntity } from "@domain/jobApplicants/entites/jobApplicants"; // Importing the JobApplicantEntity class
import { JobApplicantRepository } from "@domain/jobApplicants/repositories/jobApplicants-repository"; // Importing the JobApplicantRepository class
import { ErrorClass } from "@presentation/error-handling/api-error"; // Importing the ErrorClass class
import { Either } from "monet"; // Importing the Either class from the 'monet' library

// Define an interface for the GetJobApplicantById use case
export interface GetJobApplicantByIdUsecase {
  execute: (
    jobApplicantId: string
  ) => Promise<Either<ErrorClass, JobApplicantEntity>>;
}

// Implement the GetJobApplicantById class which implements the GetJobApplicantByIdUsecase interface
export class GetJobApplicantById implements GetJobApplicantByIdUsecase {
  private readonly jobApplicantRepository: JobApplicantRepository; // Private property to hold the JobApplicantRepository instance

  // Constructor that takes a JobApplicantRepository instance as a parameter
  constructor(jobApplicantRepository: JobApplicantRepository) {
    this.jobApplicantRepository = jobApplicantRepository;
  }

  // Implement the 'execute' method required by the interface
  async execute(
    jobApplicantId: string
  ): Promise<Either<ErrorClass, JobApplicantEntity>> {
    // Call the 'getJobApplicantById' method of the repository and return the result
    return await this.jobApplicantRepository.getJobApplicantById(
      jobApplicantId
    );
  }
}
