// Import necessary entities and types
import {
  BugReportEntity,
  BugReportModel,
} from "@domain/bugReport/entities/bugReport";
import { Either } from "monet"; // Import the Either type for handling possible errors
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass for error handling

// Define the BugReportRepository interface
export interface BugReportRepository {
  // Function to create a new BugReport
  createBugReport(
    bugReport: BugReportModel
  ): Promise<Either<ErrorClass, BugReportEntity>>;

  // Function to delete a BugReport by ID
  deleteBugReport(id: string): Promise<Either<ErrorClass, void>>;

  // Function to update a BugReport by ID
  updateBugReport(
    id: string,
    data: BugReportModel
  ): Promise<Either<ErrorClass, BugReportEntity>>;

  // Function to get all BugReports
  getBugReports(): Promise<Either<ErrorClass, BugReportEntity[]>>;

  // Function to get a BugReport by ID
  getBugReportById(id: string): Promise<Either<ErrorClass, BugReportEntity>>;
}
