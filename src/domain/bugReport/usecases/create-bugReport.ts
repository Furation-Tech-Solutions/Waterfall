import {
  BugReportEntity,
  BugReportModel,
} from "@domain/bugReport/entities/bugReport"; // Import BugReportEntity and BugReportModel
import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository"; // Import BugReportRepository
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import ErrorClass for error handling
import { Either } from "monet"; // Import Either for functional error handling

// Define the CreateBugReportUsecase interface
export interface CreateBugReportUsecase {
  execute: (
    bugReportData: BugReportModel
  ) => Promise<Either<ErrorClass, BugReportEntity>>;
}

// Implement the CreateBugReportUsecase interface in the CreateBugReport class
export class CreateBugReport implements CreateBugReportUsecase {
  private readonly bugReportRepository: BugReportRepository; // Private property to store the BugReportRepository

  // Constructor to inject BugReportRepository
  constructor(bugReportRepository: BugReportRepository) {
    this.bugReportRepository = bugReportRepository; // Assign the injected repository to the class property
  }

  // Implementation of the execute method from the interface
  async execute(
    bugReportData: BugReportModel
  ): Promise<Either<ErrorClass, BugReportEntity>> {
    // Call the createBugReport method from the repository and return its result
    return await this.bugReportRepository.createBugReport(bugReportData);
  }
}
