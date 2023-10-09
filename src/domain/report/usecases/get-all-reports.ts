import { ReportEntity } from "@domain/report/entities/report"; // Import the ReportEntity interface
import { ReportRepository } from "@domain/report/repositories/report-repository"; // Import the ReportRepository interface
import { ErrorClass } from "@presentation/error-handling/api-error"; // Import the ErrorClass for error handling
import { Either } from "monet"; // Import Either for handling results with possible errors

// Define the GetAllReportsUsecase interface
export interface GetAllReportsUsecase {
  execute: () => Promise<Either<ErrorClass, ReportEntity[]>>; // Define a method for executing the use case
}

// Define the GetAllReports class that implements the GetAllReportsUsecase interface
export class GetAllReports implements GetAllReportsUsecase {
  private readonly reportRepository: ReportRepository; // Private property to hold the report repository

  // Constructor to inject the report repository dependency
  constructor(reportRepository: ReportRepository) {
    this.reportRepository = reportRepository; // Initialize the report repository
  }

  // Implementation of the execute method defined in the interface
  async execute(): Promise<Either<ErrorClass, ReportEntity[]>> {
    return await this.reportRepository.getReports(); // Call the getReports method of the report repository
  }
}
