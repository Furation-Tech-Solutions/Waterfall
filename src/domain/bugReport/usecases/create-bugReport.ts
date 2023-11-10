// Import necessary entities and types
import {
  BugReportEntity,
  BugReportModel,
} from "@domain/bugReport/entities/bugReport";
import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define the CreateBugReportUsecase interface
export interface CreateBugReportUsecase {
  execute: (
    bugReportData: BugReportModel
  ) => Promise<Either<ErrorClass, BugReportEntity>>;
}

// Implement the CreateBugReportUsecase interface in the CreateBugReport class
export class CreateBugReport implements CreateBugReportUsecase {
  private readonly bugReportRepository: BugReportRepository;

  // Constructor to inject BugReportRepository
  constructor(bugReportRepository: BugReportRepository) {
    this.bugReportRepository = bugReportRepository;
  }

  // Implementation of the execute method from the interface
  async execute(
    bugReportData: BugReportModel
  ): Promise<Either<ErrorClass, BugReportEntity>> {
    // Call the createBugReport method from the repository and return its result
    return await this.bugReportRepository.createBugReport(bugReportData);
  }
}
