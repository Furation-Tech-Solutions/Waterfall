// Import necessary modules and types
import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository";
import { ErrorClass } from "@presentation/error-handling/api-error";
import { Either } from "monet";

// Define the DeleteBugReportUsecase interface
export interface DeleteBugReportUsecase {
  execute: (bugReportId: string) => Promise<Either<ErrorClass, void>>;
}

// Implement the DeleteBugReportUsecase interface as a class
export class DeleteBugReport implements DeleteBugReportUsecase {
  private readonly bugReportRepository: BugReportRepository;

  // Constructor to inject the bugReportRepository dependency
  constructor(bugReportRepository: BugReportRepository) {
    this.bugReportRepository = bugReportRepository;
  }

  // Implementation of the execute method from the interface
  async execute(bugReportId: string): Promise<Either<ErrorClass, void>> {
    // Call the deleteBugReport method on the bugReportRepository and return its result
    return await this.bugReportRepository.deleteBugReport(bugReportId);
  }
}
