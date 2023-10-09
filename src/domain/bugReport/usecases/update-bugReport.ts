// Import necessary dependencies and interfaces
import {
  BugReportEntity,
  BugReportModel,
} from "@domain/bugReport/entities/bugReport";
import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define the interface for the UpdateBugReportUsecase
export interface UpdateBugReportUsecase {
  execute: (
    bugReportId: string,
    bugReportData: BugReportModel
  ) => Promise<Either<ErrorClass, BugReportEntity>>;
}

// Implement the UpdateBugReportUsecase interface as a class
export class UpdateBugReport implements UpdateBugReportUsecase {
  private readonly bugReportRepository: BugReportRepository;

  // Constructor to inject the BugReportRepository
  constructor(bugReportRepository: BugReportRepository) {
    this.bugReportRepository = bugReportRepository;
  }

  // Implementation of the execute method defined in the interface
  async execute(
    bugReportId: string,
    bugReportData: BugReportModel
  ): Promise<Either<ErrorClass, BugReportEntity>> {
    // Call the updateBugReport method from the repository
    return await this.bugReportRepository.updateBugReport(
      bugReportId,
      bugReportData
    );
  }
}
