import { JobRepository } from "@domain/job/repositories/job-repository";
import { Either } from "monet";
import ErrorClass from "@presentation/error-handling/api-error";
import { string } from "joi";

// Define the interface for the "Get Feedback Count" use case
export interface GettotalJobPostedCountUsecase {
  execute: (id: string) => Promise<Either<ErrorClass, number>>;
}

// Implement the "Get Feedback Count" use case class
export class GettotalJobPostedCount implements GettotalJobPostedCountUsecase {
  private readonly jobRepository: JobRepository;

  constructor(jobRepository: JobRepository) {
    this.jobRepository = jobRepository;
  }

  // Implement the execute method to retrieve the count of feedback entries
  async execute(id: string): Promise<Either<ErrorClass, number>> {
    return await this.jobRepository.totalPostedJobs(id);
  }
}

