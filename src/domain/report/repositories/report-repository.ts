// Import necessary modules and types
import { ReportEntity, ReportModel } from "@domain/report/entities/report"; // Import ReportEntity and ReportModel types
import { Either } from "monet"; // Import the Either type for handling success or error
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import ErrorClass for error handling

// Define the interface for ReportRepository
export interface ReportRepository {
  // Function to create a new report
  createReport(report: ReportModel): Promise<Either<ErrorClass, ReportEntity>>;

  // Function to delete a report by ID
  deleteReport(id: string): Promise<Either<ErrorClass, void>>;

  // Function to update a report by ID
  updateReport(
    id: string,
    data: ReportModel
  ): Promise<Either<ErrorClass, ReportEntity>>;

  // Function to get all reports
  getReports(): Promise<Either<ErrorClass, ReportEntity[]>>;

  // Function to get a report by ID
  getReportById(id: string): Promise<Either<ErrorClass, ReportEntity>>;
}
