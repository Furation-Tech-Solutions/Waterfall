import { JobRepository } from "@domain/job/repositories/job-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import { string } from "joi";
import { JobQuery } from "@data/job/datasources/job-data-sources";

// Define the interface for the "Get Feedback Count" use case
export interface GettotalCountUsecase {
  execute: (query: JobQuery) => Promise<Either<ErrorClass, number>>;
}

// Implement the "Get Feedback Count" use case class
export class GettotalCount implements GettotalCountUsecase {
  private readonly jobRepository: JobRepository;

  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository;
  }

  // Implement the execute method to retrieve the count of feedback entries
  async execute(query: JobQuery): Promise<Either<ErrorClass, number>> {
    return await this.jobRepository.TotalCount(query);
  }
}

