// Import necessary modules and types

// Import ReportEntity and ReportModel types from the specified path
import { ReportEntity, ReportModel } from "@domain/report/entities/report";

// Import the Either type from the "monet" library for handling success or error scenarios
import { Either } from "monet";

// Import ErrorClass for error handling from the specified path
import { ErrorClass } from "@presentation/error-handling/api-error";

// Define the interface for ReportRepository
export interface ReportRepository {
  // Function to create a new report
  // Takes a ReportModel as input and returns a Promise that resolves to Either<ErrorClass, ReportEntity>
  createReport(report: ReportModel): Promise<Either<ErrorClass, ReportEntity>>;

  // Function to delete a report by ID
  // Takes a string ID as input and returns a Promise that resolves to Either<ErrorClass, void>
  deleteReport(id: string): Promise<Either<ErrorClass, void>>;

  // Function to update a report by ID
  // Takes a string ID and a ReportModel as input, returns a Promise that resolves to Either<ErrorClass, ReportEntity>
  updateReport(
    id: string,
    data: ReportModel
  ): Promise<Either<ErrorClass, ReportEntity>>;

  // Function to get all reports
  // Returns a Promise that resolves to Either<ErrorClass, ReportEntity[]>
  getReports(): Promise<Either<ErrorClass, ReportEntity[]>>;

  // Function to get a report by ID
  // Takes a string ID as input and returns a Promise that resolves to Either<ErrorClass, ReportEntity>
  getReportById(id: string): Promise<Either<ErrorClass, ReportEntity>>;
}
