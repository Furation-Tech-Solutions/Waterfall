// Import necessary modules and classes
import { JobEntity } from "@domain/job/entities/job"; // Import the JobEntity class
import { JobRepository } from "@domain/job/repositories/job-repository"; // Import the JobRepository interface
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass for error handling
import { Either } from "monet"; // Import the Either class for handling Either type

// Define an interface for the GetJobById use case
export interface GetJobByIdUsecase {
  execute: (jobId: string) => Promise<Either<ErrorClass, JobEntity>>; // A method that takes a jobId and returns a Promise of Either containing an ErrorClass or a JobEntity
}

// Implement the GetJobById use case
export class GetJobById implements GetJobByIdUsecase {
  private readonly jobRepository: JobRepository; // Private member variable to store the job repository instance

  // Constructor that takes a JobRepository instance as a parameter
  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository; // Initialize the jobRepository with the provided instance
  }

  // Implementation of the execute method defined in the interface
  async execute(jobId: string): Promise<Either<ErrorClass, JobEntity>> {
    return await this.jobRepository.getJobById(jobId); // Call the getJobById method of the job repository and return its result
  }
}
