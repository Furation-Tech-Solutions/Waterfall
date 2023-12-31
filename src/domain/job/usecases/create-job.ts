// Import necessary modules and dependencies
import { JobEntity, JobModel } from "@domain/job/entities/job"; // Importing JobEntity and JobModel from the specified location
import { JobRepository } from "@domain/job/repositories/job-repository"; // Importing JobRepository from the specified location
import { ErrorClass } from "@presentation/error-handling/api-error"; // Importing ErrorClass from the specified location
import { Either } from "monet"; // Importing Either from the "monet" library

// Define an interface for the CreateJob use case
export interface CreateJobUsecase {
  // Define the "execute" method that takes JobModel and returns a Promise containing Either
  execute: (jobData: JobModel) => Promise<Either<ErrorClass, JobEntity>>;
}

// Implement the CreateJob class that implements the CreateJobUsecase interface
export class CreateJob implements CreateJobUsecase {
  private readonly jobRepository: JobRepository; // Declare a private property "jobRepository" of type JobRepository

  // Constructor to initialize the jobRepository
  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository; // Assign the provided jobRepository to the class property
  }

  // Implementation of the "execute" method
  async execute(jobData: JobModel): Promise<Either<ErrorClass, JobEntity>> {
    // Call the "createJob" method of jobRepository with jobData and return the result as a Promise
    return await this.jobRepository.createJob(jobData);
  }
}
