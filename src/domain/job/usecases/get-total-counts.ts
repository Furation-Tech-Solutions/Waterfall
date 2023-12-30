// Import necessary modules and dependencies
import { JobRepository } from "@domain/job/repositories/job-repository"; // Importing JobRepository from the domain
import { Either } from "monet"; // Importing Either from the Monet library for functional programming
import ErrorClass from "@presentation/error-handling/api-error"; // Importing the ErrorClass for handling errors
import { string } from "joi"; // Importing the 'string' type from Joi for validation
import { JobQuery } from "@data/job/datasources/job-data-sources"; // Importing JobQuery from the job data sources
import { JobCountEntity } from "../entities/job";

// Define the interface for the "Get Feedback Count" use case
export interface GettotalCountUsecase {
  execute: (query: JobQuery) => Promise<Either<ErrorClass, JobCountEntity>>; // Interface method for executing the use case
}

// Implement the "Get Feedback Count" use case class
export class GettotalCount implements GettotalCountUsecase {
  private readonly jobRepository: JobRepository; // Private property to hold the job repository

  // Constructor to initialize the class with a job repository
  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository;
  }

  // Implement the execute method to retrieve the count of feedback entries
  async execute(query: JobQuery): Promise<Either<ErrorClass, JobCountEntity>> {
    return await this.jobRepository.TotalCount(query); // Call the TotalCount method of the job repository
  }
}
