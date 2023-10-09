// Import necessary modules and classes
import { JobEntity } from "@domain/job/entities/job"; // Importing the JobEntity class from a specific module
import { JobRepository } from "@domain/job/repositories/job-repository"; // Importing the JobRepository class from a specific module
import { ErrorClass } from "@presentation/error-handling/api-error"; // Importing the ErrorClass class from a specific module
import { Either } from "monet"; // Importing the Either class from the "monet" library

// Define an interface for the GetAllJobs use case
export interface GetAllJobsUsecase {
  execute: () => Promise<Either<ErrorClass, JobEntity[]>>; // A method named "execute" that returns a Promise of Either type
}

// Implement the GetAllJobs class that implements the GetAllJobsUsecase interface
export class GetAllJobs implements GetAllJobsUsecase {
  private readonly jobRepository: JobRepository; // Declare a private property named "jobRepository" of type JobRepository

  // Constructor to initialize the jobRepository property
  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository; // Assign the provided jobRepository parameter to the class property
  }

  // Implementation of the "execute" method defined in the interface
  async execute(): Promise<Either<ErrorClass, JobEntity[]>> {
    return await this.jobRepository.getJobs(); // Invoke the "getJobs" method of jobRepository and return its result
  }
}
