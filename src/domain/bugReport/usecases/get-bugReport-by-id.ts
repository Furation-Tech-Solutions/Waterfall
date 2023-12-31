// Import necessary modules and types
import { BugReportEntity } from "@domain/bugReport/entities/bugReport";
import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define the interface for the GetBugReportByIdUsecase
export interface GetBugReportByIdUsecase {
  // Define a method called "execute" that takes a bugReportId and returns a Promise of Either
  execute: (
    bugReportId: string
  ) => Promise<Either<ErrorClass, BugReportEntity>>;
}

// Define the class that implements the GetBugReportByIdUsecase interface
export class GetBugReportById implements GetBugReportByIdUsecase {
  // Declare a private property to hold the BugReportRepository
  private readonly bugReportRepository: BugReportRepository;

  // Constructor to inject the BugReportRepository dependency
  constructor(bugReportRepository: BugReportRepository) {
    this.bugReportRepository = bugReportRepository;
  }

  // Implementation of the "execute" method defined in the interface
  async execute(
    bugReportId: string
  ): Promise<Either<ErrorClass, BugReportEntity>> {
    // Call the getBugReportById method of the repository and return its result
    return await this.bugReportRepository.getBugReportById(bugReportId);
  }
}
