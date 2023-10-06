import { BugReportRepository } from "@domain/bugReport/repositories/bugReport-repository"; // Import the BugReportRepository interface
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass for error handling
import { Either } from "monet"; // Import Either for handling success or failure results

// Define the DeleteBugReportUsecase interface
export interface DeleteBugReportUsecase {
  execute: (bugReportId: string) => Promise<Either<ErrorClass, void>>; // A function that takes a bugReportId and returns a Promise with Either result
}

// Implement the DeleteBugReportUsecase interface as a class
export class DeleteBugReport implements DeleteBugReportUsecase {
  private readonly bugReportRepository: BugReportRepository; // Private property to hold the bugReportRepository

  // Constructor to inject the bugReportRepository dependency
  constructor(bugReportRepository: BugReportRepository) {
    this.bugReportRepository = bugReportRepository; // Initialize the bugReportRepository
  }

  // Implementation of the execute method from the interface
  async execute(bugReportId: string): Promise<Either<ErrorClass, void>> {
    // Call the deleteBugReport method on the bugReportRepository and return its result
    return await this.bugReportRepository.deleteBugReport(bugReportId);
  }
}
