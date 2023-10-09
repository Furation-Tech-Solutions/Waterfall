// Import necessary modules and classes from external dependencies and local files
import { JobEntity, JobModel } from "@domain/job/entities/job"; // Import JobEntity and JobModel from the job entities module
import { JobRepository } from "@domain/job/repositories/job-repository"; // Import the JobRepository from the job repositories module
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass from the error-handling module
import { Either } from "monet"; // Import the Either class from the Monet library

// Define an interface for the UpdateJob use case
export interface UpdateJobUsecase {
  execute: (
    jobId: string,
    jobData: JobModel
  ) => Promise<Either<ErrorClass, JobEntity>>;
}

// Create a class that implements the UpdateJobUsecase interface
export class UpdateJob implements UpdateJobUsecase {
  private readonly jobRepository: JobRepository; // Declare a private class variable for the jobRepository

  // Constructor that takes a jobRepository instance as a parameter
  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository; // Assign the provided jobRepository to the class variable
  }

  // Implementation of the execute method specified in the interface
  async execute(
    jobId: string,
    jobData: JobModel
  ): Promise<Either<ErrorClass, JobEntity>> {
    // Call the updateJob method of the jobRepository with the provided jobId and jobData
    return await this.jobRepository.updateJob(jobId, jobData);
  }
}
