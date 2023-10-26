// Import necessary modules and classes from external dependencies and local files
import { JobApplicantEntity } from "@domain/jobApplicants/entites/jobApplicants"; // Importing the JobApplicantEntity class
import { JobApplicantRepository } from "@domain/jobApplicants/repositories/jobApplicants-repository"; // Importing the JobApplicantRepository class
import { ErrorClass } from "@presentation/error-handling/api-error"; // Importing the ErrorClass class
import { Either } from "monet"; // Importing the Either class from the 'monet' library

// Define an interface for the 'GetAllJobApplicants' use case
export interface GetAllJobApplicantsUsecase {
  // Define a method 'execute' that returns a Promise of Either<ErrorClass, JobApplicantEntity[]>
  execute: (
    loginId: string,
    q: string
  ) => Promise<Either<ErrorClass, JobApplicantEntity[]>>;
}

// Define a class 'GetAllJobApplicants' that implements the 'GetAllJobApplicantsUsecase' interface
export class GetAllJobApplicants implements GetAllJobApplicantsUsecase {
  private readonly jobApplicantRepository: JobApplicantRepository;

  // Constructor to initialize the 'jobApplicantRepository' property
  constructor(jobApplicantRepository: JobApplicantRepository) {
    this.jobApplicantRepository = jobApplicantRepository;
  }

  // Implementation of the 'execute' method from the interface
  async execute(
    loginId: string,
    q: string
  ): Promise<Either<ErrorClass, JobApplicantEntity[]>> {
    // Call the 'getJobApplicants' method of the 'jobApplicantRepository' to retrieve job applicants
    return await this.jobApplicantRepository.getJobApplicants(
      loginId,
      q
    );
  }
}
