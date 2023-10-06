// Import necessary dependencies and types
import { BugReportEntity } from "@domain/bugReport/entities/bugReport"; // Import the BugReportEntity
import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository"; // Import the BugReportRepository
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass
import { Either } from "monet"; // Import Either for functional error handling

// Define the interface for GetAllBugReportsUsecase
export interface GetAllBugReportsUsecase {
  execute: () => Promise<Either<ErrorClass, BugReportEntity[]>>;
}

// Implement the GetAllBugReportsUsecase interface as a class
export class GetAllBugReports implements GetAllBugReportsUsecase {
  private readonly bugReportRepository: BugReportRepository; // Private property for BugReportRepository

  // Constructor to inject BugReportRepository
  constructor(bugReportRepository: BugReportRepository) {
    this.bugReportRepository = bugReportRepository;
  }

  // Implementation of the execute method from the interface
  async execute(): Promise<Either<ErrorClass, BugReportEntity[]>> {
    // Use the bugReportRepository to fetch BugReports and return the result
    return await this.bugReportRepository.getBugReports();
  }
}
