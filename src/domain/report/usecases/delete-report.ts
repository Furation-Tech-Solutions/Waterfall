// Import necessary dependencies and interfaces
import { ReportRepository } from "@domain/report/repositories/report-repository"; // Import the ReportRepository interface
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass for error handling
import { Either } from "monet"; // Import the Either type for functional error handling

// Define the interface for the DeleteReportUsecase
export interface DeleteReportUsecase {
  execute: (reportId: string) => Promise<Either<ErrorClass, void>>; // Define the execute method with a reportId parameter
}

// Define the DeleteReport class that implements the DeleteReportUsecase interface
export class DeleteReport implements DeleteReportUsecase {
  private readonly reportRepository: ReportRepository; // Define a private property to hold the report repository

  // Constructor to initialize the DeleteReport class with a report repository
  constructor(reportRepository: ReportRepository) {
    this.reportRepository = reportRepository; // Assign the report repository to the class property
  }

  // Implementation of the execute method from the DeleteReportUsecase interface
  async execute(reportId: string): Promise<Either<ErrorClass, void>> {
    // Use the report repository to delete a report by its ID and return the result
    return await this.reportRepository.deleteReport(reportId);
  }
}
