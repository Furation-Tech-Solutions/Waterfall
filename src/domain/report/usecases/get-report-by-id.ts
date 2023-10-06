import { ReportEntity } from "@domain/report/entities/report"; // Import the ReportEntity from the report entities
import { ReportRepository } from "@domain/report/repositories/report-repository"; // Import the ReportRepository interface
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass from the API error handling
import { Either } from "monet"; // Import the Either type from the Monet library

// Define the interface for the GetReportByIdUsecase
export interface GetReportByIdUsecase {
  execute: (reportId: string) => Promise<Either<ErrorClass, ReportEntity>>; // Define the execute method with a reportId parameter that returns a Promise with an Either result
}

// Implement the GetReportByIdUsecase interface in the GetReportById class
export class GetReportById implements GetReportByIdUsecase {
  private readonly reportRepository: ReportRepository; // Define a private property to hold the reportRepository

  // Constructor to initialize the GetReportById class with a reportRepository dependency
  constructor(reportRepository: ReportRepository) {
    this.reportRepository = reportRepository;
  }

  // Implement the execute method to fetch a report by its ID
  async execute(reportId: string): Promise<Either<ErrorClass, ReportEntity>> {
    // Call the getReportById method of the reportRepository and return the result
    return await this.reportRepository.getReportById(reportId);
  }
}
